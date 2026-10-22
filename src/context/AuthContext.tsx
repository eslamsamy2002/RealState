import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, StoredUser } from '../types';
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/storage';
import { supabase, isSupabaseConfigured, ADMIN_EMAIL } from '../services/supabase';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCloudAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Default Admin for offline testing (never exposed publicly on UI)
export const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-1',
  name: 'مدير المنصة (Administrator)',
  email: 'admin@darestate.local',
  phone: '+20 100 035 2695',
  role: 'admin',
  password: 'Admin123!Temp',
  createdAt: '2025-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isCloudAuth = isSupabaseConfigured();

  // Current logged in user session (default is null: start logged out)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getFromStorage<AuthUser | null>(STORAGE_KEYS.AUTH_SESSION, null);
  });

  // Local users fallback for development before cloud keys are configured
  const [localUsers, setLocalUsers] = useState<StoredUser[]>(() => {
    const existing = getFromStorage<StoredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    const hasAdmin = existing.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());
    let updated = [...existing];
    if (!hasAdmin) updated.push(DEFAULT_ADMIN);
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, updated);
    return updated;
  });

  // Backend verification of administrator authorization (enforced by DB & app_metadata)
  const verifyBackendAdminStatus = async (user: any): Promise<boolean> => {
    if (!supabase || !user) return false;
    
    // 1. Check server-set app_metadata (immutable by client SDK)
    if (user.app_metadata?.role === 'admin') {
      return true;
    }

    // 2. Query admin_users table in PostgreSQL (enforced by RLS)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data?.user_id) {
        return true;
      }
    } catch (_) {}

    // 3. Fallback verification for designated admin emails
    if (
      user.email &&
      ['admin@darestate.local', 'admin@elhamd.local', ADMIN_EMAIL.toLowerCase()].includes(
        user.email.toLowerCase()
      )
    ) {
      return true;
    }

    return false;
  };

  // Listen for Supabase auth state changes when connected
  useEffect(() => {
    if (!isCloudAuth || !supabase) return;

    // Check existing Supabase session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isUserAdmin = await verifyBackendAdminStatus(session.user);

        const userObj: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || '',
          role: isUserAdmin ? 'admin' : 'user',
        };

        setCurrentUser(userObj);
        saveToStorage(STORAGE_KEYS.AUTH_SESSION, userObj);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isUserAdmin = await verifyBackendAdminStatus(session.user);

        const userObj: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || '',
          role: isUserAdmin ? 'admin' : 'user',
        };

        setCurrentUser(userObj);
        saveToStorage(STORAGE_KEYS.AUTH_SESSION, userObj);
      } else {
        setCurrentUser(null);
        removeFromStorage(STORAGE_KEYS.AUTH_SESSION);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isCloudAuth]);

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' };
    }

    // 1. If Supabase is connected, authenticate via Supabase Auth
    if (isCloudAuth && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          // If credentials are invalid, return clear error directly
          if (error.message === 'Invalid login credentials') {
            return {
              success: false,
              error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
            };
          }

          // If network / connection error, allow offline local fallback for development
          const matchedLocal = localUsers.find(
            (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
          );
          if (matchedLocal) {
            const authSession: AuthUser = {
              id: matchedLocal.id,
              name: matchedLocal.name,
              email: matchedLocal.email,
              phone: matchedLocal.phone,
              role: matchedLocal.role,
            };
            setCurrentUser(authSession);
            saveToStorage(STORAGE_KEYS.AUTH_SESSION, authSession);
            return { success: true };
          }

          return {
            success: false,
            error: error.message,
          };
        }

        if (data.user) {
          const isUserAdmin = await verifyBackendAdminStatus(data.user);

          const authSession: AuthUser = {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'مستخدم',
            email: data.user.email || cleanEmail,
            phone: data.user.user_metadata?.phone || '',
            role: isUserAdmin ? 'admin' : 'user',
          };

          setCurrentUser(authSession);
          saveToStorage(STORAGE_KEYS.AUTH_SESSION, authSession);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || 'تعذر الاتصال بخدمة المصادقة.' };
      }
    }

    // 2. Offline testing fallback
    const matchedUser = localUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.',
      };
    }

    const authSession: AuthUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      role: matchedUser.role,
    };

    setCurrentUser(authSession);
    saveToStorage(STORAGE_KEYS.AUTH_SESSION, authSession);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'يرجى استيفاء جميع الحقول المطلوبة للتسجيل.' };
    }

    // 1. If Supabase is connected, sign up via Supabase
    if (isCloudAuth && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password.trim(),
          options: {
            data: {
              name: cleanName,
              phone: cleanPhone,
              role: 'user', // Regular user by default
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const authSession: AuthUser = {
            id: data.user.id,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            role: 'user',
          };
          setCurrentUser(authSession);
          saveToStorage(STORAGE_KEYS.AUTH_SESSION, authSession);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || 'تعذر إنشاء الحساب.' };
      }
    }

    // 2. Offline fallback
    const emailExists = localUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'user',
      password: password.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...localUsers, newUser];
    setLocalUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, updatedUsers);

    const authSession: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    setCurrentUser(authSession);
    saveToStorage(STORAGE_KEYS.AUTH_SESSION, authSession);
    return { success: true };
  };

  const logout = async () => {
    if (isCloudAuth && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out from Supabase:', e);
      }
    }
    setCurrentUser(null);
    removeFromStorage(STORAGE_KEYS.AUTH_SESSION);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isCloudAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

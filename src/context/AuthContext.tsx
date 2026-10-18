import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, StoredUser, UserRole } from '../types';
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// Initial Admin Credentials specified in requirements
export const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-1',
  name: 'مدير المنصة (Administrator)',
  email: 'admin@darestate.local',
  phone: '+20 100 123 4567',
  role: 'admin',
  password: 'Admin123!Temp',
  createdAt: '2025-01-01T00:00:00Z',
};

// Initial Demo Regular User
export const DEFAULT_DEMO_USER: StoredUser = {
  id: 'user-demo-1',
  name: 'أحمد مصطفى (بورسعيد)',
  email: 'ahmed@elhamd.local',
  phone: '+20 109 888 7777',
  role: 'user',
  password: 'User123!Temp',
  createdAt: '2025-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stored list of users in localStorage
  const [users, setUsers] = useState<StoredUser[]>(() => {
    const existing = getFromStorage<StoredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    // Ensure default admin & demo user exist
    const hasAdmin = existing.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());
    const hasDemo = existing.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase());
    
    let updated = [...existing];
    if (!hasAdmin) updated.push(DEFAULT_ADMIN);
    if (!hasDemo) updated.push(DEFAULT_DEMO_USER);
    
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, updated);
    return updated;
  });

  // Current logged in user session (default can be null or loaded from storage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getFromStorage<AuthUser | null>(STORAGE_KEYS.AUTH_SESSION, null);
  });

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check against users
    const matchedUser = users.find(
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

  const register = (
    name: string,
    email: string,
    phone: string,
    password: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'يرجى استيفاء جميع الحقول المطلوبة للتسجيل.' };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'user', // Regular user
      password: password.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, updatedUsers);

    // Auto login
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

  const logout = () => {
    setCurrentUser(null);
    removeFromStorage(STORAGE_KEYS.AUTH_SESSION);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
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

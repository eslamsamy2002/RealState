import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@darestate.local').toLowerCase();

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Singleton Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  error?: string;
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      connected: false,
      message: 'لم يتم إدخال مفاتيح اتصال Supabase في ملف .env بعد.',
    };
  }

  try {
    const { error } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        message: 'فشل الاتصال بقاعدة بيانات Supabase.',
        error: error.message,
      };
    }

    return {
      connected: true,
      message: 'تم الاتصال بقاعدة بيانات Supabase السحابية بنجاح.',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: 'حدث خطأ في الاتصال بالشبكة.',
      error: err?.message || String(err),
    };
  }
};

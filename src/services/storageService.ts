import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'لم يتم تحديد أي ملف.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP فقط.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `حجم الصورة (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح به (5 ميجابايت).`,
    };
  }

  return { valid: true };
};

export const uploadPropertyImage = async (file: File): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // If Supabase is connected, upload to Supabase Storage bucket 'property-images'
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `properties/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        return {
          success: false,
          error: `فشل رفع الصورة إلى التخزين السحابي: ${uploadError.message}`,
        };
      }

      const { data } = supabase.storage.from('property-images').getPublicUrl(filePath);
      return { success: true, url: data.publicUrl };
    } catch (err: any) {
      return {
        success: false,
        error: `خطأ أثناء رفع الصورة: ${err?.message || String(err)}`,
      };
    }
  }

  // Graceful fallback for local development before Supabase keys are entered:
  // Convert to base64 DataURL so user can test the full upload and preview workflow locally
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        success: true,
        url: reader.result as string,
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'فشل قراءة ملف الصورة محلياً.',
      });
    };
    reader.readAsDataURL(file);
  });
};

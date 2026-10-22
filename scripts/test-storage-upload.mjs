import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    env[key] = val;
  }
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Missing Supabase configuration in .env');
  process.exit(1);
}

const client = createClient(supabaseUrl, anonKey);

async function testStorage() {
  console.log('Testing image upload via Supabase Storage client...');
  
  // Create a 1x1 test png buffer
  const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(sampleBase64, 'base64');
  const filename = `test-${Date.now()}.png`;
  
  const { data, error } = await client.storage
    .from('property-images')
    .upload(`properties/${filename}`, buffer, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (error) {
    console.error('Storage upload failed:', error.message);
    process.exit(1);
  }
  
  console.log('Storage upload succeeded! Path:', data.path);
  
  const { data: publicUrlData } = client.storage
    .from('property-images')
    .getPublicUrl(data.path);
    
  console.log('Public URL:', publicUrlData.publicUrl);
  
  // Clean up
  const { error: deleteError } = await client.storage
    .from('property-images')
    .remove([data.path]);
    
  if (deleteError) {
    console.warn('Cleanup warning (RLS might prevent anon delete, which is expected):', deleteError.message);
  } else {
    console.log('Cleaned up test file successfully.');
  }
  console.log('--- STORAGE VERIFICATION PASSED ---');
}

testStorage();

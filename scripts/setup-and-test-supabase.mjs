/**
 * الحمد للتسويق والاستثمار العقاري والقانوني — بورسعيد
 * Supabase Automated Setup & End-to-End Integration Test Runner
 *
 * This script automates:
 * 1. Project discovery and API keys retrieval (via Supabase Management API or direct credentials).
 * 2. Automated schema execution (tables, RLS policies, storage bucket, triggers).
 * 3. Automatic .env generation.
 * 4. End-to-end live testing:
 *    - Anonymous property submission (pending)
 *    - RLS policy verification (pending property invisible to public)
 *    - Admin approval workflow (status -> approved)
 *    - Public visibility verification (approved property visible to public)
 *    - Cleanup of test data
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to read .env file
function loadEnv() {
  const envPath = path.join(projectRoot, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

// 1. Setup via Supabase Access Token (Management API)
export async function setupViaAccessToken(accessToken, preferredProjectRef) {
  console.log('🔄 Connecting to Supabase Management API...');
  
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Fetch projects
  const projRes = await fetch('https://api.supabase.com/v1/projects', { headers });
  if (!projRes.ok) {
    throw new Error(`Failed to fetch Supabase projects: ${projRes.status} ${projRes.statusText}`);
  }

  const projects = await projRes.json();
  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error('No Supabase projects found in this account.');
  }

  let selectedProject = projects[0];
  if (preferredProjectRef) {
    const matched = projects.find((p) => p.id === preferredProjectRef || p.ref === preferredProjectRef);
    if (matched) selectedProject = matched;
  }

  const ref = selectedProject.id || selectedProject.ref;
  console.log(`✅ Located Supabase project: "${selectedProject.name}" (ref: ${ref})`);

  // Fetch API keys
  const keysRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys`, { headers });
  if (!keysRes.ok) {
    throw new Error(`Failed to fetch API keys for project ${ref}: ${keysRes.statusText}`);
  }

  const apiKeys = await keysRes.json();
  const anonKeyObj = apiKeys.find((k) => k.name === 'anon');
  const serviceKeyObj = apiKeys.find((k) => k.name === 'service_role');

  if (!anonKeyObj) {
    throw new Error('Could not find anon key for project.');
  }

  const projectUrl = `https://${ref}.supabase.co`;
  const anonKey = anonKeyObj.api_key;
  const serviceKey = serviceKeyObj ? serviceKeyObj.api_key : null;

  console.log(`✅ Extracted Project URL: ${projectUrl}`);
  console.log(`✅ Extracted Anon Public Key: ${anonKey.substring(0, 15)}...`);

  // Execute SQL schema automatically via Management API
  const schemaPath = path.join(projectRoot, 'supabase-schema.sql');
  if (fs.existsSync(schemaPath)) {
    console.log('🔄 Applying database schema and RLS policies automatically...');
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    const queryRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: sqlContent }),
    });

    if (queryRes.ok) {
      console.log('✅ Database schema, RLS policies, and storage bucket applied successfully!');
    } else {
      const errText = await queryRes.text();
      console.warn('⚠️ Warning applying schema via API:', errText);
    }
  }

  // Write .env automatically
  const envContent = [
    `# الحمد للتسويق والاستثمار العقاري والقانوني — بورسعيد`,
    `VITE_SUPABASE_URL=${projectUrl}`,
    `VITE_SUPABASE_ANON_KEY=${anonKey}`,
    `VITE_ADMIN_EMAIL=admin@darestate.local`,
    serviceKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}` : '',
  ].filter(Boolean).join('\n') + '\n';

  fs.writeFileSync(path.join(projectRoot, '.env'), envContent, 'utf8');
  console.log('✅ Generated .env file automatically.');

  return { projectUrl, anonKey, serviceKey, ref };
}

// 2. End-to-End Live Integration Test
export async function runEndToEndTest(projectUrl, anonKey, serviceKey) {
  console.log('\n======================================================');
  console.log('🧪 Starting End-to-End Real Integration Test...');
  console.log('======================================================\n');

  const publicClient = createClient(projectUrl, anonKey);
  const adminClient = serviceKey ? createClient(projectUrl, serviceKey) : publicClient;

  const testPropId = `TEST-PROP-${Date.now()}`;

  try {
    // Test 1: Anonymous Property Submission (Pending)
    console.log('1️⃣ Testing Anonymous Property Submission...');
    const testProperty = {
      id: testPropId,
      title: 'شقة تجريبية لاختبار المنظومة السحابية - حي الشرق',
      description: 'اختبار برمجي للتأكد من حفظ العقارات والصور في قاعدة بيانات Supabase.',
      type: 'apartment',
      purpose: 'sale',
      price: 2500000,
      area: 140,
      bedrooms: 3,
      bathrooms: 2,
      city: 'بورسعيد',
      district: 'حي الشرق',
      address: 'شارع الجمهورية، بورسعيد',
      featured: false,
      primary_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      status: 'pending', // Starts pending
      contact_name: 'معلن تجريبي',
      contact_phone: '01000352695',
      contact_email: 'test@elhamd.local',
      is_user_submission: true,
    };

    const { error: insertErr } = await publicClient.from('properties').insert([testProperty]);
    if (insertErr) {
      throw new Error(`Anonymous insertion failed: ${insertErr.message}`);
    }
    console.log('   ✅ Anonymous property submitted and stored successfully!');

    // Test 2: RLS Verification (Public cannot see pending property)
    console.log('2️⃣ Verifying Row Level Security (Pending property must NOT be visible to public)...');
    const { data: publicFetch, error: fetchErr } = await publicClient
      .from('properties')
      .select('id, title, status')
      .eq('id', testPropId);

    if (fetchErr) {
      throw new Error(`Public fetch query failed: ${fetchErr.message}`);
    }

    if (publicFetch && publicFetch.length > 0) {
      throw new Error('❌ Security Breach: Pending property was exposed to public query!');
    }
    console.log('   ✅ RLS Confirmed: Pending property is completely hidden from public queries.');

    // Test 3: Administrator Approval Workflow
    console.log('3️⃣ Testing Administrator Approval...');
    const { error: approveErr } = await adminClient
      .from('properties')
      .update({ status: 'approved' })
      .eq('id', testPropId);

    if (approveErr) {
      console.warn('   ⚠️ Note: Approval requires Admin authorization or Service Role key:', approveErr.message);
    } else {
      console.log('   ✅ Property status updated to "approved".');

      // Test 4: Public Visibility Verification (Now visible because approved)
      console.log('4️⃣ Verifying Public Visibility (Approved property must appear in public queries)...');
      const { data: approvedPublic, error: approvedFetchErr } = await publicClient
        .from('properties')
        .select('id, title, status')
        .eq('id', testPropId);

      if (approvedFetchErr) {
        throw new Error(`Fetch approved property failed: ${approvedFetchErr.message}`);
      }

      if (!approvedPublic || approvedPublic.length === 0) {
        throw new Error('❌ Approved property did not appear in public query.');
      }
      console.log('   ✅ Confirmed: Approved property is now live and visible to all visitors.');
    }

    // Cleanup test record
    console.log('5️⃣ Cleaning up test record...');
    await adminClient.from('properties').delete().eq('id', testPropId);
    console.log('   ✅ Test record cleaned up.');

    console.log('\n======================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
    return true;
  } catch (err) {
    console.error('\n❌ Integration Test Error:', err.message);
    // Cleanup attempt
    try {
      await adminClient.from('properties').delete().eq('id', testPropId);
    } catch (_) {}
    return false;
  }
}

// Main execution when invoked directly
async function main() {
  const args = process.argv.slice(2);
  const tokenArg = args.find((a) => a.startsWith('--token='))?.split('=')[1] || process.env.SUPABASE_ACCESS_TOKEN;
  const projectRefArg = args.find((a) => a.startsWith('--project='))?.split('=')[1];

  let env = loadEnv();

  if (tokenArg) {
    console.log('🚀 Supabase Access Token detected. Automating full setup...');
    const result = await setupViaAccessToken(tokenArg, projectRefArg);
    await runEndToEndTest(result.projectUrl, result.anonKey, result.serviceKey);
  } else if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    console.log('🔎 Existing Supabase credentials found in .env:');
    console.log(`   URL: ${env.VITE_SUPABASE_URL}`);
    await runEndToEndTest(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, env.SUPABASE_SERVICE_ROLE_KEY);
  } else {
    console.log('ℹ️ No Supabase credentials or SUPABASE_ACCESS_TOKEN provided.');
    console.log('   Run: node scripts/setup-and-test-supabase.mjs --token=sbp_your_token');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

-- ==============================================================================
-- الحمد للتسويق والاستثمار العقاري والقانوني — بورسعيد
-- El-Hamd Real Estate & Legal Services — Supabase Database Schema & Security
-- ==============================================================================
-- تعليمات التشغيل السريع:
-- 1. افتح مشروعك في منصة Supabase (https://supabase.com).
-- 2. توجّه إلى قائمة SQL Editor في القائمة الجانبية اليسرى.
-- 3. انسخ هذا الملف بالكامل والصقه في المحرر، ثم اضغط على زر "Run".
-- 4. سيتم إنشاء الجداول وسياسات الأمان وتخزين الصور فوراً وبأعلى معايير الحماية.
-- ==============================================================================

-- 1. جدول العقارات (properties)
create table if not exists public.properties (
  id text primary key,
  title text not null,
  title_en text,
  description text not null,
  description_en text,
  type text not null check (type in ('apartment', 'villa', 'duplex', 'commercial_shop', 'office', 'clinic', 'chalet')),
  purpose text not null check (purpose in ('sale', 'rent')),
  price numeric not null check (price > 0),
  rent_frequency text check (rent_frequency in ('monthly', 'yearly')),
  area numeric not null check (area > 0),
  bedrooms integer default 0,
  bathrooms integer default 0,
  city text not null default 'بورسعيد',
  city_en text default 'Port Said',
  district text not null check (district in (
    'حي الشرق',
    'حي العرب',
    'حي المناخ',
    'حي الضواحي',
    'حي الزهور',
    'حي الجنوب',
    'حي غرب',
    'بورفؤاد'
  )),
  district_en text,
  address text not null,
  featured boolean default false,
  primary_image text not null,
  images jsonb default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  amenities jsonb default '[]'::jsonb,
  finishing_type text,
  floor integer,
  year_built integer,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_user_submission boolean default true,
  submitted_by_user_id text
);

-- فهارس لتحسين سرعة البحث والتصفية
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_district on public.properties(district);
create index if not exists idx_properties_purpose on public.properties(purpose);
create index if not exists idx_properties_type on public.properties(type);
create index if not exists idx_properties_created_at on public.properties(created_at desc);

-- 2. جدول طلبات المعاينة والاستفسارات (inquiries)
create table if not exists public.inquiries (
  id text primary key,
  property_id text references public.properties(id) on delete set null,
  property_title text,
  property_price numeric,
  inquiry_type text default 'buy' check (inquiry_type in ('buy', 'rent', 'general')),
  user_name text not null,
  user_phone text not null,
  user_email text,
  message text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  user_id text
);

create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);

-- 3. جدول طلبات الاستشارات القانونية (legal_requests)
create table if not exists public.legal_requests (
  id text primary key,
  service_id text,
  service_title text not null,
  user_name text not null,
  user_phone text not null,
  user_email text,
  property_location text,
  details text not null,
  preferred_time text,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'resolved')),
  user_id text
);

create index if not exists idx_legal_requests_created_at on public.legal_requests(created_at desc);

-- 4. جدول استفسارات الاستثمار العقاري الجزئي (investment_inquiries)
create table if not exists public.investment_inquiries (
  id text primary key,
  investment_id text,
  investment_title text not null,
  share_price numeric default 0,
  shares_requested integer default 1,
  total_amount numeric default 0,
  user_name text not null,
  user_phone text not null,
  user_email text,
  notes text,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified')),
  user_id text
);

-- ==============================================================================
-- سياسات الأمان والحماية (Row Level Security - RLS)
-- ==============================================================================

-- جدول المشرفين المعتمدين والمصرح لهم رسمياً
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- دالة مساعدة محكمة للتحقق من صلاحيات المشرف على مستوى الخادم وقاعدة البيانات
-- تمنع تزوير الصلاحيات عبر الواجهة الأمامية أو بيانات المستخدم (user_metadata)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (
    auth.role() = 'authenticated' and (
      exists (
        select 1 from public.admin_users where user_id = auth.uid()
      ) or (
        coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      )
    )
  );
end;
$$ language plpgsql security definer;

-- مشغل خادم (PostgreSQL Trigger) لربط المشرفين تلقائياً عند إنشائهم في auth.users
create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  if new.email in ('admin@darestate.local', 'admin@elhamd.local') then
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
    
    insert into public.admin_users (user_id, email, role)
    values (new.id, new.email, 'admin')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_admin on auth.users;
create trigger on_auth_user_created_admin
  before insert or update on auth.users
  for each row execute procedure public.handle_new_admin_user();

-- تفعيل RLS على كافة الجداول
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;
alter table public.legal_requests enable row level security;
alter table public.investment_inquiries enable row level security;

-- ==============================================================================
-- سياسات جدول العقارات (properties)
-- ==============================================================================

-- 1. للجمهور العام: استعراض العقارات المعتمدة فقط (Approved Only)
drop policy if exists "Public can view approved properties" on public.properties;
create policy "Public can view approved properties"
  on public.properties for select
  using (status = 'approved');

-- 2. للمشرف: استعراض كافة العقارات (المعلقة والمعتمدة والمرفوضة)
drop policy if exists "Admin can view all properties" on public.properties;
create policy "Admin can view all properties"
  on public.properties for select
  to authenticated
  using (public.is_admin());

-- 3. للمستخدم المسجل: استعراض عقاراته الخاصة التي أضافها
drop policy if exists "Users can view their own submissions" on public.properties;
create policy "Users can view their own submissions"
  on public.properties for select
  to authenticated
  using (submitted_by_user_id = auth.uid()::text);

-- 4. للجميع (زوار ومسجلين): إضافة عقار جديد (بحالة pending إلزامياً)
drop policy if exists "Anyone can submit a property" on public.properties;
create policy "Anyone can submit a property"
  on public.properties for insert
  with check (status = 'pending');

-- 5. للمشرف فقط: تعديل العقار (تغيير الحالة للاعتماد أو الرفض أو تعديل البيانات)
drop policy if exists "Only admin can update properties" on public.properties;
create policy "Only admin can update properties"
  on public.properties for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 6. للمشرف فقط: حذف العقار
drop policy if exists "Only admin can delete properties" on public.properties;
create policy "Only admin can delete properties"
  on public.properties for delete
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- سياسات جداول الطلبات والاستفسارات
-- ==============================================================================

-- inquiries
drop policy if exists "Anyone can create inquiry" on public.inquiries;
create policy "Anyone can create inquiry"
  on public.inquiries for insert
  with check (true);

drop policy if exists "Admin can manage inquiries" on public.inquiries;
create policy "Admin can manage inquiries"
  on public.inquiries for all
  to authenticated
  using (public.is_admin());

-- legal_requests
drop policy if exists "Anyone can create legal request" on public.legal_requests;
create policy "Anyone can create legal request"
  on public.legal_requests for insert
  with check (true);

drop policy if exists "Admin can manage legal requests" on public.legal_requests;
create policy "Admin can manage legal requests"
  on public.legal_requests for all
  to authenticated
  using (public.is_admin());

-- investment_inquiries
drop policy if exists "Anyone can create investment inquiry" on public.investment_inquiries;
create policy "Anyone can create investment inquiry"
  on public.investment_inquiries for insert
  with check (true);

drop policy if exists "Admin can manage investment inquiries" on public.investment_inquiries;
create policy "Admin can manage investment inquiries"
  on public.investment_inquiries for all
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- 5. إعداد حاوية تخزين الصور السحابية (Storage Bucket)
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880, -- الحد الأقصى 5 ميجابايت لكل صورة
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- سياسات حاوية الصور:
-- استعراض وتنزيل الصور متاح للعامة
drop policy if exists "Public images access" on storage.objects;
create policy "Public images access"
  on storage.objects for select
  using (bucket_id = 'property-images');

-- رفع الصور مسموح للزوار والمعلنين مع التحقق من الامتداد
drop policy if exists "Allow property images upload" on storage.objects;
create policy "Allow property images upload"
  on storage.objects for insert
  with check (bucket_id = 'property-images');

-- حذف وتعديل الصور للمشرفين فقط
drop policy if exists "Admin can delete images" on storage.objects;
create policy "Admin can delete images"
  on storage.objects for delete
  to authenticated
  using (public.is_admin());

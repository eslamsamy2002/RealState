Writing

# El-Hamd Real Estate & Legal Services — Port Said

An integrated real estate platform and specialized legal consultancy service for Port Said Governorate and Port Fouad, built with modern, high-performance web technologies (React 18, Vite, TypeScript, and Tailwind CSS). The platform integrates with Supabase for permanent cloud storage of data and images and supports direct deployment to Vercel.

---

## Platform Overview

**El-Hamd Real Estate & Legal Services** is a specialized platform serving the real estate market in Port Said and Port Fouad.

- **Browse Verified Properties:** Apartments, villas, commercial shops, administrative offices, clinics, and chalets for sale or rent.
- **Property Listings Without Mandatory Registration:** Owners and advertisers can submit properties and upload images directly without creating an account.
- **Administrative Review and Approval:** No property becomes publicly visible until a platform administrator has reviewed and approved it.
- **Permanent Cloud Storage:** Full integration with Supabase, including a PostgreSQL database and cloud storage buckets.
- **Optional User Accounts:** Users can register and sign in to track their requests, while registration remains optional.
- **Admin Portal:** A protected administrative dashboard accessible only to authorized administrators with verified permissions.
- **Real Estate Legal Services and Consultations:** Property ownership document verification, contract drafting, and real estate registration procedures in Port Said.
- **Joint Real Estate Investment:** An informational guide and consultation services for participating in income-generating commercial properties, with full disclosure of associated risks.
- **Official Contact:** Approved WhatsApp and phone number: **01000352695**.

---

## Port Said Districts and Geographic Coverage

The platform uses a unified geographic classification across property filters, submission forms, and listing cards, covering the eight designated districts and areas of Port Said:

1. **Al-Sharq District:** El-Gomhoria Street, the seafront, Atef El-Sadat Street, and the historic De Lesseps Promenade.
2. **Al-Arab District:** El-Talatiny Commercial Street, Mohamed Ali Street, the Fish Market, and El-Mansheya Square.
3. **Al-Manakh District:** El-Nasr Street, El-Amin Street, commercial markets, and key administrative locations.
4. **Al-Dawahy District:** The courthouse complex, the new land port, and the Fatma El-Zahraa area.
5. **Al-Zohour District:** December 23 Street, residential neighborhoods, and affordable housing areas.
6. **South District:** Logistics, investment, and agricultural expansion areas, including Shadir Azzam and the Ismailia Road.
7. **West District:** Modern residential developments, the Emirati District, El-Deeba, and coastal villages.
8. **Port Fouad City:** The historic villas district, beaches, ferry crossings, and quieter residential areas.

---

## Supabase Cloud Storage and Database

**Supabase** has been selected as a straightforward, integrated cloud solution for the project for the following reasons:

1. Managed PostgreSQL database hosting without the need to maintain database servers.
2. Cloud image storage through the `property-images` bucket, with fast CDN delivery and persistent image URLs.
3. Advanced Row Level Security (RLS) policies to restrict access to unapproved properties and prevent unauthorized users from modifying other users' data.
4. Authentication services for securely managing administrator and user accounts.

### Connecting Supabase in Three Simple Steps

#### Step 1: Create a Free Supabase Project

1. Visit [Supabase](<https://supabase.com>) and sign in or create a free account.
2. Click **New Project** and choose a project name, such as `elhamd-realestate`.
3. Set a secure database password and select the nearest available geographic region.

#### Step 2: Execute the Database Schema and Security Policies

1. Open your Supabase project and navigate to **SQL Editor**.
2. Open the `supabase-schema.sql` file in your project directory and copy its entire contents.
3. Paste the SQL into the editor and click **Run**.
4. The script will create the following resources, provided they are defined in the supplied SQL file:
   - The `properties` table, with policies designed to prevent unapproved listings from being publicly visible.
   - Tables for inquiries, legal service requests, and investment shares.
   - The `property-images` storage bucket, configured for a maximum file size of 5 MB and support for JPG, PNG, and WEBP images.

#### Step 3: Configure Environment Variables in `.env`

1. In the Supabase dashboard, navigate to **Project Settings → API**.
2. Copy your **Project URL** and **anon public key**.
3. In your project directory, create a `.env` file or copy `.env.example` and enter the following configuration:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
VITE_ADMIN_EMAIL=admin@darestate.local
```

4. Restart the local development server or deploy the updated project to Vercel.
5. Once the application is correctly configured, it should connect to your Supabase database and display a cloud database connection indicator in the administration dashboard.

**Security note:** The administrator email environment variable does not, by itself, enforce administrator privileges. Access must be validated through secure authentication and authorization policies. Never expose a Supabase service role key in client-side code.

---

## Administrator Permissions and Admin Portal

- **Admin Portal URL:** `/admin`
- **Route Protection:** The `/admin` route is protected by a `ProtectedRoute` component. The administration link should appear in the navigation bar or sidebar only after an authorized administrator has signed in.
- **Administrator Test Account:** Configure a dedicated administrator account through Supabase Authentication. Any test credentials must be created and verified in the actual project before use.

### Administrator Features

- View incoming property submissions with a status of **Pending Review**.
- Review property images, specifications, and advertiser contact information.
- Approve and publish a property with one action, making it available to public visitors.
- Reject a property and record the reason for rejection.
- Add new properties directly on behalf of the platform administration, with immediate publication where authorized.
- Edit and delete property listings.
- Review visitor inquiries and legal service requests.

All administrative actions must be enforced by server-side or database-level authorization policies rather than relying solely on hidden navigation links or client-side route protection.

---

## Local Development

Run the following commands from your project directory:

```
# Navigate to the project directory
cd "d:\Abo elhamd"

# Start the development server
npm run dev

# Build the production application and check for errors
npm run build
```

---

## Deployment to Vercel

The project is intended to support straightforward deployment through Vercel.

1. Connect your project repository to your [Vercel](<https://vercel.com>) account.
2. Add the following environment variables under **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
3. Ensure that the `vercel.json` file includes the appropriate SPA rewrite configuration so that direct navigation to internal routes does not return a 404 error.
4. Deploy the project and verify the production build, database connection, property submission workflow, image uploads, and administrator permissions.

---

**El-Hamd Real Estate & Legal Services — Port Said**

Your trusted destination for real estate marketing, property investment, and specialized legal consultancy in Port Said and Port Fouad.

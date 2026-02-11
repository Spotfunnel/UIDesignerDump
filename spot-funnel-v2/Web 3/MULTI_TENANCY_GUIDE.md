# Multi-Tenancy & User Management Implementation Guide

This guide details how to connect your application to specific users/companies, implement authentication, and filter data by `squad_id`.

## 1. Database Schema Setup

You need to create tables to link Supabase's built-in Auth system (`auth.users`) to your business logic (Companies, Squads).

Run the following SQL in your Supabase SQL Editor:

```sql
-- 1. Create Companies Table (if it doesn't exist)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  squad_id text not null unique, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Update Profiles Table (add columns to existing table)
-- Note: 'profiles' usually exists in Supabase starters. We just add our columns.
alter table public.profiles 
  add column if not exists company_id uuid references public.companies(id),
  add column if not exists role text default 'member',
  add column if not exists first_name text,
  add column if not exists last_name text;

-- If profiles table doesn't exist at all, run this instead:
/*
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  company_id uuid references public.companies(id),
  role text default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
*/

-- 3. Enable RLS (Row Level Security)
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.calls enable row level security;

-- 4. Ensure Calls Table has Squad ID
-- Critical: RLS won't work if this column is missing
alter table public.calls add column if not exists squad_id text;
create index if not exists idx_calls_squad_id on public.calls(squad_id);
```

## 2. Row Level Security (RLS) Policies

These policies ensure a user can ONLY see data related to their company's `squad_id`. This is the most secure way to filter records.

```sql
-- Helper function to get current user's squad_id
create or replace function get_my_squad_id()
returns text as $$
  select c.squad_id
  from public.profiles p
  join public.companies c on p.company_id = c.id
  where p.id = auth.uid()
$$ language sql security definer;

-- Policy: Users can only see calls matching their company's squad_id
create policy "Users can see calls for their squad"
on public.calls
for select
using (
  squad_id = get_my_squad_id()
);

-- Policy: Users can see their own profile
create policy "Users can see own profile"
on public.profiles
for select
using ( auth.uid() = id );

-- Policy: Users can see their own company
create policy "Users can see own company"
on public.companies
for select
using (
  id in (select company_id from public.profiles where id = auth.uid())
);
```

**Note**: Once you enable these policies, your frontend query `supabase.from('calls').select('*')` will AUTOMATICALLY return only the correct calls for that logged-in user. You don't need to manually filter by `squad_id` in your React code!

> [!CAUTION] 
> When running the SQL below in Supabase, make sure to **exclude** the ` ```sql ` and ` ``` ` formatting characters. Copy ONLY the code inside the block.

## 3. Creating a New User & Company (Onboarding Flow)

Since you are setting this up, you'll likely want a script or a flow to create the initial Tenant.

**Manual SQL Approach (for testing):**
```sql
-- 1. Create Company
insert into public.companies (name, squad_id)
values ('Acme Corp', 'squad_123')
returning id;

-- 2. Create User in Supabase Auth (do this via UI or API)

-- 3. Link User to Company (using the user ID from Auth and Company ID from step 1)
insert into public.profiles (id, email, company_id)
values ('USER_UUID_FROM_AUTH', 'dan@acme.com', 'COMPANY_UUID');
```

**Frontend Approach (Sign Up Form):**
1.  User signs up (`supabase.auth.signUp`).
2.  On success, insert row into `companies`.
3.  Insert row into `profiles` linking the two.

## 4. Frontend Integration

### Update `DataContext.tsx` to handle Auth

You need to listen for the auth state change to fetch the correct data.

```typescript
// Add auth state to your context
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchData(); // Fetch data only after we have a user
    });

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
             fetchData(); 
        } else {
             setCalls([]); // Clear data on logout
        }
    });

    return () => subscription.unsubscribe();
}, []);
```

### Accessing User Company Info
To display the company name in the UI:

```typescript
const [company, setCompany] = useState(null);

const fetchProfile = async () => {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, companies(*)') // Join companies table
        .eq('id', user.id)
        .single();
        
    setCompany(profile.companies);
}
```

const { Client } = require('pg');

const client = new Client({
    host: '3.106.102.114', // IP for aws-0-ap-southeast-2.pooler.supabase.com
    port: 6543,
    user: 'postgres.mskabsnklhprlmzugwbl',
    password: 'Walkergewert0!',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

const migrationSql = `
-- Create push_subscriptions table
create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.push_subscriptions enable row level security;

-- Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscriptions') THEN
        create policy "Users can view own subscriptions" on public.push_subscriptions for select using (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own subscriptions') THEN
        create policy "Users can insert own subscriptions" on public.push_subscriptions for insert with check (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own subscriptions') THEN
        create policy "Users can delete own subscriptions" on public.push_subscriptions for delete using (auth.uid() = user_id);
    END IF;
END
$$;

-- Indexing
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
create index if not exists push_subscriptions_endpoint_idx on public.push_subscriptions(endpoint);
`;

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        // 1. Run migration
        await client.query(migrationSql);
        console.log('Migration (table creation) successful');

        // 2. Find a business_id
        const bizRes = await client.query('SELECT id FROM public.businesses LIMIT 1');
        if (bizRes.rows.length === 0) {
            console.log('No businesses found, skipping mock call insertion');
        } else {
            const bizId = bizRes.rows[0].id;
            console.log('Found business ID:', bizId);

            // 3. Insert mock call
            const insertSql = `
        INSERT INTO public.calls (business_id, caller_number, summary, outcome)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
            const callRes = await client.query(insertSql, [bizId, '+61412345678', 'Mock test call for push notifications', 'appointment_booked']);
            console.log('Mock call inserted, ID:', callRes.rows[0].id);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();

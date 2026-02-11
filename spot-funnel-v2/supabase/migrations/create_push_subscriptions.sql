-- Create push_subscriptions table
create table if not exists push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table push_subscriptions enable row level security;

-- Policy: Users can only see their own subscriptions
create policy "Users can view own subscriptions"
  on push_subscriptions for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own subscriptions
create policy "Users can insert own subscriptions"
  on push_subscriptions for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own subscriptions
create policy "Users can delete own subscriptions"
  on push_subscriptions for delete
  using (auth.uid() = user_id);

-- Index for faster lookups
create index if not exists push_subscriptions_user_id_idx on push_subscriptions(user_id);
create index if not exists push_subscriptions_endpoint_idx on push_subscriptions(endpoint);

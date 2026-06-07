-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- Credit cards table
create table credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  bank text,
  card_type text default 'Visa',
  last_four text,
  credit_limit numeric not null,
  current_balance numeric default 0,
  statement_day integer not null,
  due_day_offset integer default 20,
  color text default '#378ADD',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Float calculation history
create table float_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  card_id uuid references credit_cards(id) on delete cascade,
  item_name text,
  purchase_date date not null,
  amount numeric,
  float_days integer,
  statement_date date,
  due_date date,
  was_recommended boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table credit_cards enable row level security;
alter table float_calculations enable row level security;

create policy "Users can manage own profile"
  on profiles for all using (auth.uid() = id);
create policy "Users can manage own cards"
  on credit_cards for all using (auth.uid() = user_id);
create policy "Users can manage own calculations"
  on float_calculations for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

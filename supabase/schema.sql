-- LeadDesk AI schema for Supabase (PostgreSQL)

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  phone text,
  telegram_username text,
  working_hours text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.business_users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'owner',
  created_at timestamptz default now(),
  constraint business_users_business_id_user_id_key unique (business_id, user_id)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  external_id text,
  full_name text,
  username text,
  phone text,
  source text default 'telegram',
  request_type text,
  city text,
  budget numeric,
  deadline text,
  status text default 'NEW',
  lead_score integer default 0,
  ai_summary text,
  human_takeover boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint leads_status_check check (
    status in (
      'NEW',
      'AI_CHATTING',
      'QUALIFIED',
      'HOT',
      'HUMAN_TAKEOVER',
      'WON',
      'LOST'
    )
  ),
  constraint leads_score_range check (lead_score >= 0 and lead_score <= 100)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  channel text default 'telegram',
  external_chat_id text,
  last_message_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  external_message_id text,
  author text,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  constraint messages_author_check check (
    author in ('client', 'ai', 'manager', 'system')
  )
);

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique references public.businesses(id) on delete cascade,
  telegram_connected boolean default false,
  telegram_username text,
  notifications jsonb default '{}'::jsonb,
  followup_enabled boolean default true,
  followup_delay_minutes integer default 30,
  followup_max_attempts integer default 2,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique references public.businesses(id) on delete cascade,
  active boolean default true,
  tone text default 'friendly',
  qualification_fields jsonb default '[]'::jsonb,
  handoff_rules jsonb default '{}'::jsonb,
  handoff_budget numeric default 8000,
  instructions text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  attempt integer default 1,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text default 'pending',
  created_at timestamptz default now()
);

create index if not exists idx_leads_business_id
  on public.leads(business_id);
create index if not exists idx_leads_status
  on public.leads(status);
create index if not exists idx_leads_created_at
  on public.leads(created_at);

create index if not exists idx_conversations_business_id
  on public.conversations(business_id);
create index if not exists idx_conversations_lead_id
  on public.conversations(lead_id);
create index if not exists idx_conversations_last_message_at
  on public.conversations(last_message_at);

create index if not exists idx_messages_conversation_id
  on public.messages(conversation_id);
create index if not exists idx_messages_created_at
  on public.messages(created_at);

create index if not exists idx_followups_scheduled_for
  on public.followups(scheduled_for);
create index if not exists idx_followups_status
  on public.followups(status);

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at
before update on public.businesses
for each row execute function public.handle_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
before update on public.leads
for each row execute function public.handle_updated_at();

drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
before update on public.conversations
for each row execute function public.handle_updated_at();

drop trigger if exists business_settings_updated_at on public.business_settings;
create trigger business_settings_updated_at
before update on public.business_settings
for each row execute function public.handle_updated_at();

drop trigger if exists ai_rules_updated_at on public.ai_rules;
create trigger ai_rules_updated_at
before update on public.ai_rules
for each row execute function public.handle_updated_at();

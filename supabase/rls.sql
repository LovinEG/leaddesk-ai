-- Row-level security policies for authenticated business members.

alter table public.business_users enable row level security;
alter table public.businesses enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.business_settings enable row level security;
alter table public.ai_rules enable row level security;
alter table public.followups enable row level security;

drop policy if exists business_users_select_own
  on public.business_users;
create policy business_users_select_own
  on public.business_users
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists businesses_select_member
  on public.businesses;
create policy businesses_select_member
  on public.businesses
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = businesses.id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists businesses_update_member
  on public.businesses;
create policy businesses_update_member
  on public.businesses
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = businesses.id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = businesses.id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists leads_select_member
  on public.leads;
create policy leads_select_member
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = leads.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists leads_insert_member
  on public.leads;
create policy leads_insert_member
  on public.leads
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = leads.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists leads_update_member
  on public.leads;
create policy leads_update_member
  on public.leads
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = leads.business_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = leads.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists leads_delete_member
  on public.leads;
create policy leads_delete_member
  on public.leads
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = leads.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists conversations_select_member
  on public.conversations;
create policy conversations_select_member
  on public.conversations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = conversations.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists conversations_insert_member
  on public.conversations;
create policy conversations_insert_member
  on public.conversations
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = conversations.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists conversations_update_member
  on public.conversations;
create policy conversations_update_member
  on public.conversations
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = conversations.business_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = conversations.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists conversations_delete_member
  on public.conversations;
create policy conversations_delete_member
  on public.conversations
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = conversations.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists messages_select_member
  on public.messages;
create policy messages_select_member
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.conversations
      join public.business_users
        on business_users.business_id = conversations.business_id
      where conversations.id = messages.conversation_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists messages_insert_member
  on public.messages;
create policy messages_insert_member
  on public.messages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.conversations
      join public.business_users
        on business_users.business_id = conversations.business_id
      where conversations.id = messages.conversation_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists messages_update_member
  on public.messages;
create policy messages_update_member
  on public.messages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.conversations
      join public.business_users
        on business_users.business_id = conversations.business_id
      where conversations.id = messages.conversation_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversations
      join public.business_users
        on business_users.business_id = conversations.business_id
      where conversations.id = messages.conversation_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists messages_delete_member
  on public.messages;
create policy messages_delete_member
  on public.messages
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.conversations
      join public.business_users
        on business_users.business_id = conversations.business_id
      where conversations.id = messages.conversation_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists business_settings_select_member
  on public.business_settings;
create policy business_settings_select_member
  on public.business_settings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = business_settings.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists business_settings_insert_member
  on public.business_settings;
create policy business_settings_insert_member
  on public.business_settings
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = business_settings.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists business_settings_update_member
  on public.business_settings;
create policy business_settings_update_member
  on public.business_settings
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = business_settings.business_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = business_settings.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists business_settings_delete_member
  on public.business_settings;
create policy business_settings_delete_member
  on public.business_settings
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = business_settings.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists ai_rules_select_member
  on public.ai_rules;
create policy ai_rules_select_member
  on public.ai_rules
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = ai_rules.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists ai_rules_insert_member
  on public.ai_rules;
create policy ai_rules_insert_member
  on public.ai_rules
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = ai_rules.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists ai_rules_update_member
  on public.ai_rules;
create policy ai_rules_update_member
  on public.ai_rules
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = ai_rules.business_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = ai_rules.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists ai_rules_delete_member
  on public.ai_rules;
create policy ai_rules_delete_member
  on public.ai_rules
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = ai_rules.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists followups_select_member
  on public.followups;
create policy followups_select_member
  on public.followups
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = followups.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists followups_insert_member
  on public.followups;
create policy followups_insert_member
  on public.followups
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = followups.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists followups_update_member
  on public.followups;
create policy followups_update_member
  on public.followups
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = followups.business_id
        and business_users.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = followups.business_id
        and business_users.user_id = auth.uid()
    )
  );

drop policy if exists followups_delete_member
  on public.followups;
create policy followups_delete_member
  on public.followups
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_users
      where business_users.business_id = followups.business_id
        and business_users.user_id = auth.uid()
    )
  );

alter table calendly_bookings
  add column if not exists external_uid text,
  add column if not exists title text,
  add column if not exists attendee_name text,
  add column if not exists attendee_email text,
  add column if not exists attendee_phone text,
  add column if not exists end_at timestamptz,
  add column if not exists reschedule_link text,
  add column if not exists cancellation_link text,
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists calendly_bookings_external_uid_key
  on calendly_bookings (external_uid)
  where external_uid is not null;

create index if not exists calendly_bookings_scheduled_at_idx
  on calendly_bookings (scheduled_at desc);

create policy "calendly_bookings admin select"
  on calendly_bookings for select to authenticated using (true);

create policy "calendly_bookings admin update"
  on calendly_bookings for update to authenticated using (true) with check (true);


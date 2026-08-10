alter table calendly_bookings
  add column if not exists booking_type text not null default 'discovery'
  check (booking_type in ('discovery', 'post_payment')),
  add column if not exists event_type_id bigint,
  add column if not exists event_type_slug text;

create index if not exists calendly_bookings_booking_type_idx
  on calendly_bookings (booking_type, scheduled_at desc);

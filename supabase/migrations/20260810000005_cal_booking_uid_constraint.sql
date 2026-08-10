drop index if exists calendly_bookings_external_uid_key;

create unique index calendly_bookings_external_uid_key
  on calendly_bookings (external_uid);

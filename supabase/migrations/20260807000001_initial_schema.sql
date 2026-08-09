-- Lomdie - schema initial
-- Remplace la base Airtable. Voir memory projet architecture_decisions.md pour le contexte.

create extension if not exists "pgcrypto";

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create type candidate_status as enum (
  'nouvelle_candidature',
  'en_qualification',
  'validee',
  'payee',
  'en_matching',
  'mise_en_relation',
  'cloturee'
);

create type offer_tier as enum ('reseau', 'signature', 'hunter');

create table candidates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  gender text not null check (gender in ('homme', 'femme')),
  birth_date date,
  country text,
  city text,
  email text not null,
  phone text not null,
  years_in_country integer,
  marital_status text check (marital_status in ('celibataire', 'divorce', 'veuf')),
  children_count integer default 0,
  tribe text,
  religion text,
  sensitive_data_consent boolean not null default false,
  height_cm integer,
  occupation text,
  single_duration text,
  hobbies text,
  personality text,
  photo_urls text[] default '{}',

  search_age_range text,
  search_marital_status text[],
  search_max_children integer,
  search_height_range text,
  search_tribe text,
  search_religion text,
  search_body_type text,
  search_qualities text,

  status candidate_status not null default 'nouvelle_candidature',
  offer_tier offer_tier,
  is_publicly_listed boolean not null default false,
  admin_notes text
);

create trigger candidates_updated_at
  before update on candidates
  for each row
  execute function set_updated_at();

comment on table candidates is 'Adherents Lomdie, source de verite remplace Airtable';
comment on column candidates.sensitive_data_consent is 'Consentement RGPD explicite pour tribu et religion, article 9';

create table site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null unique,
  label text not null,
  value text not null default '',
  content_type text not null default 'text' check (content_type in ('text', 'richtext', 'image_url')),
  updated_at timestamptz not null default now()
);

create trigger site_content_updated_at
  before update on site_content
  for each row
  execute function set_updated_at();

comment on table site_content is 'Contenu texte editable par page, cle stable, pour admin flexible sans code';

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_initials text not null,
  quote text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table pricing_plans (
  id uuid primary key default gen_random_uuid(),
  tier offer_tier not null unique,
  name text not null,
  price numeric,
  currency text not null default 'EUR',
  is_popular boolean not null default false,
  features jsonb not null default '[]',
  cta_label text not null default 'Choisir cette offre',
  sort_order integer not null default 0
);

create table process_steps (
  id uuid primary key default gen_random_uuid(),
  step_number integer not null,
  title text not null,
  description text not null,
  icon text
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  sort_order integer not null default 0
);

create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  is_handled boolean not null default false
);

create table calendly_bookings (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete set null,
  scheduled_at timestamptz not null,
  meeting_link text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

-- RLS : tout est ferme par defaut, seul le service role (utilise cote serveur / admin) contourne RLS.
alter table candidates enable row level security;
alter table site_content enable row level security;
alter table testimonials enable row level security;
alter table faq_items enable row level security;
alter table blog_posts enable row level security;
alter table pricing_plans enable row level security;
alter table process_steps enable row level security;
alter table team_members enable row level security;
alter table contact_submissions enable row level security;
alter table calendly_bookings enable row level security;

-- Lecture publique du contenu marketing publie uniquement
create policy "site_content lecture publique" on site_content for select using (true);
create policy "testimonials lecture publique" on testimonials for select using (is_published = true);
create policy "faq lecture publique" on faq_items for select using (is_published = true);
create policy "blog lecture publique" on blog_posts for select using (is_published = true);
create policy "pricing lecture publique" on pricing_plans for select using (true);
create policy "process steps lecture publique" on process_steps for select using (true);
create policy "team lecture publique" on team_members for select using (true);

-- Vue publique restreinte pour "Les profils" : jamais de donnees identifiantes ni de photo
create view public_candidate_profiles as
  select id, first_name, floor(extract(year from age(birth_date)))::int as age, city, occupation
  from candidates
  where is_publicly_listed = true and status not in ('cloturee');

-- Ecriture publique : uniquement creation de candidature et de message de contact (formulaires du site)
create policy "candidature publique insert" on candidates for insert with check (true);
create policy "contact publique insert" on contact_submissions for insert with check (true);

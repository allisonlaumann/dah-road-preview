-- ============================================================
-- Shared database for the site (Supabase / Postgres).
-- Paste this whole file into Supabase → SQL Editor → Run, once.
-- It creates the tables, the "who can see / change what" rules,
-- and the automatic spam guards. See SETUP.md for the steps.
-- ============================================================

-- ---------- People ----------
-- One row per parent. Sign-in (email + password) is handled by
-- Supabase Auth; this table holds what other parents can see.
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  first_name   text not null check (char_length(first_name) between 1 and 40),
  last_initial text not null check (char_length(last_initial) = 1),
  town         text not null check (char_length(town) <= 60),
  title        text check (char_length(title) <= 30),           -- "Lacrosse mom ×3"
  sports       text[] not null default '{}',
  is_adult     boolean not null check (is_adult),               -- must tick "I'm 18 or older"
  created_at   timestamptz not null default now()
);

-- Owner / reviewers. Add your own user id here after you sign up (see SETUP.md).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- ---------- Directory ----------
create table public.venues (
  id            text primary key,                                -- web address slug, e.g. "riverbend"
  name          text not null,
  type          text not null check (type in ('High school', 'Sports complex', 'Park', 'Indoor facility')),
  town          text not null,
  address       text,
  sports        text[] not null default '{}',
  summary       text,
  verdict       text,
  quick         text[] not null default '{}',                    -- quick-fact chips
  pack          text[] not null default '{}',                    -- "Pack for the day" list
  parking       jsonb not null default '{}',                     -- { summary, details[], pass }
  bathrooms     text,
  seating       text,
  food          jsonb not null default '[]',                     -- [{ name, note }]
  getting_there text,
  insider_tip   text,
  needs_verify  boolean not null default true,                   -- shows "help us confirm this" until a parent checks it
  published     boolean not null default false,
  updated_at    timestamptz not null default now()
);

create table public.tournaments (
  id           text primary key,
  name         text not null,
  sport        text not null,
  start_date   date not null,
  end_date     date not null check (end_date >= start_date),
  organizer    text,
  ages         text,
  summary      text,
  stops        jsonb not null default '[]',                      -- [{ venueId, day, who, where }]
  divisions    jsonb not null default '[]',                      -- [{ label, plan:[{ venueId, day, note }] }] → "Find my field"
  parking_pass jsonb not null default '{}',                      -- { cost, where, buyAhead, why }
  vendors      jsonb not null default '[]',                      -- [{ name, venueId, what, pay[] }]
  published    boolean not null default false,
  updated_at   timestamptz not null default now()
);

-- Paid local listings.
create table public.featured (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  kind           text,                                           -- Breakfast, Hotel, Pizza…
  town           text,
  distance       text,
  blurb          text,
  offer          text,
  venue_ids      text[] not null default '{}',
  tournament_ids text[] not null default '{}',
  paid_through   date,                                           -- listing hides itself after this date
  active         boolean not null default true
);

-- ---------- Live conditions ----------
create table public.live_updates (
  id            uuid primary key default gen_random_uuid(),
  venue_id      text not null references public.venues (id) on delete cascade,
  tournament_id text references public.tournaments (id) on delete set null,
  category      text not null check (category in ('parking', 'field', 'weather', 'food', 'bathrooms', 'other')),
  body          text not null check (char_length(body) between 3 and 200),
  author        uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  hidden        boolean not null default false,
  created_at    timestamptz not null default now()
);
create index on public.live_updates (venue_id, created_at desc);
create index on public.live_updates (tournament_id, created_at desc);

create table public.helpful_votes (
  update_id uuid not null references public.live_updates (id) on delete cascade,
  voter     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  primary key (update_id, voter)
);

create table public.reports (
  update_id  uuid not null references public.live_updates (id) on delete cascade,
  reporter   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (update_id, reporter)
);

-- ---------- Parent write-ups waiting for review ----------
create table public.submissions (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('venue', 'tournament', 'business')),
  fields     jsonb not null,
  submitter  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ---------- What the pages read ----------
-- Live feed with author display info and helpful counts (never exposes email).
create view public.live_feed with (security_invoker = true) as
  select u.id, u.venue_id, u.tournament_id, u.category, u.body, u.created_at,
         p.first_name || ' ' || p.last_initial || '.' as author_name, p.town as author_town, p.title as author_title,
         (select count(*) from public.helpful_votes v where v.update_id = u.id) as helpful
  from public.live_updates u join public.profiles p on p.id = u.author
  where not u.hidden;

-- Fan Card stats for each parent.
create view public.fan_stats with (security_invoker = true) as
  select p.id,
         (select count(*) from public.live_updates u where u.author = p.id and not u.hidden)
           + (select count(*) from public.submissions s where s.submitter = p.id and s.status = 'approved') as posts,
         (select count(*) from public.helpful_votes v join public.live_updates u on u.id = v.update_id where u.author = p.id) as helpful,
         (select count(distinct u.venue_id) from public.live_updates u where u.author = p.id) as venues,
         (select count(distinct u.tournament_id) from public.live_updates u where u.author = p.id and u.tournament_id is not null) as tournaments,
         (select count(*) from public.live_updates u where u.author = p.id and u.category = 'parking') as parking
  from public.profiles p;

-- ---------- Automatic guards ----------
-- No more than 5 live updates per parent in 10 minutes.
create function public.limit_update_rate() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from live_updates where author = new.author and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'Slow down — you can post again in a few minutes.';
  end if;
  return new;
end $$;
create trigger live_updates_rate before insert on public.live_updates
  for each row execute function public.limit_update_rate();

-- Three reports from different parents hide an update until you review it.
create function public.hide_reported() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from reports where update_id = new.update_id) >= 3 then
    update live_updates set hidden = true where id = new.update_id;
  end if;
  return new;
end $$;
create trigger reports_autohide after insert on public.reports
  for each row execute function public.hide_reported();

-- ---------- Who can see / change what (Row Level Security) ----------
alter table public.profiles      enable row level security;
alter table public.admins        enable row level security;
alter table public.venues        enable row level security;
alter table public.tournaments   enable row level security;
alter table public.featured      enable row level security;
alter table public.live_updates  enable row level security;
alter table public.helpful_votes enable row level security;
alter table public.reports       enable row level security;
alter table public.submissions   enable row level security;

-- Profiles: anyone can see display info; you can only create/edit your own.
create policy "profiles are public"   on public.profiles for select using (true);
create policy "create own profile"    on public.profiles for insert with check (id = auth.uid());
create policy "edit own profile"      on public.profiles for update using (id = auth.uid());

create policy "admins see admins"     on public.admins for select using (public.is_admin());

-- Directory: everyone reads published pages; only admins edit.
create policy "read published venues"      on public.venues      for select using (published or public.is_admin());
create policy "admins manage venues"       on public.venues      for all    using (public.is_admin()) with check (public.is_admin());
create policy "read published tournaments" on public.tournaments for select using (published or public.is_admin());
create policy "admins manage tournaments"  on public.tournaments for all    using (public.is_admin()) with check (public.is_admin());
create policy "read active featured"       on public.featured    for select using ((active and (paid_through is null or paid_through >= current_date)) or public.is_admin());
create policy "admins manage featured"     on public.featured    for all    using (public.is_admin()) with check (public.is_admin());

-- Live updates: everyone reads visible ones; signed-in parents post as themselves; admins can hide.
create policy "read visible updates" on public.live_updates for select using (not hidden or author = auth.uid() or public.is_admin());
create policy "post own updates"     on public.live_updates for insert to authenticated with check (author = auth.uid());
create policy "delete own updates"   on public.live_updates for delete using (author = auth.uid() or public.is_admin());
create policy "admins moderate"      on public.live_updates for update using (public.is_admin());

-- Helpful votes: counted publicly; one per parent per update; can't vote for yourself.
create policy "read votes"    on public.helpful_votes for select using (true);
create policy "vote"          on public.helpful_votes for insert to authenticated
  with check (voter = auth.uid() and not exists (select 1 from public.live_updates u where u.id = update_id and u.author = auth.uid()));
create policy "undo own vote" on public.helpful_votes for delete using (voter = auth.uid());

-- Reports: parents file them; only admins read them.
create policy "file report"        on public.reports for insert to authenticated with check (reporter = auth.uid());
create policy "admins read reports" on public.reports for select using (public.is_admin());

-- Submissions: parents send them and see their own; admins see and approve all.
create policy "send submission"      on public.submissions for insert to authenticated with check (submitter = auth.uid());
create policy "see own or all"       on public.submissions for select using (submitter = auth.uid() or public.is_admin());
create policy "admins review"        on public.submissions for update using (public.is_admin());

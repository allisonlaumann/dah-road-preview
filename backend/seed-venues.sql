-- ============================================================
-- Starting venues for the shared database (run AFTER schema.sql).
-- Generated from js/venues-real.js: names, addresses, types and
-- sports only. Everything else starts empty for parents to fill in.
-- Sample (made-up) venues and the sample tournament are NOT included.
-- ============================================================
insert into public.venues (id, name, type, town, address, sports, needs_verify, published) values
  ('wintrust-crossroads', 'Wintrust Crossroads Sports Complex', 'Sports complex', 'New Lenox', '520 Cedar Crossings Dr, New Lenox, IL', array['Soccer']::text[], true, true),
  ('vernon-hills-athletic-complex', 'Vernon Hills Athletic Complex', 'Sports complex', 'Vernon Hills', '300 Nike Pkwy, Vernon Hills, IL 60061', array['Lacrosse']::text[], true, true),
  ('oak-brook-evergreen-field', 'Oak Brook Park District – Evergreen Bank Group Athletic Field', 'Park', 'Oak Brook', '1450 Forest Gate Rd, Oak Brook, IL 60523', array['Soccer']::text[], true, true),
  ('oak-brook-park-district', 'Oak Brook Park District (Kensington Rd)', 'Park', 'Oak Brook', '1315 Kensington Rd, Oak Brook, IL 60523', array['Lacrosse']::text[], true, true),
  ('deerpath-community-park', 'Deerpath Community Park', 'Park', 'Lake Forest', '95 Deerpath, Lake Forest, IL 60045', array['Soccer']::text[], true, true),
  ('townline-community-park', 'Townline Community Park', 'Park', 'Lake Forest', '1555 W Kennedy Rd, Lake Forest, IL 60045', array['Lacrosse']::text[], true, true),
  ('south-barrington-turf-fields', 'South Barrington Turf Fields', 'Park', 'South Barrington', '8 Bridges Dr, South Barrington, IL 60010', array['Lacrosse']::text[], true, true),
  ('ron-beese-park', 'Ron Beese Park', 'Park', 'Barrington', '50 Rotary Dr, Barrington, IL 60010', array['Lacrosse','Football']::text[], true, true),
  ('willow-park-glenview', 'Willow Park', 'Park', 'Glenview', '2600 Greenwood Rd, Glenview, IL 60026', array['Lacrosse']::text[], true, true),
  ('winnetka-park-district-hibbard', 'Winnetka Park District (Hibbard Rd)', 'Park', 'Winnetka', '540 Hibbard Rd, Winnetka, IL 60093', array['Lacrosse']::text[], true, true),
  ('friendship-park-conservatory', 'Friendship Park Conservatory', 'Park', 'Des Plaines', '395 W Algonquin Rd, Des Plaines, IL', array['Lacrosse']::text[], true, true),
  ('lippold-park', 'Lippold Park', 'Park', 'Crystal Lake', '851 W Route 176, Crystal Lake, IL 60014', array['Lacrosse']::text[], true, true),
  ('lake-barrington-park', 'Lake Barrington Park', 'Park', 'Lake Barrington', '23860 N Old Barrington Rd, Lake Barrington, IL 60010', array['Football']::text[], true, true),
  ('barrington-high-school', 'Barrington High School', 'High school', 'Barrington', '616 W Main St, Barrington, IL 60010', array['Lacrosse','Football']::text[], true, true),
  ('south-elgin-high-school', 'South Elgin High School', 'High school', 'South Elgin', '760 E Main St, South Elgin, IL 60177', array['Basketball']::text[], true, true),
  ('conant-high-school', 'James B. Conant High School', 'High school', 'Hoffman Estates', '700 E Cougar Trail, Hoffman Estates, IL 60169', array['Basketball']::text[], true, true),
  ('schaumburg-high-school', 'Schaumburg High School', 'High school', 'Schaumburg', '1100 W Schaumburg Rd, Schaumburg, IL 60194', array['Basketball']::text[], true, true),
  ('naperville-north-high-school', 'Naperville North High School', 'High school', 'Naperville', '899 N Mill St, Naperville, IL 60563', array['Basketball']::text[], true, true),
  ('york-high-school', 'York High School', 'High school', 'Elmhurst', '355 W Saint Charles Rd, Elmhurst, IL 60126', array['Basketball']::text[], true, true),
  ('wheaton-academy', 'Wheaton Academy', 'High school', 'West Chicago', '900 N Prince Crossing Rd, West Chicago, IL 60185', array['Basketball']::text[], true, true),
  ('canlan-sports-barrington', 'Canlan Sports', 'Indoor facility', 'Barrington', '28156 W Northpointe Pkwy, Barrington, IL 60010', array['Basketball','Lacrosse']::text[], true, true),
  ('schaumburg-sport-center', 'Schaumburg Park District Sport Center', 'Indoor facility', 'Schaumburg', '1141 W Irving Park Rd, Schaumburg, IL 60193', array['Soccer']::text[], true, true),
  ('falcon-park-rec-center', 'Falcon Park Recreation Center', 'Indoor facility', 'Palatine', '2195 N Hicks Rd, Palatine, IL 60074', array['Basketball']::text[], true, true),
  ('ackerman-sports-fitness', 'Ackerman Sports & Fitness Center', 'Indoor facility', 'Glen Ellyn', '800 St Charles Rd, Glen Ellyn, IL', array['Basketball']::text[], true, true),
  ('lifezone-360', 'Lifezone 360', 'Indoor facility', 'West Dundee', '999 W Main St, West Dundee, IL 60118', array['Basketball']::text[], true, true),
  ('westfield-middle-school', 'Westfield Middle School (gym)', 'Indoor facility', 'Bloomingdale', '149 Fairfield Way, Bloomingdale, IL 60108', array['Basketball']::text[], true, true),
  ('barrington-ms-station', 'Barrington Middle School – Station Campus (gym)', 'Indoor facility', 'Barrington', '215 Eastern Ave, Barrington, IL 60010', array['Basketball']::text[], true, true)
on conflict (id) do nothing;

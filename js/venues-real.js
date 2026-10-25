// ============================================================
// REAL VENUES — names and addresses of public venues where local
// youth teams played games and practices (Oct 2026). Only the name,
// address, venue type and sport are filled in. Parking, bathrooms,
// food, tips etc. are left empty on purpose: parents fill those in.
// Sports are the ones our teams played there; most venues host more.
// ============================================================
window.DATA.venues.push(...[
  // Sports complexes
  { id: "wintrust-crossroads", name: "Wintrust Crossroads Sports Complex", type: "Sports complex", town: "New Lenox", address: "520 Cedar Crossings Dr, New Lenox, IL", sports: ["Soccer"] },
  { id: "vernon-hills-athletic-complex", name: "Vernon Hills Athletic Complex", type: "Sports complex", town: "Vernon Hills", address: "300 Nike Pkwy, Vernon Hills, IL 60061", sports: ["Lacrosse"] },

  // Parks & fields
  { id: "oak-brook-evergreen-field", name: "Oak Brook Park District – Evergreen Bank Group Athletic Field", type: "Park", town: "Oak Brook", address: "1450 Forest Gate Rd, Oak Brook, IL 60523", sports: ["Soccer"] },
  { id: "oak-brook-park-district", name: "Oak Brook Park District (Kensington Rd)", type: "Park", town: "Oak Brook", address: "1315 Kensington Rd, Oak Brook, IL 60523", sports: ["Lacrosse"] },
  { id: "deerpath-community-park", name: "Deerpath Community Park", type: "Park", town: "Lake Forest", address: "95 Deerpath, Lake Forest, IL 60045", sports: ["Soccer"] },
  { id: "townline-community-park", name: "Townline Community Park", type: "Park", town: "Lake Forest", address: "1555 W Kennedy Rd, Lake Forest, IL 60045", sports: ["Lacrosse"] },
  { id: "south-barrington-turf-fields", name: "South Barrington Turf Fields", type: "Park", town: "South Barrington", address: "8 Bridges Dr, South Barrington, IL 60010", sports: ["Lacrosse"] },
  { id: "ron-beese-park", name: "Ron Beese Park", type: "Park", town: "Barrington", address: "50 Rotary Dr, Barrington, IL 60010", sports: ["Lacrosse", "Football"] },
  { id: "willow-park-glenview", name: "Willow Park", type: "Park", town: "Glenview", address: "2600 Greenwood Rd, Glenview, IL 60026", sports: ["Lacrosse"] },
  { id: "winnetka-park-district-hibbard", name: "Winnetka Park District (Hibbard Rd)", type: "Park", town: "Winnetka", address: "540 Hibbard Rd, Winnetka, IL 60093", sports: ["Lacrosse"] },
  { id: "friendship-park-conservatory", name: "Friendship Park Conservatory", type: "Park", town: "Des Plaines", address: "395 W Algonquin Rd, Des Plaines, IL", sports: ["Lacrosse"] },
  { id: "lippold-park", name: "Lippold Park", type: "Park", town: "Crystal Lake", address: "851 W Route 176, Crystal Lake, IL 60014", sports: ["Lacrosse"] },
  { id: "lake-barrington-park", name: "Lake Barrington Park", type: "Park", town: "Lake Barrington", address: "23860 N Old Barrington Rd, Lake Barrington, IL 60010", sports: ["Football"] },

  // High schools
  { id: "barrington-high-school", name: "Barrington High School", type: "High school", town: "Barrington", address: "616 W Main St, Barrington, IL 60010", sports: ["Lacrosse", "Football"] },
  { id: "south-elgin-high-school", name: "South Elgin High School", type: "High school", town: "South Elgin", address: "760 E Main St, South Elgin, IL 60177", sports: ["Basketball"] },
  { id: "conant-high-school", name: "James B. Conant High School", type: "High school", town: "Hoffman Estates", address: "700 E Cougar Trail, Hoffman Estates, IL 60169", sports: ["Basketball"] },
  { id: "schaumburg-high-school", name: "Schaumburg High School", type: "High school", town: "Schaumburg", address: "1100 W Schaumburg Rd, Schaumburg, IL 60194", sports: ["Basketball"] },
  { id: "naperville-north-high-school", name: "Naperville North High School", type: "High school", town: "Naperville", address: "899 N Mill St, Naperville, IL 60563", sports: ["Basketball"] },
  { id: "york-high-school", name: "York High School", type: "High school", town: "Elmhurst", address: "355 W Saint Charles Rd, Elmhurst, IL 60126", sports: ["Basketball"] },
  { id: "wheaton-academy", name: "Wheaton Academy", type: "High school", town: "West Chicago", address: "900 N Prince Crossing Rd, West Chicago, IL 60185", sports: ["Basketball"] },

  // Indoor facilities
  { id: "canlan-sports-barrington", name: "Canlan Sports", type: "Indoor facility", town: "Barrington", address: "28156 W Northpointe Pkwy, Barrington, IL 60010", sports: ["Basketball", "Lacrosse"] },
  { id: "schaumburg-sport-center", name: "Schaumburg Park District Sport Center", type: "Indoor facility", town: "Schaumburg", address: "1141 W Irving Park Rd, Schaumburg, IL 60193", sports: ["Soccer"] },
  { id: "falcon-park-rec-center", name: "Falcon Park Recreation Center", type: "Indoor facility", town: "Palatine", address: "2195 N Hicks Rd, Palatine, IL 60074", sports: ["Basketball"] },
  { id: "ackerman-sports-fitness", name: "Ackerman Sports & Fitness Center", type: "Indoor facility", town: "Glen Ellyn", address: "800 St Charles Rd, Glen Ellyn, IL", sports: ["Basketball"] },
  { id: "lifezone-360", name: "Lifezone 360", type: "Indoor facility", town: "West Dundee", address: "999 W Main St, West Dundee, IL 60118", sports: ["Basketball"] },
  { id: "westfield-middle-school", name: "Westfield Middle School (gym)", type: "Indoor facility", town: "Bloomingdale", address: "149 Fairfield Way, Bloomingdale, IL 60108", sports: ["Basketball"] },
  { id: "barrington-ms-station", name: "Barrington Middle School – Station Campus (gym)", type: "Indoor facility", town: "Barrington", address: "215 Eastern Ave, Barrington, IL 60010", sports: ["Basketball"] }
].map((v) => ({ ...v, real: true })));

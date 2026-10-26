// ============================================================
// SITE SETTINGS — change the name here and it updates everywhere.
// ============================================================
window.SITE = {
  name: "Away Squad",
  tagline: "Away game today? Be ready.",
  motto: "More than a spectator.",
  // Marketing lines (from Allison). The ones marked * are used on the site.
  lines: {
    bold: "Own the Away Game.",                                   // * sign-up page
    sportsParents: "Every Tournament. A Better Trip.",            // * tournaments page
    localDiscovery: "Find More Around Every Game.",               // * "Featured nearby" box
    businessFriendly: "Connecting Fans to Local Favorites.",      // * "Own a local business?" box
    modernTech: "Your Game-Day Guide, Everywhere.",               // * footer
    travel: "Every Away Game Has a Destination.",
    fanCommunity: "Your People. Your Places. Your Game.",
    shortPunchy: "Game On. Get Out. Explore.",
    funEnergetic: "Play Away. Explore More.",
    allInOne: "Everything Around the Game, All in One Place."
  },
  region: "Chicagoland: New Lenox to Libertyville, Rockford to Park Ridge"
};

// ============================================================
// SAMPLE DATA — everything below is MADE UP so you can see how
// the site looks. Venue, business and parent names are fictional.
// ============================================================
window.DATA = {
  venues: [
    {
      id: "riverbend",
      name: "Riverbend Sports Park",
      type: "Sports complex",
      town: "Rockford",
      sports: ["Soccer", "Lacrosse", "Softball"],
      summary: "24 grass fields split into North (1–12) and South (13–24) sections.",
      verdict: "Big, well-run complex. On tournament weekends, arrive 45+ minutes early — the main lot fills by about 8:15 a.m.",
      quick: ["🅿️ $10 parking on tournament days", "🛒 Bring a wagon", "🪑 Bring chairs", "🐕 No dogs", "📶 Weak signal at far fields"],
      pack: ["Cash or card for $10 parking", "Folding chairs", "Wagon (long walk to fields 13–24)", "Pop-up tent — almost no shade", "Sunscreen & hats", "Hand sanitizer", "Rain jackets", "Portable phone charger"],
      parking: {
        summary: "Paid on tournament weekends ($10 per car per day, cash or card at the gate). Free the rest of the time.",
        details: [
          "Main lot (by fields 1–8) fills first.",
          "Overflow grass lot off Riverbend Pkwy is about an 8-minute walk.",
          "Drop-off loop by the concession stand has a strictly enforced 2-minute limit."
        ],
        pass: true
      },
      bathrooms: "Real restrooms in the center building (open 7 a.m. to dusk). Porta-potties at fields 9 and 16. Bring hand sanitizer for the far fields.",
      seating: "No bleachers at most fields, so bring chairs. Almost no shade on fields 9–16. Pop-up tents are allowed on the parent side.",
      food: [
        { name: "Center concession stand", note: "Burgers, hot dogs, coffee. Cards accepted. Lines peak 11 a.m.–1 p.m." },
        { name: "Restaurants on State St.", note: "About 5 minutes by car. Fast food and a grocery store." }
      ],
      gettingThere: "Use the Riverbend Pkwy entrance, not the Harrison Rd. gate — Harrison is staff-only on weekends, and GPS sometimes sends you there.",
      insiderTip: "Fields 13–16 are a 12-minute walk from the main lot. If your game is down there, park in the overflow lot instead. It's actually closer."
    },
    {
      id: "rockton-hills",
      name: "Rockton Hills High School",
      type: "High school",
      town: "Roscoe",
      sports: ["Lacrosse", "Soccer", "Football"],
      summary: "Turf stadium plus two grass practice fields behind the school.",
      verdict: "Easy, compact venue with real bleachers. Parking is free, but the front lot closes when there's a stadium event.",
      quick: ["🅿️ Free parking", "🏟️ Stadium bleachers", "🚻 Indoor restrooms", "💵 Bring cash for the grill"],
      pack: ["Cash or Venmo for the grill", "Stadium seat cushion", "Sunglasses (visitor side faces the sun)", "Blanket — it gets cold after 3 p.m.", "Folding chairs for the practice fields"],
      parking: {
        summary: "Free. The front lot by the main entrance closes for stadium events.",
        details: [
          "Use the east lot behind the field house — it's closest to the stadium anyway.",
          "Street parking on Hill Rd. is allowed on weekends."
        ],
        pass: false
      },
      bathrooms: "Field house restrooms open whenever the stadium is in use. Clean and heated.",
      seating: "Home and visitor bleachers at the stadium; the home side has some afternoon shade. Practice fields have no seating.",
      food: [
        { name: "Boosters grill", note: "Hot dogs, brats, drinks. Cash or Venmo only." },
        { name: "Roscoe town center", note: "Coffee and sandwiches about 4 minutes away." }
      ],
      gettingThere: "Enter from Hill Rd. and follow the signs to the east lot. Don't use the bus loop — it's coned off on weekends.",
      insiderTip: "The visitor bleachers get full sun all afternoon. Sit on the home side even if you're the away team — nobody minds."
    },
    {
      id: "lakeview-north",
      name: "Lakeview North High School",
      type: "High school",
      town: "Libertyville",
      sports: ["Basketball", "Volleyball", "Soccer", "Lacrosse"],
      summary: "Field house with three courts, plus a turf field outside.",
      verdict: "Great indoor tournament venue. Gyms A, B and C are far apart, so check your court before you park.",
      quick: ["🅿️ Free parking", "🏀 3 courts", "🚻 Indoor restrooms", "🍕 Booster pizza"],
      pack: ["Cash or Venmo for booster pizza", "Seat cushion for the bleachers", "Layers — the gyms run hot", "Refillable water bottle", "Snacks for between games", "Portable phone charger"],
      parking: {
        summary: "Free. The north lot is closest to the field house.",
        details: [
          "South lot is closer to Gym C and the turf field.",
          "On big tournament days, overflow is the church lot across Park Ave. (allowed by agreement)."
        ],
        pass: false
      },
      bathrooms: "Lobby restrooms plus a set by Gym C. The Gym C ones usually have no line.",
      seating: "Pull-out bleachers in Gyms A and B. Gym C has only a few rows, so arrive early to get a seat.",
      food: [
        { name: "Booster club table", note: "Pizza by the slice ($3), snacks, Gatorade. Cash or Venmo." },
        { name: "Downtown Libertyville", note: "Lots of options about 6 minutes away." }
      ],
      gettingThere: "Use the Park Ave. entrance. The Route 21 entrance is one-way out on weekends.",
      insiderTip: "Gym C is reached through a long hallway past the pool. Give yourself 5 extra minutes if your game is there."
    }
  ],

  tournaments: [
    {
      id: "fall-brawl",
      name: "Fall Brawl Lacrosse Classic",
      sport: "Lacrosse",
      start: "2026-11-07",
      end: "2026-11-08",
      organizer: "Northern Illinois Youth Lacrosse (sample)",
      ages: "Girls & Boys U10–U15",
      summary: "Two-day fall tournament. Girls play Saturday, boys play Sunday — at two different venues 15 minutes apart.",
      stops: [
        { venueId: "riverbend", day: "Sat, Nov 7", who: "All girls divisions (pool play)", where: "North Fields 1–12" },
        { venueId: "rockton-hills", day: "Sun, Nov 8", who: "All boys divisions + girls U14/U15 finals", where: "Stadium & practice fields" }
      ],
      divisions: [
        { label: "Girls U10", plan: [{ venueId: "riverbend", day: "Sat, Nov 7", note: "Fields 1–4" }] },
        { label: "Girls U12", plan: [{ venueId: "riverbend", day: "Sat, Nov 7", note: "Fields 5–8" }] },
        { label: "Girls U14/U15", plan: [
          { venueId: "riverbend", day: "Sat, Nov 7", note: "Pool play, fields 9–12" },
          { venueId: "rockton-hills", day: "Sun, Nov 8", note: "Finals at 2 p.m. in the stadium (if you advance)" }
        ] },
        { label: "Boys U10", plan: [{ venueId: "rockton-hills", day: "Sun, Nov 8", note: "Practice field 1" }] },
        { label: "Boys U12", plan: [{ venueId: "rockton-hills", day: "Sun, Nov 8", note: "Practice field 2" }] },
        { label: "Boys U14/U15", plan: [{ venueId: "rockton-hills", day: "Sun, Nov 8", note: "Stadium" }] }
      ],
      parkingPass: {
        cost: "$10 per car, per day (Riverbend only). Rockton Hills is free.",
        where: "At the Riverbend gate (cash or card), or ahead of time on the organizer's website.",
        buyAhead: true,
        why: "Buying ahead lets you use the express lane. Saturday morning the gate line backed up about 20 minutes last year."
      },
      vendors: [
        { name: "Center concession stand", venueId: "riverbend", what: "Burgers, hot dogs, coffee", pay: ["Cash", "Card"] },
        { name: "Smoothie truck (sample)", venueId: "riverbend", what: "Smoothies, acai bowls", pay: ["Card", "Apple Pay"] },
        { name: "Team bake sale", venueId: "riverbend", what: "Cookies, brownies, water", pay: ["Cash"] },
        { name: "Rockton Hills boosters grill", venueId: "rockton-hills", what: "Hot dogs, brats, drinks", pay: ["Cash", "Venmo"] }
      ]
    }
  ],

  // Team meals: restaurants that take big team orders (SAMPLE: fictional businesses).
  // In the live version, restaurants pay to be listed and receive requests by email/text.
  teamMeals: [
    { id: "m1", name: "Second Half Pizza", kind: "Pizza", town: "Libertyville", distance: "1.5 mi", venueIds: ["lakeview-north"], tournamentIds: [],
      menu: [{ item: "Team pizza pack (1 large per 3 players)", price: "$9/person" }, { item: "Add garlic knots + Gatorade", price: "+$3/person" }],
      minOrder: "10 people", leadTime: "30 min (call ahead between games)", options: ["Pickup", "Delivery to the field"], pay: ["Card", "Venmo"],
      perk: "Free 2-liter on team orders" },
    { id: "m2", name: "Maple & Main Diner", kind: "Breakfast & sandwiches", town: "Rockford", distance: "0.8 mi", venueIds: ["riverbend"], tournamentIds: ["fall-brawl"],
      menu: [{ item: "Breakfast burrito tray", price: "$7/person" }, { item: "Boxed lunch (sandwich, chips, fruit, water)", price: "$11/person" }],
      minOrder: "8 people", leadTime: "Order by 7 p.m. the night before", options: ["Pickup", "Delivery to the field"], pay: ["Card"],
      perk: "Team boxes labeled with each player's name" },
    { id: "m3", name: "Riverside Pasta Co.", kind: "Pasta & salads", town: "Rockford", distance: "2.4 mi", venueIds: ["riverbend", "rockton-hills"], tournamentIds: ["fall-brawl"],
      menu: [{ item: "Pasta bar (2 pastas, salad, breadsticks)", price: "$12/person" }, { item: "Kids' pasta + juice box", price: "$8/person" }],
      minOrder: "12 people", leadTime: "24 hours", options: ["Pickup", "Private room for team dinner"], pay: ["Card", "Cash"],
      perk: "Private room seats 40 for a Saturday-night team dinner" },
    { id: "m4", name: "Fieldhouse Coffee Co.", kind: "Coffee & bagels", town: "Roscoe", distance: "1.2 mi", venueIds: ["rockton-hills"], tournamentIds: ["fall-brawl"],
      menu: [{ item: "Bagel + cream cheese box (dozen)", price: "$24" }, { item: "Coffee traveler (serves 10)", price: "$22" }, { item: "Hot chocolate traveler (serves 10)", price: "$20" }],
      minOrder: "1 box", leadTime: "1 hour", options: ["Pickup", "Drive-thru pickup"], pay: ["Card", "Apple Pay"],
      perk: "Free size upgrade with Away Squad" }
  ],

  featured: [
    { id: "f1", name: "Maple & Main Diner", kind: "Breakfast", town: "Rockford", distance: "0.8 mi", blurb: "Opens at 6 a.m. — perfect before an 8 a.m. game. Big booths for teams.", offer: "10% off when you show {site}", venueIds: ["riverbend"], tournamentIds: ["fall-brawl"] },
    { id: "f2", name: "Rockford Inn & Suites", kind: "Hotel", town: "Rockford", distance: "2.1 mi", blurb: "Tournament rate $119/night. Free breakfast and late checkout on Sundays.", offer: "Ask for the {site} tournament rate", venueIds: ["riverbend"], tournamentIds: ["fall-brawl"] },
    { id: "f3", name: "Fieldhouse Coffee Co.", kind: "Coffee", town: "Roscoe", distance: "1.2 mi", blurb: "Drive-thru open at 6:30 a.m. on weekends. Hot chocolate for the kids.", offer: "Free size upgrade with {site}", venueIds: ["rockton-hills"], tournamentIds: ["fall-brawl"] },
    { id: "f4", name: "Second Half Pizza", kind: "Pizza", town: "Libertyville", distance: "1.5 mi", blurb: "Team orders of 10+ pizzas ready in 30 minutes. Call ahead between games.", offer: "Free 2-liter on team orders", venueIds: ["lakeview-north"], tournamentIds: [] }
  ],

  // Sample parents (fictional). Real parents join with an email.
  parents: [
    { id: "p1", name: "Jen K.", town: "Naperville", title: "Lacrosse mom ×3", sports: ["Lacrosse"], posts: 47, helpful: 312, venues: 18, tournaments: 22 },
    { id: "p2", name: "Mike R.", town: "Schaumburg", title: "Chief Snack Officer", sports: ["Soccer"], posts: 12, helpful: 58, venues: 9, tournaments: 7 },
    { id: "p3", name: "Tasha W.", town: "Aurora", title: "Travel-ball lifer", sports: ["Softball", "Lacrosse"], posts: 26, helpful: 140, venues: 14, tournaments: 16 },
    { id: "p4", name: "Dave P.", town: "Libertyville", title: "Gym rat (basketball dad)", sports: ["Basketball"], posts: 8, helpful: 31, venues: 6, tournaments: 5 },
    { id: "p5", name: "Priya S.", town: "Park Ridge", title: "Volleyball & lacrosse", sports: ["Volleyball", "Lacrosse"], posts: 19, helpful: 96, venues: 11, tournaments: 9 }
  ],

  // Sample live updates. "ago" = minutes before you opened the page.
  updates: [
    { id: "u1", venueId: "riverbend", cat: "parking", text: "Main lot is FULL as of 8:10. Overflow grass lot still has room — enter from Riverbend Pkwy.", by: "p1", ago: 14, helpful: 23 },
    { id: "u2", venueId: "riverbend", cat: "field", text: "Fields 13–16 are muddy after last night's rain. Bring the old cleats.", by: "p3", ago: 38, helpful: 11 },
    { id: "u3", venueId: "riverbend", cat: "food", text: "Concession line is short right now and the coffee is fresh.", by: "p2", ago: 55, helpful: 6 },
    { id: "u4", venueId: "riverbend", cat: "weather", text: "Lightning delay — all games paused 30 min. Head to your car, not the pavilion.", by: "p5", ago: 180, helpful: 41 },
    { id: "u5", venueId: "rockton-hills", cat: "parking", text: "Front lot is coned off for the football game. Use the east lot behind the field house.", by: "p4", ago: 300, helpful: 9 },
    { id: "u6", venueId: "lakeview-north", cat: "bathrooms", text: "Lobby restrooms closed for cleaning — use the ones by Gym C.", by: "p5", ago: 95, helpful: 4 },
    { id: "u7", venueId: "lakeview-north", cat: "food", text: "Booster club has pizza by the slice, $3, cash or Venmo.", by: "p4", ago: 140, helpful: 15 },
    { id: "u8", venueId: "riverbend", tournamentId: "fall-brawl", cat: "other", text: "Organizer email: girls U12 start times moved up 30 minutes on Saturday. Check your team app!", by: "p1", ago: 600, helpful: 34 }
  ]
};

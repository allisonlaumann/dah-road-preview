// ============================================================
// The whole site runs from this one file. Each "page" is a
// function that returns HTML; the address after # picks the page.
//
// DEMO MODE: posts, votes, sign-ups and submissions are saved in
// this browser only (localStorage). Step 2 swaps that for a real
// shared database (Supabase) so every parent sees the same posts.
// ============================================================
(function () {
  const SITE = window.SITE, D = window.DATA;
  const app = document.getElementById("app");

  // ---------- small helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("sl_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("sl_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const brand = (s) => String(s).replace(/\{site\}/g, SITE.name);
  const venue = (id) => D.venues.find((v) => v.id === id);
  const tourney = (id) => D.tournaments.find((t) => t.id === id);
  const parent = (id) => D.parents.find((p) => p.id === id);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2800);
  }

  function timeAgo(ts) {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + " min ago";
    const h = Math.round(m / 60);
    if (h < 24) return h + (h === 1 ? " hr ago" : " hrs ago");
    const d = Math.round(h / 24);
    return d + (d === 1 ? " day ago" : " days ago");
  }

  function fmtDates(t) {
    const o = { month: "short", day: "numeric" };
    const a = new Date(t.start + "T12:00"), b = new Date(t.end + "T12:00");
    return a.toLocaleDateString("en-US", { weekday: "short", ...o }) + " – " + b.toLocaleDateString("en-US", { weekday: "short", ...o }) + ", " + b.getFullYear();
  }

  // ---------- parent levels + badges (the "it's all about you" part) ----------
  const LEVELS = [
    { name: "Rookie", min: 0 }, { name: "Starter", min: 30 }, { name: "All-Star", min: 120 },
    { name: "MVP", min: 400 }, { name: "Hall of Fame", min: 1000 }
  ];
  const points = (s) => s.posts * 10 + s.helpful * 2 + s.venues * 5 + s.tournaments * 5;
  function levelFor(s) {
    const p = points(s);
    let i = 0; while (i < LEVELS.length - 1 && p >= LEVELS[i + 1].min) i++;
    return { ...LEVELS[i], points: p, next: LEVELS[i + 1] || null };
  }
  const BADGES = [
    { ico: "✅", name: "Verified Fan", test: (s) => s.verified },
    { ico: "📣", name: "First Report", test: (s) => s.posts >= 1 },
    { ico: "🅿️", name: "Lot Whisperer", test: (s) => s.parking >= 3 },
    { ico: "🚗", name: "Road Warrior", test: (s) => s.venues >= 5 },
    { ico: "🏆", name: "Tournament Regular", test: (s) => s.tournaments >= 5 },
    { ico: "🙌", name: "Helped 100 Parents", test: (s) => s.helpful >= 100 }
  ];

  // ---------- the signed-in parent (demo: saved in this browser) ----------
  // Demo: the profile stays saved; "signedin" says whether it's active.
  const me = () => store.get("signedin", false) ? store.get("me", null) : null;
  function myStats() {
    const mine = store.get("updates", []);
    const subs = store.get("submissions", []);
    const venues = new Set(mine.map((u) => u.venueId));
    const tourneys = new Set(mine.filter((u) => u.tournamentId).map((u) => u.tournamentId));
    subs.forEach((s) => s.kind === "venue" ? venues.add("sub-" + s.id) : tourneys.add("sub-" + s.id));
    return {
      posts: mine.length + subs.length,
      helpful: 0, // in the live version, other parents' "helpful" taps add up here
      venues: venues.size, tournaments: tourneys.size,
      parking: mine.filter((u) => u.cat === "parking").length,
      verified: !!me()
    };
  }
  function displayParent(u) {
    if (u.mine) {
      const m = store.get("me", null) || {};
      return { name: m.first + " " + m.last + ".", town: m.town, title: m.title, level: levelFor(myStats()).name, you: true };
    }
    const p = parent(u.by);
    return { name: p.name, town: p.town, title: p.title, level: levelFor({ ...p }).name };
  }

  // ---------- live updates ----------
  const CATS = {
    parking: "🅿️ Parking", field: "🥍 Fields", weather: "⛈️ Weather",
    food: "🌭 Food", bathrooms: "🚻 Bathrooms", other: "💬 Other"
  };
  const LOAD_TIME = Date.now();
  const seeded = D.updates.map((u) => ({ ...u, ts: LOAD_TIME - u.ago * 60000 }));
  function updates(filter) {
    const reported = store.get("reported", []);
    return [...store.get("updates", []), ...seeded]
      .filter((u) => !reported.includes(u.id) && filter(u))
      .sort((a, b) => b.ts - a.ts);
  }
  const voted = (id) => !!store.get("votes", {})[id];
  const helpfulCount = (u) => (u.helpful || 0) + (voted(u.id) ? 1 : 0);

  function updateHTML(u) {
    const p = displayParent(u);
    const v = venue(u.venueId);
    return `<div class="update" data-id="${esc(u.id)}">
      <div class="who"><span class="tag">${CATS[u.cat] || ""}</span>
        <b>${esc(p.name)}</b>${p.you ? " (you)" : ""} <span class="level">${esc(p.level)}</span>
        <span>· ${esc(p.town)} · ${timeAgo(u.ts)}</span></div>
      <div class="text">${esc(u.text)}</div>
      <div class="actions">
        <button class="helpful ${voted(u.id) ? "on" : ""}" data-act="helpful" data-id="${esc(u.id)}" ${p.you ? "disabled" : ""}>👍 Helpful · ${helpfulCount(u)}</button>
        ${v ? `<small class="hint">@ ${esc(v.name)}</small>` : ""}
        <button class="report" data-act="report" data-id="${esc(u.id)}">Report</button>
      </div></div>`;
  }

  // ctx = { venueId } or { tournamentId, venueIds }
  function liveFeedHTML(ctx) {
    const list = updates((u) => ctx.tournamentId ? u.tournamentId === ctx.tournamentId : u.venueId === ctx.venueId);
    const m = me();
    const venuePick = ctx.venueIds && ctx.venueIds.length > 1
      ? `<select name="venueId" aria-label="Which venue?">${ctx.venueIds.map((id) => `<option value="${id}">${esc(venue(id).name)}</option>`).join("")}</select>`
      : `<input type="hidden" name="venueId" value="${esc(ctx.venueId || ctx.venueIds[0])}">`;
    const box = m
      ? `<form class="post-box" data-form="post" data-tournament="${esc(ctx.tournamentId || "")}">
          <div class="chips" role="radiogroup" aria-label="What's it about?">${Object.entries(CATS).map(([k, l], i) => `<button type="button" class="chip ${i === 0 ? "on" : ""}" data-cat="${k}">${l}</button>`).join("")}</div>
          <input type="hidden" name="cat" value="parking">
          ${venuePick}
          <textarea name="text" maxlength="200" placeholder="What's happening right now? e.g. “Main lot full, use overflow.”" required style="margin-top:8px"></textarea>
          <div class="counter"><span data-count>0</span>/200</div>
          <button class="btn block" type="submit">Post update</button>
        </form>`
      : `<a class="btn block" href="#/join" data-return>Join free to post updates</a>`;
    return `<section class="card live" id="live">
      <h2><span class="live-dot"></span>Live conditions</h2>
      <p class="hint">From parents on site. Newest first.</p>
      ${box}
      ${list.length ? list.map(updateHTML).join("") : `<p class="empty">No updates yet. Be the first to post!</p>`}
    </section>`;
  }

  // ---------- shared page pieces ----------
  function featuredHTML(items) {
    if (!items.length) return "";
    return `<section class="card" id="nearby"><h2>📍 Featured nearby</h2>
      ${items.map((f) => `<div class="featured-item"><div class="ad">Featured · ${esc(f.kind)} · ${esc(f.distance)}</div>
        <h3>${esc(f.name)} <span class="tag yellow">sample</span></h3><p style="margin:0">${esc(f.blurb)}</p>
        <p class="offer">🎟️ ${esc(brand(f.offer))}</p></div>`).join("")}
      <p class="hint" style="margin:0">Own a business near here? <a href="#/submit">Get featured</a></p></section>`;
  }

  // "You're here all day" checklist. Ticks are remembered on this phone.
  function packHTML(items, key, title) {
    if (!items.length) return "";
    const done = store.get("pack", {})[key] || [];
    return `<section class="card pack" id="pack"><h2>🎒 ${esc(title || "Pack for the day")}</h2>
      <p class="hint">You'll be here all day. Tick things off as you load the car.</p>
      ${items.map((it) => `<label class="pack-item"><input type="checkbox" data-pack="${esc(key)}" value="${esc(it)}" ${done.includes(it) ? "checked" : ""}><span>${esc(it)}</span></label>`).join("")}
    </section>`;
  }

  function leaderboardHTML(venueId) {
    const counts = {};
    seeded.filter((u) => u.venueId === venueId).forEach((u) => {
      counts[u.by] = counts[u.by] || { posts: 0, helpful: 0 };
      counts[u.by].posts++; counts[u.by].helpful += u.helpful;
    });
    const rows = Object.entries(counts).sort((a, b) => b[1].helpful - a[1].helpful).slice(0, 3);
    if (!rows.length) return "";
    return `<section class="card"><h2>🏅 Top fans here</h2>
      ${rows.map(([id, c], i) => { const p = parent(id); return `<div class="leader"><div class="rank">${i + 1}</div>
        <div class="grow"><b>${esc(p.name)}</b> <span class="level">${levelFor(p).name}</span><br><small>“${esc(p.title)}” · ${esc(p.town)}</small></div>
        <small>${c.helpful} 👍</small></div>`; }).join("")}
      <p class="hint" style="margin:10px 0 0">Post helpful updates to climb the board.</p></section>`;
  }

  function venueCardHTML(v) {
    const live = updates((u) => u.venueId === v.id && Date.now() - u.ts < 3 * 3600000).length;
    return `<a class="list-item" href="#/venue/${v.id}">
      <h3>${esc(v.name)}</h3>
      <div class="meta">${esc(v.type)} · ${esc(v.town)}</div>
      ${live ? `<div class="meta" style="color:var(--red);font-weight:700"><span class="live-dot"></span>${live} live update${live > 1 ? "s" : ""}</div>` : ""}
      ${v.sports.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}
      ${!v.real ? `<span class="tag yellow">Sample</span>` : !v.verdict ? `<span class="tag">Needs parent tips</span>` : ""}
    </a>`;
  }

  // A venue section, or a "nobody has reported this yet" prompt when it's empty.
  function sectionHTML(v, anchor, title, body, ask) {
    if (body) return `<section class="card" ${anchor ? `id="${anchor}"` : ""}><h2>${title}</h2>${body}</section>`;
    return `<section class="card gap" ${anchor ? `id="${anchor}"` : ""}><h2>${title}</h2>
      <p class="hint" style="margin:0">Not reported yet. ${esc(ask)} <a href="#/submit?v=${esc(v.id)}">Add it</a> and earn points.</p></section>`;
  }
  const mapsLink = (v) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(v.name + ", " + (v.address || v.town));

  function tourneyCardHTML(t) {
    const multi = t.stops.length > 1;
    return `<a class="list-item" href="#/tournament/${t.id}">
      <h3>${esc(t.name)}</h3>
      <div class="meta">${fmtDates(t)} · ${esc(t.ages)}</div>
      <span class="tag">${esc(t.sport)}</span>
      ${multi ? `<span class="tag yellow">⚠️ ${t.stops.length} venues</span>` : ""}
      ${t.parkingPass && t.parkingPass.buyAhead ? `<span class="tag green">Buy parking ahead</span>` : ""}
    </a>`;
  }

  // ============================================================
  // PAGES
  // ============================================================
  const TYPES = ["High school", "Sports complex", "Park", "Indoor facility"];
  const SPORTS = [...new Set(D.venues.flatMap((v) => v.sports))].sort();
  const TOWNS = [...new Set(D.venues.map((v) => v.town))].sort();
  const filters = { q: "", type: "", sport: "", town: "" };

  function homePage() {
    const recent = updates(() => true).slice(0, 3);
    return `<section class="hero">
        <h1>${esc(SITE.tagline).replace(/([.?!]) /g, "$1<br>")}</h1>
        <p>Where to park, what to pack, where the bathrooms are and what's happening right now — from parents who've been here since 7 a.m.</p>
        <input class="search" id="q" type="search" placeholder="Search a venue or town" value="${esc(filters.q)}" autocomplete="off">
        <div class="chips" style="margin-top:12px">
          <button class="chip ${filters.type === "" ? "on" : ""}" data-type="">All</button>
          ${TYPES.map((t) => `<button class="chip ${filters.type === t ? "on" : ""}" data-type="${t}">${t}</button>`).join("")}
        </div>
        <div class="filters">
          <select id="fSport" aria-label="Sport"><option value="">Any sport</option>${SPORTS.map((s) => `<option ${filters.sport === s ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select id="fTown" aria-label="Town"><option value="">Any town</option>${TOWNS.map((s) => `<option ${filters.town === s ? "selected" : ""}>${s}</option>`).join("")}</select>
        </div>
      </section>
      <h2 class="section-title">Venues</h2>
      <div id="results"></div>
      <h2 class="section-title">Upcoming tournaments</h2>
      ${D.tournaments.map(tourneyCardHTML).join("")}
      <h2 class="section-title"><span class="live-dot"></span>Latest from the sidelines</h2>
      <div class="card">${recent.map(updateHTML).join("")}</div>`;
  }
  function renderResults() {
    const q = filters.q.trim().toLowerCase();
    const list = D.venues.filter((v) =>
      (!q || (v.name + " " + v.town).toLowerCase().includes(q)) &&
      (!filters.type || v.type === filters.type) &&
      (!filters.sport || v.sports.includes(filters.sport)) &&
      (!filters.town || v.town === filters.town))
      .sort((a, b) => (!!b.real - !!a.real) || a.name.localeCompare(b.name)); // real venues first, samples last
    const el = document.getElementById("results");
    if (el) el.innerHTML = list.length ? list.map(venueCardHTML).join("")
      : `<p class="empty">No venues match yet. <a href="#/submit">Add one</a> and earn your First Report badge.</p>`;
  }

  function venuePage(id) {
    const v = venue(id);
    if (!v) return notFound();
    const tourneys = D.tournaments.filter((t) => t.stops.some((s) => s.venueId === id));
    return `<a class="back" href="#/">← All venues</a>
      <div class="page-head">
        <h1>${esc(v.name)}</h1>
        <div class="meta">${esc(v.type)} · ${esc(v.town)}</div>
        ${v.address ? `<div class="meta">📍 ${esc(v.address)}</div>` : ""}
        ${v.sports.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}
        ${!v.real ? `<span class="tag yellow">Sample venue — made up</span>` : ""}
        ${v.real ? `<p style="margin:10px 0 0"><a class="btn small ghost" href="${mapsLink(v)}" target="_blank" rel="noopener">🧭 Directions</a></p>` : ""}
      </div>
      ${v.verdict ? `<section class="card verdict"><h2>Quick verdict</h2><p>${esc(v.verdict)}</p>
        <div class="quick">${(v.quick || []).map((q) => `<span>${esc(q)}</span>`).join("")}</div></section>`
      : `<section class="card verdict"><h2>Be the first fan here</h2><p>Nobody has scouted this venue yet. Been here? Share parking, bathrooms and your best tip, and you'll be on the Top Fans board.</p>
        <p style="margin:12px 0 0"><a class="btn ghost" href="#/submit?v=${esc(v.id)}">Write the first tip</a></p></section>`}
      <div class="jump chips">
        <a class="chip" href="#/venue/${id}" data-jump="live">🔴 Live</a>
        ${(v.pack || []).length ? `<a class="chip" href="#/venue/${id}" data-jump="pack">🎒 Pack</a>` : ""}
        <a class="chip" href="#/venue/${id}" data-jump="parking">Parking</a>
        <a class="chip" href="#/venue/${id}" data-jump="bathrooms">Bathrooms</a>
        <a class="chip" href="#/venue/${id}" data-jump="food">Food</a>
        <a class="chip" href="#/venue/${id}" data-jump="nearby">Nearby</a>
      </div>
      ${liveFeedHTML({ venueId: id })}
      ${packHTML(v.pack || [], "venue-" + id)}
      ${sectionHTML(v, "parking", "🅿️ Parking", v.parking && `
        ${v.parking.pass ? `<span class="tag yellow">Parking pass needed on tournament days</span>` : `<span class="tag green">Free parking</span>`}
        <p style="margin-top:8px">${esc(v.parking.summary)}</p>
        <ul class="clean">${v.parking.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`, "Is it free? Which lot fills first?")}
      ${sectionHTML(v, "bathrooms", "🚻 Bathrooms", v.bathrooms && `<p>${esc(v.bathrooms)}</p>`, "Real restrooms or porta-potties?")}
      ${sectionHTML(v, "", "🪑 Seating &amp; shade", v.seating && `<p>${esc(v.seating)}</p>`, "Bleachers? Bring chairs? Any shade?")}
      ${sectionHTML(v, "food", "🌭 Food nearby", v.food && v.food.map((f) => `<div class="food-item"><b>${esc(f.name)}</b><br>${esc(f.note)}</div>`).join(""), "Concessions? Cash only? Good spots nearby?")}
      ${sectionHTML(v, "", "🧭 Getting there", v.gettingThere && `<p>${esc(v.gettingThere)}</p>`, "Which entrance? Does GPS get it wrong?")}
      ${v.insiderTip ? `<section class="card tip"><h2>💡 Insider tip</h2><p>${esc(v.insiderTip)}</p></section>`
        : sectionHTML(v, "", "💡 Insider tip", "", "What do you wish you'd known the first time?")}
      ${tourneys.length ? `<h2 class="section-title">Tournaments here</h2>${tourneys.map(tourneyCardHTML).join("")}` : ""}
      ${featuredHTML(D.featured.filter((f) => f.venueIds.includes(id)))}
      ${leaderboardHTML(id)}
      <p class="hint" style="text-align:center">Something out of date? <a href="#/submit">Suggest an edit</a></p>`;
  }

  function tournamentsPage() {
    return `<div class="page-head"><h1>Tournaments</h1><p class="meta">Upcoming in ${esc(SITE.region)}.</p></div>
      ${D.tournaments.map(tourneyCardHTML).join("")}
      <a class="btn ghost block" href="#/submit?t=tournament">+ Add a tournament</a>`;
  }

  function tournamentPage(id) {
    const t = tourney(id);
    if (!t) return notFound();
    const venueIds = [...new Set(t.stops.map((s) => s.venueId))];
    const multi = venueIds.length > 1;
    return `<a class="back" href="#/tournaments">← All tournaments</a>
      <div class="page-head">
        <h1>${esc(t.name)}</h1>
        <div class="meta">${fmtDates(t)} · ${esc(t.ages)}</div>
        <span class="tag">${esc(t.sport)}</span>
        <p style="margin-top:8px">${esc(t.summary)}</p>
        <p class="hint">Run by ${esc(t.organizer)}</p>
      </div>
      ${multi ? `<section class="card warning">
        <h2>⚠️ Heads up: ${venueIds.length} different venues</h2>
        <p>This tournament is split across locations and days. Check where <i>your</i> kid plays before you drive.</p>
        <label for="div" style="margin-top:0">Find my field</label>
        <select id="div"><option value="">Choose your division…</option>${t.divisions.map((d, i) => `<option value="${i}">${esc(d.label)}</option>`).join("")}</select>
        <div id="divResult"></div></section>` : ""}
      <section class="card"><h2>📅 Where &amp; when</h2>
        ${t.stops.map((s) => { const v = venue(s.venueId); return `<div class="stop"><div class="day">${esc(s.day)}</div>
          <div><a href="#/venue/${v.id}">${esc(v.name)}</a> · ${esc(v.town)}<br>${esc(s.who)}<br><small class="hint">${esc(s.where)}</small></div></div>`; }).join("")}
      </section>
      <section class="card"><h2>🅿️ Parking pass</h2>
        ${t.parkingPass.buyAhead ? `<span class="tag green">Buy ahead — recommended</span>` : `<span class="tag">Buy at the gate</span>`}
        <dl style="margin:10px 0 0">
          <dt><b>Cost</b></dt><dd style="margin:0 0 8px">${esc(t.parkingPass.cost)}</dd>
          <dt><b>Where to buy</b></dt><dd style="margin:0 0 8px">${esc(t.parkingPass.where)}</dd>
          <dt><b>Why buy ahead</b></dt><dd style="margin:0">${esc(t.parkingPass.why)}</dd>
        </dl></section>
      <section class="card"><h2>🌭 On-site food</h2>
        ${t.vendors.map((f) => `<div class="food-item"><b>${esc(f.name)}</b> <small class="hint">@ ${esc(venue(f.venueId).name)}</small><br>${esc(f.what)}
          <div class="pay">${f.pay.map((p) => `<span class="tag ${p === "Cash" && f.pay.length === 1 ? "red" : "green"}">${p === "Cash" && f.pay.length === 1 ? "Cash only" : esc(p)}</span>`).join("")}</div></div>`).join("")}
      </section>
      ${packHTML([...new Set([
        ...(t.parkingPass.buyAhead ? ["Parking pass bought ahead"] : []),
        ...venueIds.flatMap((vid) => venue(vid).pack || [])])], "tourney-" + id, multi ? "Pack for the weekend (both venues)" : "Pack for the day")}
      ${liveFeedHTML({ tournamentId: id, venueIds })}
      ${featuredHTML(D.featured.filter((f) => f.tournamentIds.includes(id)))}
      <p class="hint" style="text-align:center">Know something we don't? <a href="#/submit?t=tournament">Add tournament info</a></p>`;
  }

  function joinPage() {
    const sports = ["Soccer", "Lacrosse", "Baseball", "Softball", "Basketball", "Volleyball", "Hockey", "Football"];
    return `<div class="page-head"><h1>Join ${esc(SITE.name)}</h1>
        <p>You're already here all day for your kid. Post live updates, earn badges, and get credit every time you save another parent a headache.</p></div>
      <form class="card" data-form="join">
        <div class="row2">
          <div><label for="jf">First name</label><input id="jf" name="first" required autocomplete="given-name"></div>
          <div><label for="jl">Last initial</label><input id="jl" name="last" maxlength="1" required></div>
        </div>
        <label for="je">Email <span class="hint">— we'll email you once to confirm it's you</span></label>
        <input id="je" name="email" type="email" required autocomplete="email">
        <label for="jp">Password <span class="hint">— at least 8 characters</span></label>
        <input id="jp" name="password" type="password" minlength="8" required autocomplete="new-password">
        <label for="jt">Your town</label><input id="jt" name="town" required>
        <label>Your kids play</label>
        <div class="checks">${sports.map((s) => `<label><input type="checkbox" name="sports" value="${s}">${s}</label>`).join("")}</div>
        <label for="jtitle">Your fan title <span class="hint">— shows next to your name</span></label>
        <input id="jtitle" name="title" maxlength="30" placeholder="e.g. Lacrosse mom ×3, Chief Snack Officer">
        <label class="agree"><input type="checkbox" name="adult" required> I'm 18 or older, and I agree to keep posts about venues, not kids.</label>
        <p class="hint" style="margin-top:12px">🔒 Other parents see your first name, last initial, town and title. Never your email, and we never ask for your kids' names.</p>
        <button class="btn block" type="submit">Create my Fan Card</button>
        <p class="hint" style="margin:10px 0 0;text-align:center">Already joined? <a href="#/signin">Sign in</a></p>
        <p class="hint" style="margin:6px 0 0;text-align:center">Demo: nothing is emailed and your password isn't saved anywhere yet.</p>
      </form>`;
  }

  function signinPage() {
    return `<div class="page-head"><h1>Welcome back</h1><p>Sign in to post updates and keep earning points.</p></div>
      <form class="card" data-form="signin">
        <label for="se">Email</label><input id="se" name="email" type="email" required autocomplete="email">
        <label for="sp">Password</label><input id="sp" name="password" type="password" required autocomplete="current-password">
        <button class="btn block" type="submit" style="margin-top:14px">Sign in</button>
        <p class="hint" style="margin:10px 0 0;text-align:center">New here? <a href="#/join">Create your Fan Card</a> · <a href="#/signin" data-act="forgot">Forgot password?</a></p>
      </form>`;
  }

  function mePage() {
    const m = me();
    if (!m) return joinPage();
    const s = myStats(), lvl = levelFor(s);
    const pct = lvl.next ? Math.min(100, Math.round(((lvl.points - lvl.min) / (lvl.next.min - lvl.min)) * 100)) : 100;
    const mine = store.get("updates", []).sort((a, b) => b.ts - a.ts);
    return `<div class="player-card">
        <span class="lvl">⭐ ${lvl.name}</span>
        <h1>${esc(m.first)} ${esc(m.last)}.</h1>
        <p class="sub">“${esc(m.title || "All-day fan")}” · ${esc(m.town)}</p>
        <p class="sub">${(m.sports || []).map(esc).join(" · ")}</p>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <small>${lvl.points} pts${lvl.next ? ` · ${lvl.next.min - lvl.points} to ${lvl.next.name}` : " · Top level!"}</small>
      </div>
      <div class="stats">
        <div class="stat"><b>${s.posts}</b><span>Reports posted</span></div>
        <div class="stat"><b>${s.helpful}</b><span>Parents helped</span></div>
        <div class="stat"><b>${s.venues}</b><span>Venues scouted</span></div>
        <div class="stat"><b>${s.tournaments}</b><span>Tournaments</span></div>
      </div>
      <h2 class="section-title">Badges</h2>
      <div class="badges">${BADGES.map((b) => `<div class="badge ${b.test(s) ? "" : "locked"}"><span class="ico">${b.ico}</span>${b.name}</div>`).join("")}</div>
      <h2 class="section-title">How you earn points</h2>
      <div class="card"><ul class="clean">
        <li><b>10 pts</b> for every live update or venue write-up</li>
        <li><b>2 pts</b> every time a parent taps 👍 Helpful on your post</li>
        <li><b>5 pts</b> for each new venue or tournament you report from</li>
      </ul><p class="hint" style="margin:8px 0 0">Levels: Rookie → Starter → All-Star → MVP → Hall of Fame</p></div>
      <h2 class="section-title">Your recent reports</h2>
      <div class="card">${mine.length ? mine.map(updateHTML).join("") : `<p class="empty">Nothing yet. Open a venue and post a live update to earn your first badge.</p>`}</div>
      <p style="text-align:center"><a href="#/review">Owner review queue (demo)</a> · <a href="#/me" data-act="signout">Sign out</a></p>`;
  }

  function submitPage(kind, pre) {
    pre = pre || {};
    const m = me() || {};
    const types = TYPES.map((t) => `<option ${pre.type === t ? "selected" : ""}>${t}</option>`).join("");
    const contact = `<label>Your email <span class="hint">— we'll email you when it's live</span></label>
      <input name="email" type="email" required value="${esc(m.email || "")}">`;
    return `<div class="page-head"><h1>Add info</h1>
        <p>Share what you know. We review every write-up before it goes live, and you'll get credit on your Fan Card.</p></div>
      <div class="seg"><button data-kind="venue" class="${kind === "venue" ? "on" : ""}">Venue write-up</button>
        <button data-kind="tournament" class="${kind === "tournament" ? "on" : ""}">Tournament info</button></div>
      ${kind === "venue" ? `<form class="card" data-form="submit" data-kind="venue">
        <label>Venue name</label><input name="name" required placeholder="e.g. Lincoln Park Fields" value="${esc(pre.name || "")}">
        <div class="row2"><div><label>Town</label><input name="town" required value="${esc(pre.town || "")}"></div>
          <div><label>Type</label><select name="type">${types}</select></div></div>
        <label>Sports played there</label><input name="sports" placeholder="Soccer, lacrosse…">
        <label>Quick verdict <span class="hint">— one sentence</span></label><input name="verdict" maxlength="160">
        <label>Parking <span class="hint">— cost, which lot, does it fill up?</span></label><textarea name="parking"></textarea>
        <label>Bathrooms</label><textarea name="bathrooms"></textarea>
        <label>Seating &amp; shade</label><textarea name="seating"></textarea>
        <label>Food nearby</label><textarea name="food"></textarea>
        <label>Getting there</label><textarea name="gettingThere"></textarea>
        <label>Insider tip <span class="hint">— the one thing you wish you'd known</span></label><textarea name="tip"></textarea>
        ${contact}
        <button class="btn block" type="submit" style="margin-top:14px">Send for review</button></form>`
      : `<form class="card" data-form="submit" data-kind="tournament">
        <label>Tournament name</label><input name="name" required>
        <div class="row2"><div><label>First day</label><input name="start" type="date"></div>
          <div><label>Last day</label><input name="end" type="date"></div></div>
        <label>Venue(s) <span class="hint">— list each one and which days / divisions play there</span></label>
        <textarea name="venues" placeholder="Girls: Riverbend Sports Park, Saturday&#10;Boys: Rockton Hills HS, Sunday"></textarea>
        <div class="row2"><div><label>Sport(s)</label><input name="sports"></div>
          <div><label>Age groups</label><input name="ages" placeholder="U10–U15"></div></div>
        <label>Parking pass cost</label><input name="passCost" placeholder="$10/day, free…">
        <label>Where to buy it</label><input name="passWhere">
        <label>Should parents buy ahead?</label><select name="buyAhead"><option>Not sure</option><option>Yes</option><option>No</option></select>
        <label>On-site food &amp; what they accept</label><textarea name="vendors" placeholder="Concession stand – cash & card&#10;Bake sale – cash only"></textarea>
        <label>Anything else parents should know?</label><textarea name="notes"></textarea>
        ${contact}
        <button class="btn block" type="submit" style="margin-top:14px">Send for review</button></form>`}
      <div class="card"><h2>📍 Own a local business?</h2>
        <p style="margin:0">Get featured on venue and tournament pages where sports families are looking for food, coffee and hotels. Email us to get listed. (Self-serve sign-up comes later.)</p></div>`;
  }

  function reviewPage() {
    const subs = store.get("submissions", []).sort((a, b) => b.ts - a.ts);
    const label = { name: "Name", town: "Town", type: "Type", sports: "Sports", verdict: "Verdict", parking: "Parking", bathrooms: "Bathrooms", seating: "Seating & shade", food: "Food", gettingThere: "Getting there", tip: "Insider tip", start: "First day", end: "Last day", venues: "Venues", ages: "Ages", passCost: "Pass cost", passWhere: "Where to buy", buyAhead: "Buy ahead?", vendors: "Food vendors", notes: "Notes", email: "Submitted by" };
    return `<div class="page-head"><h1>Review queue</h1>
        <p>This is what you'll see as the owner. In the live version you also get an email for each new submission, and this page is password-protected.</p></div>
      ${subs.length ? subs.map((s) => `<div class="card review-item ${s.status}">
        <span class="tag">${s.kind === "venue" ? "Venue write-up" : "Tournament"}</span>
        <span class="tag ${s.status === "approved" ? "green" : s.status === "rejected" ? "red" : "yellow"}">${s.status}</span>
        <small class="hint">${timeAgo(s.ts)}</small>
        <dl>${Object.entries(s.fields).filter(([, v]) => v).map(([k, v]) => `<dt>${label[k] || esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
        ${s.status === "pending" ? `<div style="display:flex;gap:8px"><button class="btn small" data-act="approve" data-id="${s.id}">Approve</button>
          <button class="btn small ghost" data-act="reject" data-id="${s.id}">Reject</button></div>` : ""}
      </div>`).join("") : `<p class="empty">Nothing waiting. Try the <a href="#/submit">Add info</a> form to see how a submission shows up here.</p>`}`;
  }

  function notFound() {
    return `<div class="page-head"><h1>Not found</h1><p><a href="#/">Back to venues</a></p></div>`;
  }

  // ============================================================
  // ROUTER + EVENTS
  // ============================================================
  function render() {
    const [path, query] = location.hash.replace(/^#\/?/, "").split("?");
    const [page, id] = path.split("/");
    const params = new URLSearchParams(query || "");
    const pages = {
      "": homePage, venue: () => venuePage(id), tournaments: tournamentsPage,
      tournament: () => tournamentPage(id), submit: () => submitPage(params.get("t") || "venue", venue(params.get("v"))),
      me: mePage, join: () => me() ? mePage() : joinPage(), signin: () => me() ? mePage() : signinPage(), review: reviewPage
    };
    app.innerHTML = (pages[page] || notFound)();
    if (page === "") renderResults();
    const tab = { "": "home", venue: "home", tournaments: "tournaments", tournament: "tournaments", submit: "submit", me: "me", join: "me", review: "me" }[page];
    document.querySelectorAll(".tabbar a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
    const m = me();
    const chip = document.getElementById("meChip");
    chip.textContent = m ? `⭐ ${m.first} · ${levelFor(myStats()).name}` : "Join free";
    if (!render.keepScroll) window.scrollTo(0, 0);
    render.keepScroll = false;
  }
  const rerender = () => { render.keepScroll = true; const y = scrollY; render(); scrollTo(0, y); };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act],[data-type],[data-cat],[data-kind],[data-jump],[data-return]");
    if (!t) return;
    if (t.dataset.return !== undefined) { store.set("return", location.hash); return; }
    if (t.dataset.jump) { e.preventDefault(); document.getElementById(t.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (t.dataset.type !== undefined) { filters.type = t.dataset.type; document.querySelectorAll("[data-type]").forEach((c) => c.classList.toggle("on", c === t)); renderResults(); return; }
    if (t.dataset.cat) {
      const form = t.closest("form");
      form.querySelectorAll("[data-cat]").forEach((c) => c.classList.toggle("on", c === t));
      form.cat.value = t.dataset.cat; return;
    }
    if (t.dataset.kind) { location.hash = "#/submit?t=" + t.dataset.kind; return; }
    const id = t.dataset.id;
    switch (t.dataset.act) {
      case "helpful": {
        const v = store.get("votes", {});
        if (v[id]) delete v[id]; else { v[id] = true; toast("Thanks! That parent just earned 2 points 🙌"); }
        store.set("votes", v); rerender(); break;
      }
      case "report": {
        if (!confirm("Report this update as wrong or inappropriate? It will be hidden while we take a look.")) return;
        store.set("reported", [...store.get("reported", []), id]); toast("Thanks — we'll take a look."); rerender(); break;
      }
      case "approve": case "reject": {
        const subs = store.get("submissions", []);
        const s = subs.find((x) => x.id === id); if (s) s.status = t.dataset.act === "approve" ? "approved" : "rejected";
        store.set("submissions", subs);
        toast(t.dataset.act === "approve" ? "Approved — the parent gets a “you're live!” email" : "Rejected"); rerender(); break;
      }
      case "signout": {
        e.preventDefault();
        if (confirm("Sign out? Your demo posts stay in this browser.")) { store.set("signedin", false); render(); }
        break;
      }
      case "forgot": {
        e.preventDefault();
        toast("In the live site, we'll email you a reset link.");
        break;
      }
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "q") { filters.q = e.target.value; renderResults(); }
    if (e.target.name === "text" && e.target.closest("[data-form=post]")) {
      e.target.closest("form").querySelector("[data-count]").textContent = e.target.value.length;
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "fSport") { filters.sport = e.target.value; renderResults(); }
    if (e.target.id === "fTown") { filters.town = e.target.value; renderResults(); }
    if (e.target.dataset.pack) {
      const all = store.get("pack", {}), key = e.target.dataset.pack;
      const set = new Set(all[key] || []);
      e.target.checked ? set.add(e.target.value) : set.delete(e.target.value);
      all[key] = [...set]; store.set("pack", all);
      const box = e.target.closest(".pack");
      if (box.querySelectorAll("input:checked").length === box.querySelectorAll("input").length) toast("All packed. Have a great game day! 🙌");
    }
    if (e.target.id === "div") {
      const [, id] = location.hash.replace(/^#\/?/, "").split("/");
      const d = tourney(id).divisions[e.target.value];
      document.getElementById("divResult").innerHTML = d ? `<div class="myfield">${d.plan.map((p) => {
        const v = venue(p.venueId);
        return `<div class="stop"><div class="day">${esc(p.day)}</div><div><a href="#/venue/${v.id}">${esc(v.name)}</a><br>${esc(v.town)} · ${esc(p.note)}</div></div>`;
      }).join("")}</div>` : "";
    }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target; e.preventDefault();
    const data = Object.fromEntries(new FormData(f));
    if (f.dataset.form === "join") {
      store.set("me", { first: data.first.trim(), last: data.last.trim().toUpperCase(), email: data.email.trim(), town: data.town.trim(),
        title: data.title.trim(), sports: new FormData(f).getAll("sports"), adult: true, joined: Date.now() });
      store.set("signedin", true); // the password is never stored in demo mode
      toast(`Welcome to ${SITE.name}, ${data.first.trim()}! ✅ Verified Fan`);
      const back = store.get("return", null); store.set("return", null);
      if (back && back !== location.hash) location.hash = back; else render();
    }
    if (f.dataset.form === "signin") {
      const saved = store.get("me", null);
      if (saved && saved.email.toLowerCase() === data.email.trim().toLowerCase()) {
        store.set("signedin", true); toast(`Welcome back, ${saved.first}!`); location.hash = "#/me";
      } else toast("No account with that email in this demo. Try “Create your Fan Card”.");
    }
    if (f.dataset.form === "post") {
      if (!data.text.trim()) return;
      const before = levelFor(myStats()).name;
      const u = { id: "m" + uid(), mine: true, venueId: data.venueId, cat: data.cat, text: data.text.trim(), ts: Date.now(), helpful: 0 };
      if (f.dataset.tournament) u.tournamentId = f.dataset.tournament;
      store.set("updates", [u, ...store.get("updates", [])]);
      const after = levelFor(myStats()).name;
      toast(after !== before ? `🎉 Level up! You're now a ${after}` : "Posted! +10 points");
      rerender();
    }
    if (f.dataset.form === "submit") {
      const s = { id: "s" + uid(), kind: f.dataset.kind, fields: data, status: "pending", ts: Date.now() };
      store.set("submissions", [s, ...store.get("submissions", [])]);
      app.innerHTML = `<div class="page-head" style="text-align:center;padding-top:40px">
        <h1>🙌 You're a legend</h1>
        <p>Thanks for helping other sports parents. We'll review it and email you at <b>${esc(data.email)}</b> when it goes live.</p>
        <p class="hint">+10 points on your Fan Card.</p>
        <a class="btn" href="#/me">See my card</a> <a class="btn ghost" href="#/review">See the review queue</a></div>`;
      scrollTo(0, 0);
    }
  });

  // Logo: "DA" heavy white, "ROAD" lighter sky blue.
  document.querySelectorAll("[data-site-name]").forEach((el) => (el.innerHTML = esc(SITE.name).replace(/ (\S+)$/, ' <span class="road">$1</span>')));
  document.title = SITE.name + " — " + SITE.tagline;
  window.addEventListener("hashchange", render);
  render();
})();

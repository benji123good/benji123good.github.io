const DEMO_CATALOG = {
  featured: "neon-runner",
  games: [
    { id:"neon-runner", title:"Neon Runner", genre:"Arcade", description:"Dodge, dash, and beat your high score.", cover:"https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", url:"#", tags:["Fast","Single player"] },
    { id:"cloud-garden", title:"Cloud Garden", genre:"Cozy", description:"Grow a tiny world, one floating island at a time.", cover:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80", url:"#", tags:["Relaxing","Builder"] },
    { id:"orbit-tactics", title:"Orbit Tactics", genre:"Strategy", description:"Plan clever turns among a field of shifting planets.", cover:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", url:"#", tags:["Puzzle","Turn-based"] },
    { id:"pixel-kart", title:"Pixel Kart", genre:"Racing", description:"A quick, bright kart race for up to four players.", cover:"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80", url:"#", tags:["Racing","Local"] }
  ]
};
let catalog = DEMO_CATALOG, activeGenre = "All", query = "";
const $ = s => document.querySelector(s);
const absoluteUrl = (value, sourceUrl) => new URL(value, sourceUrl).href;

async function loadCatalog(url) {
  if (!url) { catalog = DEMO_CATALOG; render("Using the sample catalog — connect your own folder when ready."); return; }
  try {
    const response = await fetch(url, { cache:"no-store" });
    if (!response.ok) throw new Error(`Catalog returned ${response.status}`);
    const raw = await response.json();
    if (!Array.isArray(raw.games)) throw new Error("catalog.json needs a games array");
    catalog = { ...raw, games: raw.games.map(game => ({ ...game, cover:absoluteUrl(game.cover, url), url:absoluteUrl(game.url, url) })) };
    render(`Connected to ${new URL(url).host}`);
  } catch (error) { catalog = DEMO_CATALOG; render(`Couldn’t load that catalog (${error.message}). Showing the sample instead.`); }
}
function render(status) {
  $("#catalog-status").textContent = status;
  const genres = ["All", ...new Set(catalog.games.map(g => g.genre).filter(Boolean))];
  $("#filters").replaceChildren(...genres.map(genre => { const b=document.createElement("button"); b.className=`filter ${genre===activeGenre?"active":""}`; b.textContent=genre; b.onclick=()=>{activeGenre=genre;render(status)}; return b; }));
  const visible = catalog.games.filter(g => (activeGenre==="All" || g.genre===activeGenre) && `${g.title} ${g.genre} ${(g.tags||[]).join(" ")}`.toLowerCase().includes(query));
  $("#count").textContent = `${visible.length} game${visible.length===1?"":"s"}`;
  const grid=$("#games"); grid.replaceChildren();
  if (!visible.length) { grid.innerHTML='<div class="empty">No games match that search.</div>'; }
  visible.forEach(game => { const node=$("#game-template").content.cloneNode(true); const link=node.querySelector(".cover-link"), img=node.querySelector("img"); link.href=game.url; img.src=game.cover; img.alt=`Cover art for ${game.title}`; node.querySelector(".genre").textContent=game.genre || "Game"; node.querySelector("h3").textContent=game.title; node.querySelector(".description").textContent=game.description || ""; (game.tags||[]).forEach(tag=>{const el=document.createElement("span");el.className="tag";el.textContent=tag;node.querySelector(".tags").append(el)});grid.append(node); });
  const selected = catalog.games.find(g=>g.id===catalog.featured) || catalog.games[0]; const feature=$("#featured"); feature.replaceChildren(); if(selected) { const a=document.createElement("a");a.className="feature-card";a.href=selected.url;a.target="_blank";a.rel="noopener";a.style.backgroundImage=`url("${selected.cover}")`;a.innerHTML=`<p class="eyebrow">FEATURED GAME</p><h2>${selected.title}</h2><p>${selected.description||"Play now"}</p>`;feature.append(a); }
}
const dialog=$("#catalog-dialog"); $("#catalog-button").onclick=()=>{ $("#catalog-url").value=localStorage.catalogUrl||""; dialog.showModal(); }; $("#demo-button").onclick=()=>{localStorage.removeItem("catalogUrl");loadCatalog("")}; $("#save-catalog").onclick=e=>{e.preventDefault();const url=$("#catalog-url").value.trim();if(url)localStorage.catalogUrl=url;else localStorage.removeItem("catalogUrl");dialog.close();loadCatalog(url)}; $("#search").oninput=e=>{query=e.target.value.toLowerCase().trim();render($("#catalog-status").textContent)}; loadCatalog(localStorage.catalogUrl||"");

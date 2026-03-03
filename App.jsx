import { useState, useEffect, useRef, useCallback } from "react";

/* ═══ DATA ═══ */
const EXP = [
  { id:1,title:"Sunset Yacht Charter — Amalfi Coast",loc:"Amalfi, Italy",city:"amalfi",region:"italy",cat:"yacht",tags:["boating","sailing","water","romantic","luxury"],price:2800,duration:"6 hours",time:"2:00 PM",rating:4.97,reviews:43,host:"Captain Marco Bellini",ha:"MB",img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",desc:"Sail the Amalfi coastline aboard a 60-foot luxury catamaran with champagne, a private chef, and hidden grotto stops.",inc:["Private chef lunch","Premium champagne","Snorkeling gear","Photographer"]},
  { id:2,title:"Private Omakase with Chef Tanaka",loc:"Tokyo, Japan",city:"tokyo",region:"japan",cat:"dining",tags:["food","sushi","japanese","cultural","dinner"],price:1200,duration:"3 hours",time:"7:00 PM",rating:5.0,reviews:28,host:"Chef Kenji Tanaka",ha:"KT",img:"https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&q=80",desc:"An intimate 18-course omakase in Chef Tanaka's private kitchen overlooking the Imperial Palace gardens.",inc:["18-course omakase","Sake pairing","Kitchen tour","Recipe booklet"]},
  { id:3,title:"Helicopter Wine Tour — Napa to Sonoma",loc:"Napa Valley, California",city:"napa",region:"california",cat:"wine",tags:["wine","helicopter","adventure","food","tasting"],price:3500,duration:"8 hours",time:"9:00 AM",rating:4.95,reviews:67,host:"Sommelier Claire Duval",ha:"CD",img:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",desc:"Helicopter flight over vineyards, three exclusive estates, rare library wines, and a Michelin vineyard lunch.",inc:["Helicopter transport","3 private tastings","Michelin lunch","6 bottles shipped"]},
  { id:4,title:"Deep Sea Fishing Charter",loc:"Miami, Florida",city:"miami",region:"florida",cat:"fishing",tags:["fishing","ocean","boat","adventure","outdoors","water"],price:2200,duration:"Full day",time:"6:00 AM",rating:4.92,reviews:54,host:"Captain Ray Gonzalez",ha:"RG",img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",desc:"Head offshore on a 48-foot Yellowfin for sailfish, mahi-mahi and tuna in the Gulf Stream.",inc:["All tackle & gear","Lunch & drinks","Fish cleaning","GoPro footage"]},
  { id:5,title:"South Beach Food & Cocktail Tour",loc:"Miami, Florida",city:"miami",region:"florida",cat:"dining",tags:["food","cocktails","nightlife","walking","cultural","miami"],price:350,duration:"4 hours",time:"6:00 PM",rating:4.89,reviews:112,host:"Chef Maria Santos",ha:"MS",img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",desc:"Walk South Beach's best-kept culinary secrets — 6 stops from ceviche bars to rooftop cocktails with a local chef guide.",inc:["6 food stops","3 cocktails","Local guide","VIP skip-the-line"]},
  { id:6,title:"Private Yacht Sunset Cruise",loc:"Miami, Florida",city:"miami",region:"florida",cat:"yacht",tags:["boating","yacht","sunset","romantic","luxury","water","miami"],price:1800,duration:"4 hours",time:"4:00 PM",rating:4.96,reviews:67,host:"Captain Diego Reyes",ha:"DR",img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",desc:"Cruise Biscayne Bay and the Miami skyline aboard a 52-foot luxury yacht. Champagne, canapes, and the best sunset in the city.",inc:["Premium champagne","Canapes","Bluetooth sound system","Photographer"]},
  { id:7,title:"Everglades Airboat & Wildlife Safari",loc:"Miami, Florida",city:"miami",region:"florida",cat:"adventure",tags:["adventure","nature","wildlife","outdoors","airboat","miami"],price:450,duration:"5 hours",time:"8:00 AM",rating:4.91,reviews:89,host:"Guide Carlos Vega",ha:"CV",img:"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",desc:"Race through the Everglades on a private airboat, spot alligators and exotic birds, and learn from a 3rd-generation guide.",inc:["Private airboat","Wildlife guide","Lunch","Photography"]},
  { id:8,title:"Wynwood Art & Street Culture Experience",loc:"Miami, Florida",city:"miami",region:"florida",cat:"cultural",tags:["art","culture","walking","street art","creative","miami"],price:280,duration:"3 hours",time:"10:00 AM",rating:4.94,reviews:76,host:"Artist Luna Martinez",ha:"LM",img:"https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80",desc:"Explore Wynwood's iconic murals and hidden galleries with a working street artist. Includes a hands-on spray paint session.",inc:["Gallery access","Spray paint session","Art history guide","Coffee & snacks"]},
  { id:9,title:"Spa Day at Faena Miami Beach",loc:"Miami, Florida",city:"miami",region:"florida",cat:"spa",tags:["spa","wellness","relaxation","luxury","beach","miami"],price:890,duration:"Half day",time:"10:00 AM",rating:4.97,reviews:44,host:"Therapist Ana Lucia",ha:"AL",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",desc:"The ultimate Miami spa experience — hammam ritual, oceanfront massage, and lunch at the Faena pool deck.",inc:["Hammam ritual","90-min massage","Pool access","Lunch"]},
  { id:10,title:"Private Golf at Doral Blue Monster",loc:"Miami, Florida",city:"miami",region:"florida",cat:"golf",tags:["golf","sport","outdoors","luxury","miami"],price:1200,duration:"5 hours",time:"7:00 AM",rating:4.93,reviews:31,host:"Pro Mike Henderson",ha:"MH",img:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80",desc:"Play the legendary Blue Monster course at Trump National Doral with a PGA teaching pro.",inc:["Green fees","Cart","Pro instruction","Lunch at clubhouse"]},
  { id:11,title:"St Andrews Old Course — VIP Golf",loc:"St Andrews, Scotland",city:"standrews",region:"scotland",cat:"golf",tags:["golf","sport","cultural","luxury","whisky"],price:5500,duration:"Full day",time:"7:30 AM",rating:4.98,reviews:19,host:"Pro Alistair McLeod",ha:"AM",img:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80",desc:"Play the birthplace of golf with a former European Tour pro, caddie, and R&A whisky tasting.",inc:["Green fees","Professional caddie","Warm-up session","R&A whisky tasting"]},
  { id:12,title:"Bali Cliff-Edge Spa Retreat",loc:"Uluwatu, Bali",city:"bali",region:"bali",cat:"spa",tags:["spa","wellness","relaxation","meditation","cultural"],price:980,duration:"5 hours",time:"9:00 AM",rating:4.95,reviews:61,host:"Healer Wayan Dharma",ha:"WD",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",desc:"Balinese massage, flower bath, guided meditation, raw food feast on southern cliffs.",inc:["90-min massage","Flower bath","Meditation","Raw food lunch"]},
  { id:13,title:"Private Catamaran — Greek Islands",loc:"Santorini, Greece",city:"santorini",region:"greece",cat:"yacht",tags:["boating","sailing","romantic","water","sunset"],price:3200,duration:"Full day",time:"9:00 AM",rating:4.94,reviews:38,host:"Captain Nikos P.",ha:"NP",img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",desc:"Cruise the caldera — hot springs, Red Beach, sunset dinner anchored off Oia.",inc:["BBQ dinner","Open bar","Snorkeling","Towels & sunbeds"]},
  { id:14,title:"Champagne Cellar Tour — Épernay",loc:"Épernay, France",city:"epernay",region:"france",cat:"wine",tags:["wine","champagne","cultural","food","tasting"],price:1600,duration:"6 hours",time:"10:00 AM",rating:4.97,reviews:41,host:"Sommelier Pierre Laurent",ha:"PL",img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",desc:"Legendary chalk cellars, vintage cuvées, private vineyard lunch.",inc:["3 cellar tours","6+ tastings","Vineyard lunch","Vintage bottle"]},
  { id:15,title:"Jet Ski Tour of Biscayne Bay",loc:"Miami, Florida",city:"miami",region:"florida",cat:"adventure",tags:["water","adventure","jet ski","outdoors","fun","miami"],price:320,duration:"2 hours",time:"11:00 AM",rating:4.88,reviews:93,host:"Guide Tommy Reeves",ha:"TR",img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",desc:"Ride jet skis through Biscayne Bay, past Star Island celebrity homes, and under the MacArthur Causeway.",inc:["Jet ski rental","Safety gear","Guide","Photos"]},
];

const CATS=[{id:"all",l:"All",i:"◈"},{id:"yacht",l:"Boating",i:"⛵"},{id:"dining",l:"Dining",i:"🍽"},{id:"wine",l:"Wine",i:"🍷"},{id:"fishing",l:"Fishing",i:"🎣"},{id:"golf",l:"Golf",i:"⛳"},{id:"spa",l:"Spa",i:"✧"},{id:"adventure",l:"Adventure",i:"🚁"},{id:"cultural",l:"Culture",i:"🏛"}];
const fmt=n=>"$"+n.toLocaleString();

const GROUP_TYPES = [
  { id: "couple", label: "Couple's Getaway", icon: "💑" },
  { id: "boys", label: "Boys Trip", icon: "🤝" },
  { id: "girls", label: "Girls Trip", icon: "👯" },
  { id: "family", label: "Family Trip", icon: "👨‍👩‍👧‍👦" },
  { id: "solo", label: "Solo Adventure", icon: "🧭" },
  { id: "business", label: "Business / Corporate", icon: "💼" },
];

const BUDGET_OPTIONS = [
  { id: "budget", label: "Under $200/day", range: [0, 200], icon: "$" },
  { id: "moderate", label: "$200–$500/day", range: [200, 500], icon: "$$" },
  { id: "premium", label: "$500–$1,500/day", range: [500, 1500], icon: "$$$" },
  { id: "luxury", label: "$1,500+/day", range: [1500, 99999], icon: "$$$$" },
];

/* ═══ ICONS ═══ */
const ic={
  chat:a=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  ideas:a=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  trip:a=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  msg:a=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  prof:a=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star:()=><svg width="11" height="11" viewBox="0 0 24 24" fill="#D97706"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  back:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  plus:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chk:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  send:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  arrow:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ═══ AI PARSING ═══ */
function parseUserMessage(text) {
  const t = text.toLowerCase();
  const info = { cities: [], interests: [], dates: null, groupSize: null, groupType: null, budget: null, numDays: null };
  const cityMap = {
    miami: "miami", "south beach": "miami", wynwood: "miami", brickell: "miami",
    tokyo: "tokyo", japan: "tokyo",
    italy: "amalfi", amalfi: "amalfi", tuscany: "amalfi", rome: "amalfi",
    bali: "bali", greece: "santorini", santorini: "santorini",
    napa: "napa", california: "napa", france: "epernay", paris: "epernay",
    scotland: "standrews", cabo: "cabo", mexico: "cabo",
  };
  Object.entries(cityMap).forEach(([k, v]) => { if (t.includes(k) && !info.cities.includes(v)) info.cities.push(v); });

  const intMap = {
    food: ["food", "eat", "restaurant", "dining", "culinary", "chef", "sushi", "dinner", "lunch", "brunch"],
    water: ["boat", "yacht", "sailing", "jet ski", "water", "ocean", "cruise", "catamaran", "fishing"],
    adventure: ["adventure", "thrill", "explore", "airboat", "helicopter", "safari", "extreme"],
    culture: ["art", "culture", "museum", "history", "gallery", "street art", "mural", "learn"],
    wellness: ["spa", "wellness", "relax", "massage", "meditation", "yoga", "retreat"],
    sport: ["golf", "sport", "tennis", "fitness"],
    nightlife: ["nightlife", "bar", "club", "cocktail", "drink", "party"],
    wine: ["wine", "champagne", "tasting", "vineyard", "winery"],
    nature: ["nature", "wildlife", "everglades", "park", "hike", "outdoor"],
  };
  Object.entries(intMap).forEach(([cat, words]) => { words.forEach(w => { if (t.includes(w) && !info.interests.includes(cat)) info.interests.push(cat); }); });

  // Parse group size
  const sizeMatch = t.match(/(\d+)\s*(people|persons|of us|guys|girls|friends|guests|pax)/);
  if (sizeMatch) info.groupSize = parseInt(sizeMatch[1]);
  if (t.includes("just me") || t.includes("solo") || t.includes("by myself")) info.groupSize = 1;
  if (t.includes("two of us") || t.includes("me and my") || t.includes("couple")) info.groupSize = 2;

  // Parse group type
  if (t.includes("boys trip") || t.includes("guys trip") || t.includes("bachelor")) info.groupType = "boys";
  if (t.includes("girls trip") || t.includes("bachelorette")) info.groupType = "girls";
  if (t.includes("family") || t.includes("kids") || t.includes("children")) info.groupType = "family";
  if (t.includes("couple") || t.includes("anniversary") || t.includes("honeymoon") || t.includes("romantic")) info.groupType = "couple";
  if (t.includes("solo")) info.groupType = "solo";
  if (t.includes("business") || t.includes("corporate") || t.includes("team")) info.groupType = "business";

  // Parse number of days
  const dayMatch = t.match(/(\d+)\s*(days?|nights?)/);
  if (dayMatch) info.numDays = parseInt(dayMatch[1]);
  if (t.includes("weekend") || t.includes("2 days")) info.numDays = 2;
  if (t.includes("long weekend")) info.numDays = 3;
  if (t.includes("week") && !t.includes("weekend")) info.numDays = 7;

  // Parse dates
  const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  months.forEach((m, idx) => {
    const re = new RegExp(m + "\\s*(\\d{1,2})?");
    const match = t.match(re);
    if (match) {
      const day = match[1] ? parseInt(match[1]) : 1;
      info.dates = `${m.charAt(0).toUpperCase() + m.slice(1)} ${day}`;
    }
  });
  if (t.includes("this weekend")) info.dates = "This weekend";
  if (t.includes("next week")) info.dates = "Next week";
  if (t.includes("next month")) info.dates = "Next month";

  return info;
}

function getFilteredExperiences(info) {
  const { cities, interests } = info;
  return EXP.map(exp => {
    let score = 0;
    if (cities?.length) {
      if (cities.includes(exp.city)) score += 10;
      else if (cities.some(c => exp.region.includes(c))) score += 5;
    }
    if (interests?.length) {
      interests.forEach(int => {
        exp.tags.forEach(tag => {
          if (tag.includes(int) || int.includes(tag)) score += 2;
        });
      });
    }
    return { ...exp, score };
  }).filter(e => e.score > 0).sort((a, b) => b.score - a.score);
}

/* ═══ ONBOARDING STAGES ═══ */
const STAGES = ["destination", "dates", "group_size", "group_type", "budget", "interests", "complete"];

function getNextQuestion(stage, userInfo) {
  switch (stage) {
    case "destination":
      return "Where are you headed? Tell me a city or region and I'll start pulling together the best experiences there.";
    case "dates":
      return "When are you going, and for how many days?";
    case "group_size":
      return "How many people are in your group?";
    case "group_type":
      return "What kind of trip is this?";
    case "budget":
      return "What's your ideal daily budget per person for experiences?";
    case "interests":
      return `Perfect — I'm building your ${userInfo.cities?.[0] ? userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1) : ''} itinerary now. What kind of experiences are you drawn to? Think food, water sports, nightlife, adventure, culture, wellness…`;
    default:
      return null;
  }
}

/* ═══ STYLE CONSTANTS ═══ */
const COLORS = {
  bg: "#F9F7F4",
  surface: "#FFFFFF",
  surfaceAlt: "#F0EDE8",
  text: "#1a1a1a",
  textSec: "#8C8578",
  textTer: "#B8B0A4",
  accent: "#C6785C",
  accentHover: "#B56A4F",
  accentLight: "#FDF0EB",
  border: "#EBE6DF",
  success: "#059669",
  successBg: "#ECFDF5",
  chatUser: "#C6785C",
  chatBot: "#F0EDE8",
};

/* ═══ COMPONENTS ═══ */
function CCard({ exp, onClick, onAdd, added, compact }) {
  if (compact) return (
    <div onClick={onClick} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", alignItems: "center" }}>
      <img src={exp.img} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>{exp.loc} · {exp.duration}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>{ic.star()}<span style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: COLORS.text }}>{exp.rating}</span><span style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec }}>· {fmt(exp.price)}/pp</span></div>
      </div>
      {onAdd && <button onClick={e => { e.stopPropagation(); onAdd(exp); }} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: added ? COLORS.successBg : COLORS.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>{added ? ic.chk() : ic.plus()}</button>}
    </div>
  );
  return null;
}

function Detail({ exp, onBack, onAdd, added }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
      <div style={{ position: "relative", height: 260 }}>
        <img src={exp.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>{ic.back()}</button>
      </div>
      <div style={{ padding: "20px 20px 130px", background: COLORS.surface, borderRadius: "20px 20px 0 0", marginTop: -20, position: "relative" }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>{exp.loc}</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "0 0 10px", lineHeight: 1.3 }}>{exp.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginBottom: 20 }}>{ic.star()}<span style={{ fontWeight: 600, color: COLORS.text }}>{exp.rating}</span><span>({exp.reviews})</span><span>·</span><span>{exp.duration}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 18, borderBottom: `1px solid ${COLORS.border}`, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: COLORS.text }}>{exp.ha}</div>
          <div><div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600 }}>Hosted by {exp.host}</div></div>
        </div>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.75, color: COLORS.textSec, marginBottom: 20 }}>{exp.desc}</p>
        <h4 style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, marginBottom: 12, color: COLORS.text }}>What's included</h4>
        {exp.inc.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginBottom: 8 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent, flexShrink: 0 }} />{item}</div>)}
      </div>
      <div style={{ position: "fixed", bottom: 70, left: 0, right: 0, maxWidth: 480, margin: "0 auto", padding: "14px 20px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div><span style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: COLORS.text }}>{fmt(exp.price)}</span><span style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec }}> /person</span></div>
        <button onClick={() => onAdd(exp)} style={{ padding: "11px 26px", borderRadius: 24, border: "none", background: added ? COLORS.successBg : COLORS.accent, color: added ? COLORS.success : "#fff", fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{added ? "✓ Added" : "Add to trip"}</button>
      </div>
    </div>
  );
}

/* ═══ CHIP SELECT (for onboarding) ═══ */
function ChipSelect({ options, onSelect, multi }) {
  const [selected, setSelected] = useState(multi ? [] : null);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
      {options.map(opt => {
        const isSelected = multi ? selected.includes(opt.id) : selected === opt.id;
        return (
          <button key={opt.id} onClick={() => {
            if (multi) {
              const next = isSelected ? selected.filter(s => s !== opt.id) : [...selected, opt.id];
              setSelected(next);
              onSelect(next);
            } else {
              setSelected(opt.id);
              onSelect(opt.id);
            }
          }} style={{
            padding: "8px 16px", borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
            border: `1.5px solid ${isSelected ? COLORS.accent : COLORS.border}`,
            background: isSelected ? COLORS.accentLight : COLORS.surface,
            color: isSelected ? COLORS.accent : COLORS.textSec,
            fontFamily: "var(--fb)", fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {opt.icon && <span style={{ fontSize: 15 }}>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══ TAB 1: AI CHAT (Claude-style) ═══ */
function AIChat({ userInfo, setUserInfo, trip, onAdd }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [det, setDet] = useState(null);
  const [stage, setStage] = useState("destination");
  const [showChips, setShowChips] = useState(null);
  const end = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMsgs([{
        f: "bot",
        t: "Welcome to Élevé. I'll help you build an unforgettable trip — curated experiences, all in one place.\n\nWhere are you headed?"
      }]);
    }, 300);
  }, []);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking, showChips]);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
  }, []);

  const advanceStage = (parsed, newInfo) => {
    let nextStage = stage;
    const stageIdx = STAGES.indexOf(stage);

    // Figure out which stage to go to
    if (stage === "destination" && newInfo.cities?.length > 0) nextStage = "dates";
    else if (stage === "dates" && (parsed.dates || parsed.numDays)) nextStage = "group_size";
    else if (stage === "group_size" && (parsed.groupSize || newInfo.groupSize)) nextStage = "group_type";
    else if (stage === "group_type") nextStage = "budget";
    else if (stage === "budget") nextStage = "interests";
    else if (stage === "interests" && newInfo.interests?.length > 0) nextStage = "complete";

    // If they gave extra info, skip ahead
    if (newInfo.cities?.length && newInfo.dates && newInfo.groupSize && newInfo.interests?.length) {
      nextStage = "complete";
    } else if (newInfo.cities?.length && newInfo.dates && newInfo.groupSize) {
      if (STAGES.indexOf(nextStage) < STAGES.indexOf("group_type")) nextStage = "group_type";
    }

    return nextStage;
  };

  const send = (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text) return;
    if (!overrideText) setMsgs(p => [...p, { f: "user", t: text }]);
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }
    setThinking(true);
    setShowChips(null);

    setTimeout(() => {
      const parsed = parseUserMessage(text);
      const newInfo = {
        cities: [...new Set([...(userInfo.cities || []), ...parsed.cities])],
        interests: [...new Set([...(userInfo.interests || []), ...parsed.interests])],
        dates: parsed.dates || userInfo.dates,
        groupSize: parsed.groupSize || userInfo.groupSize,
        groupType: parsed.groupType || userInfo.groupType,
        budget: parsed.budget || userInfo.budget,
        numDays: parsed.numDays || userInfo.numDays,
      };
      setUserInfo(newInfo);

      const nextStage = advanceStage(parsed, newInfo);
      setStage(nextStage);

      let response = "";
      if (nextStage === "complete") {
        const matches = getFilteredExperiences(newInfo);
        const cityName = newInfo.cities?.[0] ? newInfo.cities[0].charAt(0).toUpperCase() + newInfo.cities[0].slice(1) : "your destination";
        const groupLabel = newInfo.groupType ? GROUP_TYPES.find(g => g.id === newInfo.groupType)?.label || "" : "";

        response = `Here's what I've curated for your${groupLabel ? " " + groupLabel.toLowerCase() : ""} to ${cityName}`;
        if (newInfo.numDays) response += ` (${newInfo.numDays} day${newInfo.numDays > 1 ? "s" : ""})`;
        if (newInfo.groupSize) response += ` for ${newInfo.groupSize} guest${newInfo.groupSize > 1 ? "s" : ""}`;
        response += ".\n\nBrowse below and tap + to add anything to your itinerary. You can also check the Ideas tab for the full catalog.";

        setThinking(false);
        setMsgs(p => [...p, { f: "bot", t: response }]);
        // Show recs
        if (matches.length > 0) {
          setTimeout(() => {
            setMsgs(p => [...p, { f: "bot", t: "__RECS__", recs: matches.slice(0, 5) }]);
          }, 400);
        }
        return;
      }

      // Stage-specific responses
      if (nextStage === "dates" && parsed.cities.length) {
        const cityName = parsed.cities[0].charAt(0).toUpperCase() + parsed.cities[0].slice(1);
        response = `${cityName} — excellent taste. When are you going, and for how many days?`;
      } else if (nextStage === "group_size") {
        response = parsed.numDays
          ? `${parsed.numDays} day${parsed.numDays > 1 ? "s" : ""} — I'll plan accordingly. How many people are coming?`
          : parsed.dates
            ? `Got it, ${parsed.dates}. How many people will be in your group?`
            : getNextQuestion(nextStage, newInfo);
      } else if (nextStage === "group_type") {
        response = `Party of ${newInfo.groupSize} — noted. What kind of trip is this?`;
        setThinking(false);
        setMsgs(p => [...p, { f: "bot", t: response }]);
        setTimeout(() => setShowChips("group_type"), 300);
        return;
      } else if (nextStage === "budget") {
        const groupLabel = GROUP_TYPES.find(g => g.id === newInfo.groupType)?.label || "trip";
        response = `A ${groupLabel.toLowerCase()} — I'll tailor the experiences. What's your ideal daily budget per person?`;
        setThinking(false);
        setMsgs(p => [...p, { f: "bot", t: response }]);
        setTimeout(() => setShowChips("budget"), 300);
        return;
      } else if (nextStage === "interests") {
        response = getNextQuestion(nextStage, newInfo);
      } else {
        response = getNextQuestion(stage, newInfo) || "Tell me more about what you're looking for.";
      }

      setThinking(false);
      setMsgs(p => [...p, { f: "bot", t: response }]);
    }, 800 + Math.random() * 400);
  };

  const handleChipSelect = (type, value) => {
    setShowChips(null);
    if (type === "group_type") {
      const label = GROUP_TYPES.find(g => g.id === value)?.label || value;
      setMsgs(p => [...p, { f: "user", t: label }]);
      setUserInfo(p => ({ ...p, groupType: value }));
      setThinking(true);
      setTimeout(() => {
        setStage("budget");
        setThinking(false);
        setMsgs(p => [...p, { f: "bot", t: `A ${label.toLowerCase()} — I'll tailor everything. What's your daily budget per person for experiences?` }]);
        setTimeout(() => setShowChips("budget"), 300);
      }, 600);
    } else if (type === "budget") {
      const opt = BUDGET_OPTIONS.find(b => b.id === value);
      setMsgs(p => [...p, { f: "user", t: opt?.label || value }]);
      setUserInfo(p => ({ ...p, budget: value }));
      setThinking(true);
      setTimeout(() => {
        setStage("interests");
        const cityName = userInfo.cities?.[0] ? userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1) : "your destination";
        setThinking(false);
        setMsgs(p => [...p, { f: "bot", t: `Great budget range. Last thing — what kind of experiences excite you? Think: water sports, food, nightlife, adventure, art, wellness, golf…\n\nOr just say "surprise me" and I'll curate a mix.` }]);
      }, 600);
    }
  };

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: COLORS.bg }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: "#fff" }}>É</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: COLORS.text }}>Élevé</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.success }} />
          <span style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.textSec }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>
        {msgs.map((m, i) => {
          if (m.t === "__RECS__" && m.recs) {
            return (
              <div key={i} style={{ marginBottom: 12, marginLeft: 0, padding: "4px 16px", background: COLORS.surface, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
                {m.recs.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
              </div>
            );
          }
          const isBot = m.f === "bot";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", marginBottom: 12, alignItems: "flex-end", gap: 8 }}>
              <div style={{
                maxWidth: "85%", padding: "12px 16px",
                borderRadius: isBot ? "2px 18px 18px 18px" : "18px 18px 2px 18px",
                background: isBot ? COLORS.surface : COLORS.chatUser,
                color: isBot ? COLORS.text : "#fff",
                fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                border: isBot ? `1px solid ${COLORS.border}` : "none",
                boxShadow: isBot ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
              }}>{m.t}</div>
            </div>
          );
        })}

        {/* Chip selectors */}
        {showChips === "group_type" && (
          <div style={{ marginBottom: 12, animation: "fadeUp 0.3s ease" }}>
            <ChipSelect options={GROUP_TYPES} onSelect={v => handleChipSelect("group_type", v)} />
          </div>
        )}
        {showChips === "budget" && (
          <div style={{ marginBottom: 12, animation: "fadeUp 0.3s ease" }}>
            <ChipSelect options={BUDGET_OPTIONS} onSelect={v => handleChipSelect("budget", v)} />
          </div>
        )}

        {/* Thinking indicator */}
        {thinking && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
            <div style={{ padding: "14px 18px", borderRadius: "2px 18px 18px 18px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textTer, animation: `pulse 1.4s ease ${i * 0.16}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px 16px 16px", background: COLORS.surface, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Message Élevé..."
          rows={1}
          style={{
            flex: 1, padding: "10px 16px", borderRadius: 20, border: `1.5px solid ${COLORS.border}`,
            fontFamily: "var(--fb)", fontSize: 14, outline: "none", resize: "none",
            lineHeight: 1.5, maxHeight: 120, background: COLORS.bg, color: COLORS.text,
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.accent}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
        <button onClick={() => send()} disabled={!input.trim()} style={{
          width: 40, height: 40, borderRadius: "50%", border: "none",
          background: input.trim() ? COLORS.accent : COLORS.surfaceAlt,
          color: input.trim() ? "#fff" : COLORS.textTer,
          cursor: input.trim() ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
        }}>{ic.send()}</button>
      </div>
      <style>{`
        @keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

/* ═══ TAB 2: IDEAS ═══ */
function Ideas({ userInfo, onAdd, trip }) {
  const [cat, setCat] = useState("all");
  const [priceMax, setPriceMax] = useState(10000);
  const [det, setDet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const contextFiltered = userInfo.cities?.length ? getFilteredExperiences(userInfo) : EXP;
  const filtered = contextFiltered.filter(e => {
    if (cat !== "all" && e.cat !== cat) return false;
    if (e.price > priceMax) return false;
    return true;
  });

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} />;

  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "20px 20px 12px", background: COLORS.surface }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0 }}>
          {userInfo.cities?.length ? `Explore ${userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1)}` : "Explore"}
        </h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginTop: 4 }}>
          {userInfo.cities?.length ? "Curated from your conversation" : "Chat with the concierge to get personalized ideas"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto", scrollbarWidth: "none", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        {CATS.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{
          padding: "7px 14px", borderRadius: 20, whiteSpace: "nowrap",
          border: cat === c.id ? `1.5px solid ${COLORS.accent}` : `1.5px solid ${COLORS.border}`,
          background: cat === c.id ? COLORS.accentLight : COLORS.surface, color: cat === c.id ? COLORS.accent : COLORS.textSec,
          fontFamily: "var(--fb)", fontSize: 12, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
        }}><span style={{ fontSize: 14 }}>{c.i}</span>{c.l}</button>)}
      </div>

      <div style={{ padding: "12px 20px 8px" }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: COLORS.textSec,
          background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 20,
          padding: "6px 14px", cursor: "pointer",
        }}>
          {priceMax < 10000 ? `Under ${fmt(priceMax)}` : "Price filter"} {showFilters ? "▲" : "▼"}
        </button>
        {showFilters && (
          <div style={{ marginTop: 12, padding: "16px", background: COLORS.surface, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>Max price: {fmt(priceMax)}</div>
            <input type="range" min="200" max="10000" step="100" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.accent }} />
          </div>
        )}
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🔍</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, color: COLORS.textSec }}>No matches — try adjusting filters.</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec, marginBottom: 8, marginTop: 8 }}>{filtered.length} experience{filtered.length !== 1 ? "s" : ""}</div>
            {filtered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══ TAB 3: YOUR TRIP (Calendar-based itinerary) ═══ */
function TripTab({ trip, tripDays, setTripDays, onRm, userInfo, onAdd }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [det, setDet] = useState(null);
  const dest = userInfo.cities?.length ? userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1) : null;
  const numDays = userInfo.numDays || 5;
  const startDate = userInfo.dates || "Your Trip";

  // Generate day labels
  const dayLabels = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Simulate starting on a Thursday for demo
  const startDayIdx = 3; // Thu
  for (let i = 0; i < numDays; i++) {
    const dIdx = (startDayIdx + i) % 7;
    dayLabels.push({ key: `day-${i}`, label: `Day ${i + 1}`, short: dayNames[dIdx], num: i + 1 });
  }

  // Get experiences for a specific day
  const getExpForDay = (dayKey) => {
    return trip.filter(exp => tripDays[exp.id] === dayKey);
  };

  // Count unassigned
  const unassigned = trip.filter(exp => !tripDays[exp.id]);

  // Assign experience to day
  const assignToDay = (expId, dayKey) => {
    setTripDays(p => ({ ...p, [expId]: dayKey }));
  };

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} />;

  // Day detail view
  if (selectedDay !== null) {
    const day = dayLabels[selectedDay];
    const dayExps = getExpForDay(day.key);
    const totalCost = dayExps.reduce((s, e) => s + e.price, 0) * (userInfo.groupSize || 1);

    return (
      <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
        <div style={{ padding: "16px 20px", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{ic.back()}</button>
          <div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: COLORS.text }}>{day.short} — Day {day.num}</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec }}>{dayExps.length} experience{dayExps.length !== 1 ? "s" : ""}{totalCost > 0 ? ` · ${fmt(totalCost)} total` : ""}</div>
          </div>
        </div>

        {dayExps.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📅</div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>Nothing planned yet</div>
            <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, lineHeight: 1.6 }}>Add experiences from the Ideas tab or assign unplanned items to this day.</p>
          </div>
        ) : (
          <div style={{ padding: "16px 20px" }}>
            {/* Timeline view */}
            {dayExps.sort((a, b) => {
              const getH = t => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 12; let h = parseInt(m[1]); if (m[3].toUpperCase() === "PM" && h !== 12) h += 12; if (m[3].toUpperCase() === "AM" && h === 12) h = 0; return h; };
              return getH(a.time) - getH(b.time);
            }).map((exp, idx) => (
              <div key={exp.id} style={{ display: "flex", gap: 16, marginBottom: 0 }}>
                {/* Timeline line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent, marginTop: 18, flexShrink: 0 }} />
                  {idx < dayExps.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.border, minHeight: 40 }} />}
                </div>
                {/* Card */}
                <div onClick={() => setDet(exp)} style={{ flex: 1, background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 14, marginBottom: 12, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={exp.img} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>{exp.time}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>{exp.title}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec, marginTop: 2 }}>{exp.duration} · {fmt(exp.price)}/pp</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <button onClick={e => { e.stopPropagation(); onRm(exp.id); setTripDays(p => { const n = { ...p }; delete n[exp.id]; return n; }); }} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: "#e11d48" }}>Remove</button>
                    <button onClick={e => { e.stopPropagation(); setTripDays(p => { const n = { ...p }; delete n[exp.id]; return n; }); }} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textSec }}>Unassign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main trip view
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "20px 20px 0", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 20 }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0 }}>Your Trip</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginTop: 4 }}>
          {dest ? `${dest}` : "Tell the concierge where you're going"}{userInfo.dates ? ` · ${userInfo.dates}` : ""}{userInfo.numDays ? ` · ${userInfo.numDays} days` : ""}{userInfo.groupSize ? ` · ${userInfo.groupSize} guest${userInfo.groupSize > 1 ? "s" : ""}` : ""}
        </p>

        {/* Trip summary */}
        {trip.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {[
              { label: "Experiences", value: trip.length },
              { label: "Total / pp", value: fmt(trip.reduce((s, e) => s + e.price, 0)) },
              { label: "Planned", value: `${trip.filter(e => tripDays[e.id]).length}/${trip.length}` },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 0", background: COLORS.bg, borderRadius: 10 }}>
                <div style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 700, color: COLORS.text }}>{s.value}</div>
                <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.textSec, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!trip.length ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.25 }}>🗺</div>
          <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>No experiences yet</div>
          <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, lineHeight: 1.6 }}>Chat with your concierge or browse Ideas to start building your itinerary.</p>
        </div>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          {/* Day calendar grid */}
          <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Your Itinerary</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(numDays, 7)}, 1fr)`, gap: 8, marginBottom: 20 }}>
            {dayLabels.map((day, i) => {
              const count = getExpForDay(day.key).length;
              const hasItems = count > 0;
              return (
                <button key={day.key} onClick={() => setSelectedDay(i)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 4px",
                  borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                  border: `1.5px solid ${hasItems ? COLORS.accent : COLORS.border}`,
                  background: hasItems ? COLORS.accentLight : COLORS.surface,
                }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: hasItems ? COLORS.accent : COLORS.text, marginTop: 2 }}>{day.num}</span>
                  {hasItems && (
                    <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                      {Array.from({ length: Math.min(count, 4) }).map((_, j) => (
                        <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.accent }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Unassigned experiences */}
          {unassigned.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: COLORS.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Assign to a day ({unassigned.length})</div>
              {unassigned.map(exp => (
                <div key={exp.id} style={{ background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <img src={exp.img} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: COLORS.text }}>{exp.title}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.textSec }}>{exp.duration} · {exp.time} · {fmt(exp.price)}/pp</div>
                    </div>
                    <button onClick={() => onRm(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: COLORS.textTer }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                    {dayLabels.map(d => (
                      <button key={d.key} onClick={() => assignToDay(exp.id, d.key)} style={{
                        padding: "5px 12px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600,
                        cursor: "pointer", border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textSec,
                        whiteSpace: "nowrap", transition: "all 0.15s",
                      }}>{d.short}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assigned day summaries */}
          {dayLabels.map((day, i) => {
            const dayExps = getExpForDay(day.key);
            if (dayExps.length === 0) return null;
            return (
              <button key={day.key} onClick={() => setSelectedDay(i)} style={{
                width: "100%", textAlign: "left", background: COLORS.surface, borderRadius: 14,
                border: `1px solid ${COLORS.border}`, padding: 14, marginBottom: 10,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: COLORS.accentLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 9, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>{day.num}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: COLORS.text }}>Day {day.num}</div>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: COLORS.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {dayExps.map(e => e.title).join(" → ")}
                  </div>
                </div>
                <div style={{ color: COLORS.textTer, flexShrink: 0 }}>{ic.arrow()}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ TAB 4: MESSAGES ═══ */
function Msgs() {
  const cs = [
    { h: "Captain Marco Bellini", a: "MB", l: "Looking forward to hosting you! Weather looks perfect.", t: "2m ago", u: true },
    { h: "Chef Maria Santos", a: "MS", l: "I've reserved the best table on the terrace for your group.", t: "1h ago", u: true },
    { h: "Captain Diego Reyes", a: "DR", l: "The yacht is prepped and ready. See you Saturday!", t: "3h ago", u: false },
  ];
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "20px 20px 12px", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0 }}>Messages</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginTop: 4 }}>Chat with your hosts</p>
      </div>
      <div style={{ padding: "0 20px" }}>{cs.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 14, fontWeight: 700, flexShrink: 0, color: COLORS.text }}>{c.a}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: COLORS.text }}>{c.h}</span><span style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.textTer }}>{c.t}</span></div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 13, color: c.u ? COLORS.text : COLORS.textSec, fontWeight: c.u ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.l}</div>
          </div>
          {c.u && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, marginTop: 6, flexShrink: 0 }} />}
        </div>
      ))}</div>
    </div>
  );
}

/* ═══ TAB 5: PROFILE ═══ */
function Prof() {
  const mi = [{ l: "Personal Information", i: "👤" }, { l: "Payment Methods", i: "💳" }, { l: "Saved Experiences", i: "♥" }, { l: "Past Trips", i: "🗺" }, { l: "Notifications", i: "🔔" }, { l: "Privacy & Security", i: "🔒" }, { l: "Help & Support", i: "💬" }];
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.accent, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fh)", fontSize: 28, fontWeight: 700, color: "#fff" }}>S</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Serge</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: COLORS.textSec, marginTop: 4 }}>Member since 2026</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, padding: "16px 0 0" }}>
          {[["3", "Trips"], ["12", "Saved"], ["7", "Reviews"]].map(([n, l], i) => <div key={i} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: COLORS.text }}>{n}</div><div style={{ fontFamily: "var(--fb)", fontSize: 11, color: COLORS.textSec }}>{l}</div></div>)}
        </div>
      </div>
      <div style={{ padding: "8px 20px" }}>{mi.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{item.i}</span><span style={{ fontFamily: "var(--fb)", fontSize: 14, color: COLORS.text }}>{item.l}</span></div>
          <span style={{ color: COLORS.textTer, fontSize: 16 }}>›</span>
        </div>
      ))}</div>
      <div style={{ padding: "20px 20px", textAlign: "center" }}><button style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: "#e11d48", background: "none", border: "none", cursor: "pointer" }}>Log Out</button></div>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [tab, setTab] = useState("chat");
  const [trip, setTrip] = useState([]);
  const [tripDays, setTripDays] = useState({});
  const [userInfo, setUserInfo] = useState({ cities: [], interests: [], dates: null, groupSize: null, groupType: null, budget: null, numDays: null });
  const add = e => { if (!trip.some(t => t.id === e.id)) setTrip(p => [...p, e]); };
  const rm = id => { setTrip(p => p.filter(t => t.id !== id)); setTripDays(p => { const n = { ...p }; delete n[id]; return n; }); };
  const tabs = [
    { id: "chat", l: "Chat", i: ic.chat },
    { id: "ideas", l: "Ideas", i: ic.ideas },
    { id: "trip", l: "Trip", i: ic.trip },
    { id: "messages", l: "Messages", i: ic.msg },
    { id: "profile", l: "Profile", i: ic.prof },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root{--fh:'Newsreader',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif}
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#E8E4DE;-webkit-font-smoothing:antialiased}
        ::selection{background:${COLORS.accent};color:#fff}
        ::-webkit-scrollbar{width:0;height:0}
      `}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", background: COLORS.bg, position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {tab === "chat" && <AIChat userInfo={userInfo} setUserInfo={setUserInfo} trip={trip} onAdd={add} />}
          {tab === "ideas" && <Ideas userInfo={userInfo} onAdd={add} trip={trip} />}
          {tab === "trip" && <TripTab trip={trip} tripDays={tripDays} setTripDays={setTripDays} onRm={rm} userInfo={userInfo} onAdd={add} />}
          {tab === "messages" && <Msgs />}
          {tab === "profile" && <Prof />}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-around", alignItems: "center",
          height: 64, borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface,
          flexShrink: 0, paddingBottom: 4,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              background: "none", border: "none", cursor: "pointer", padding: "6px 12px",
              position: "relative", color: tab === t.id ? COLORS.accent : COLORS.textTer,
              transition: "color 0.2s",
            }}>
              {t.i(tab === t.id)}
              <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600 }}>{t.l}</span>
              {t.id === "trip" && trip.length > 0 && <div style={{ position: "absolute", top: 0, right: 2, width: 16, height: 16, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "var(--fb)" }}>{trip.length}</div>}
              {t.id === "messages" && <div style={{ position: "absolute", top: 2, right: 8, width: 7, height: 7, borderRadius: "50%", background: COLORS.accent }} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

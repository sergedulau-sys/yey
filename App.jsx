import { useState, useEffect, useRef } from "react";

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

/* ═══ ICONS ═══ */
const ic={
  chat:a=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?"#222":"none"} stroke={a?"#222":"#999"} strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  ideas:a=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?"#222":"none"} stroke={a?"#222":"#999"} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  trip:a=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?"#222":"none"} stroke={a?"#222":"#999"} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  msg:a=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?"#222":"none"} stroke={a?"#222":"#999"} strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  prof:a=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?"#222":"none"} stroke={a?"#222":"#999"} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star:()=><svg width="11" height="11" viewBox="0 0 24 24" fill="#222"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  heart:f=><svg width="18" height="18" viewBox="0 0 24 24" fill={f?"#e11d48":"rgba(0,0,0,0.4)"} stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  back:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  plus:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chk:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008a05" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  send:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

/* ═══ AI PARSING ═══ */
function parseUserMessage(text) {
  const t = text.toLowerCase();
  const info = { cities: [], interests: [], dates: null };
  const cityMap = {
    miami: "miami", "south beach": "miami", wynwood: "miami", brickell: "miami",
    tokyo: "tokyo", japan: "tokyo",
    italy: "amalfi", amalfi: "amalfi", tuscany: "amalfi", rome: "amalfi",
    bali: "bali", greece: "santorini", santorini: "santorini",
    napa: "napa", california: "napa", france: "epernay", paris: "epernay",
    scotland: "standrews", cabo: "cabo", mexico: "cabo",
    argentina: "patagonia", patagonia: "patagonia",
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

  const datePatterns = [/march\s*\d*/i, /april\s*\d*/i, /may\s*\d*/i, /june\s*\d*/i, /july\s*\d*/i, /this\s*weekend/i, /next\s*week/i, /next\s*month/i];
  datePatterns.forEach(p => { const m = t.match(p); if (m) info.dates = m[0]; });

  return info;
}

function generateResponse(info, allInfo) {
  const { cities, interests, dates } = allInfo;
  if (!cities.length && !interests.length && !dates) {
    return "I'd love to help! Could you tell me a bit more — where are you headed, when, and what kind of experiences interest you? For example: \"I'm going to Miami next month and I love food and water sports.\"";
  }
  let parts = [];
  if (cities.length && !interests.length) {
    const cityName = cities[0].charAt(0).toUpperCase() + cities[0].slice(1);
    parts.push(`${cityName} — great choice! What kind of things are you into? I can find everything from food tours to yacht charters, spa days, adventures, and more.`);
  } else if (cities.length && interests.length) {
    const cityName = cities[0].charAt(0).toUpperCase() + cities[0].slice(1);
    const matches = getFilteredExperiences(allInfo);
    if (matches.length > 0) {
      parts.push(`I found ${matches.length} experience${matches.length > 1 ? "s" : ""} in ${cityName} that match what you're looking for. Check your Ideas tab — I've filtered everything for you.`);
      if (matches.length <= 3) {
        parts.push("\n\nHere's what I recommend:");
        matches.forEach(e => parts.push(`\n• ${e.title} — ${fmt(e.price)}/person, ${e.duration}`));
      } else {
        parts.push(`\n\nTop picks:`);
        matches.slice(0, 3).forEach(e => parts.push(`\n• ${e.title} — ${fmt(e.price)}/person`));
        parts.push(`\n\n...and ${matches.length - 3} more. Tap the Ideas tab to see them all and add to your trip.`);
      }
    } else {
      parts.push(`I don't have exact matches in ${cityName} for that yet, but check the Ideas tab — I've shown you the closest options. Tell me more about what you want and I'll keep looking.`);
    }
  } else if (interests.length && !cities.length) {
    parts.push("Those sound like great interests! Where are you headed? Once I know the destination I can pull up specific experiences for you.");
  }
  if (dates && cities.length) {
    parts.push(`\n\nI've noted your dates (${dates}). You can organize everything day-by-day in the Your Trip tab.`);
  }
  return parts.join("");
}

function getFilteredExperiences(info) {
  const { cities, interests } = info;
  return EXP.map(exp => {
    let score = 0;
    if (cities.length) {
      if (cities.includes(exp.city)) score += 10;
      else if (cities.some(c => exp.region.includes(c))) score += 5;
    }
    if (interests.length) {
      interests.forEach(int => {
        exp.tags.forEach(tag => {
          if (tag.includes(int) || int.includes(tag)) score += 2;
        });
      });
    }
    return { ...exp, score };
  }).filter(e => e.score > 0).sort((a, b) => b.score - a.score);
}

/* ═══ COMPONENTS ═══ */
function CCard({ exp, onClick, onAdd, added, compact }) {
  const [hov, setHov] = useState(false);
  const [liked, setLiked] = useState(false);
  if (compact) return (
    <div onClick={onClick} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer", alignItems: "center" }}>
      <img src={exp.img} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 15, fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
        <div style={{ fontFamily: "var(--fb)", fontSize: 13, color: "#999", marginTop: 2 }}>{exp.loc} · {exp.duration}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>{ic.star()}<span style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600 }}>{exp.rating}</span><span style={{ fontFamily: "var(--fb)", fontSize: 13, color: "#999" }}>· {fmt(exp.price)}/pp</span></div>
      </div>
      {onAdd && <button onClick={e => { e.stopPropagation(); onAdd(exp); }} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: added ? "#e8f5e3" : "#222", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{added ? ic.chk() : ic.plus()}</button>}
    </div>
  );
  return null;
}

function Detail({ exp, onBack, onAdd, added }) {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ position: "relative", height: 280 }}>
        <img src={exp.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic.back()}</button>
      </div>
      <div style={{ padding: "20px 20px 120px" }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{exp.loc}</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: "#222", margin: "0 0 8px", lineHeight: 1.25 }}>{exp.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fb)", fontSize: 14, color: "#666", marginBottom: 20 }}>{ic.star()}<span style={{ fontWeight: 600, color: "#222" }}>{exp.rating}</span><span>({exp.reviews})</span><span>·</span><span>{exp.duration}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 18, borderBottom: "1px solid #f0f0f0", marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 14, fontWeight: 700 }}>{exp.ha}</div>
          <div><div style={{ fontFamily: "var(--fb)", fontSize: 15, fontWeight: 600 }}>Hosted by {exp.host}</div></div>
        </div>
        <p style={{ fontFamily: "var(--fb)", fontSize: 15, lineHeight: 1.7, color: "#484848", marginBottom: 20 }}>{exp.desc}</p>
        <h4 style={{ fontFamily: "var(--fb)", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>What's included</h4>
        {exp.inc.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fb)", fontSize: 14, color: "#484848", marginBottom: 8 }}><span style={{ fontSize: 7, color: "#222" }}>●</span>{item}</div>)}
      </div>
      <div style={{ position: "fixed", bottom: 70, left: 0, right: 0, maxWidth: 480, margin: "0 auto", padding: "14px 20px", background: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div><span style={{ fontFamily: "var(--fb)", fontSize: 20, fontWeight: 700 }}>{fmt(exp.price)}</span><span style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999" }}> /person</span></div>
        <button onClick={() => onAdd(exp)} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: added ? "#e8f5e3" : "#222", color: added ? "#008a05" : "#fff", fontFamily: "var(--fb)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>{added ? "✓ Added" : "Add to trip"}</button>
      </div>
    </div>
  );
}

/* ═══ TAB 1: AI CHAT ═══ */
function AIChat({ userInfo, setUserInfo, trip, onAdd }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [det, setDet] = useState(null);
  const end = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMsgs([{
        f: "bot",
        t: "Hey! I'm your Élevé concierge. Tell me about your trip — where are you going, when, what kind of things you like to do, and I'll find the perfect experiences for you.\n\nFor example: \"I'm heading to Miami in March. I love being on the water, great food, and maybe some adventure.\""
      }]);
    }, 400);
  }, []);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs(p => [...p, { f: "user", t: text }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const parsed = parseUserMessage(text);
      const newInfo = {
        cities: [...new Set([...(userInfo.cities || []), ...parsed.cities])],
        interests: [...new Set([...(userInfo.interests || []), ...parsed.interests])],
        dates: parsed.dates || userInfo.dates,
      };
      setUserInfo(newInfo);
      const response = generateResponse(parsed, newInfo);
      setThinking(false);
      setMsgs(p => [...p, { f: "bot", t: response }]);

      // Show inline recommendations if we have matches
      const matches = getFilteredExperiences(newInfo);
      if (matches.length > 0 && parsed.cities.length && parsed.interests.length) {
        setTimeout(() => {
          setMsgs(p => [...p, { f: "bot", t: "__RECS__", recs: matches.slice(0, 4) }]);
        }, 500);
      }
    }, 1000 + Math.random() * 500);
  };

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fh)", fontSize: 15, fontWeight: 700, color: "#fff" }}>É</div>
        <div><div style={{ fontFamily: "var(--fh)", fontSize: 17, fontWeight: 700, color: "#222" }}>Élevé Concierge</div><div style={{ fontFamily: "var(--fb)", fontSize: 11, color: "#bbb" }}>Always available</div></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {msgs.map((m, i) => {
          if (m.t === "__RECS__" && m.recs) {
            return (
              <div key={i} style={{ marginBottom: 10, marginLeft: 36 }}>
                {m.recs.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
              </div>
            );
          }
          return (
            <div key={i} style={{ display: "flex", justifyContent: m.f === "bot" ? "flex-start" : "flex-end", marginBottom: 10 }}>
              {m.f === "bot" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fh)", fontSize: 12, fontWeight: 700, color: "#fff", marginRight: 8, marginTop: 2, flexShrink: 0 }}>É</div>}
              <div style={{
                maxWidth: 320, padding: "12px 16px", borderRadius: 18,
                borderBottomLeftRadius: m.f === "bot" ? 5 : 18,
                borderBottomRightRadius: m.f === "bot" ? 18 : 5,
                background: m.f === "bot" ? "#f4f2ef" : "#222",
                color: m.f === "bot" ? "#222" : "#fff",
                fontFamily: "var(--fb)", fontSize: 15, lineHeight: 1.55,
                whiteSpace: "pre-wrap",
              }}>{m.t}</div>
            </div>
          );
        })}
        {thinking && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fh)", fontSize: 12, fontWeight: 700, color: "#fff" }}>É</div>
            <div style={{ padding: "12px 16px", borderRadius: 18, borderBottomLeftRadius: 5, background: "#f4f2ef", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#bbb", animation: `pulse 1.4s ease ${i * 0.16}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={end} />
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 16px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Tell me about your trip..."
          rows={1}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 24, border: "1.5px solid #e0e0e0",
            fontFamily: "var(--fb)", fontSize: 15, outline: "none", resize: "none",
            lineHeight: 1.4, maxHeight: 100, background: "#fafafa",
          }}
          onFocus={e => e.target.style.borderColor = "#222"}
          onBlur={e => e.target.style.borderColor = "#e0e0e0"}
        />
        <button onClick={send} disabled={!input.trim()} style={{
          width: 44, height: 44, borderRadius: "50%", border: "none",
          background: input.trim() ? "#222" : "#e8e8e8",
          color: input.trim() ? "#fff" : "#bbb",
          cursor: input.trim() ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.2s",
        }}>{ic.send()}</button>
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
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
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 12px" }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 26, fontWeight: 700, color: "#222", margin: 0 }}>
          {userInfo.cities?.length ? `Ideas for ${userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1)}` : "Explore"}
        </h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999", marginTop: 4 }}>
          {userInfo.cities?.length ? "Based on your conversation with the concierge" : "Tell the AI concierge where you're going to get personalized ideas"}
        </p>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
        {CATS.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{
          padding: "8px 16px", borderRadius: 20, whiteSpace: "nowrap",
          border: cat === c.id ? "2px solid #222" : "1.5px solid #ddd",
          background: cat === c.id ? "#222" : "#fff", color: cat === c.id ? "#fff" : "#666",
          fontFamily: "var(--fb)", fontSize: 13, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 5,
        }}><span style={{ fontSize: 15 }}>{c.i}</span>{c.l}</button>)}
      </div>

      {/* Price filter */}
      <div style={{ padding: "0 20px 16px" }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: "#666",
          background: "none", border: "1px solid #ddd", borderRadius: 20,
          padding: "6px 14px", cursor: "pointer",
        }}>
          {priceMax < 10000 ? `Under ${fmt(priceMax)}` : "Filter by price"} {showFilters ? "▲" : "▼"}
        </button>
        {showFilters && (
          <div style={{ marginTop: 12, padding: "16px", background: "#f9f8f6", borderRadius: 12 }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: "#222", marginBottom: 8 }}>Max price per person: {fmt(priceMax)}</div>
            <input type="range" min="200" max="10000" step="100" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#222" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--fb)", fontSize: 11, color: "#999", marginTop: 4 }}>
              <span>$200</span><span>$10,000</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ padding: "0 20px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔍</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 15, color: "#999" }}>No experiences match your filters. Try adjusting your criteria.</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "var(--fb)", fontSize: 13, color: "#999", marginBottom: 12 }}>{filtered.length} experience{filtered.length !== 1 ? "s" : ""}</div>
            {filtered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══ TAB 3: YOUR TRIP ═══ */
function Trip({ trip, onRm, userInfo }) {
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
  const [da, setDa] = useState({});
  const dest = userInfo.cities?.length ? userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1) : null;
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 26, fontWeight: 700, color: "#222", margin: 0 }}>Your Trip</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999", marginTop: 4 }}>
          {dest ? `${dest}${userInfo.dates ? ` · ${userInfo.dates}` : ""}` : "Tell the concierge where you're going"}
        </p>
      </div>
      {!trip.length ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🗺</div>
          <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 600, color: "#222", marginBottom: 8 }}>No activities yet</div>
          <p style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999", lineHeight: 1.6 }}>Chat with your concierge or browse Ideas to start building your itinerary.</p>
        </div>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          {trip.filter(e => !da[e.id]).length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Assign to a day</div>
              {trip.filter(e => !da[e.id]).map(exp => (
                <div key={exp.id} style={{ background: "#f9f8f6", borderRadius: 14, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <img src={exp.img} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600 }}>{exp.title}</div><div style={{ fontFamily: "var(--fb)", fontSize: 12, color: "#999" }}>{exp.duration} · {exp.time} · {fmt(exp.price)}/pp</div></div>
                    <button onClick={() => onRm(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ccc" }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>{days.map(d => <button key={d} onClick={() => setDa(p => ({ ...p, [exp.id]: d }))} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 12, fontFamily: "var(--fb)", fontWeight: 500, cursor: "pointer", border: "1px solid #ddd", background: "#fff", color: "#444" }}>{d}</button>)}</div>
                </div>
              ))}
            </div>
          )}
          {days.map(day => {
            const di = trip.filter(e => da[e.id] === day);
            if (!di.length) return null;
            return (
              <div key={day} style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: "#222", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#222" }} />{day}</div>
                {di.map(exp => (
                  <div key={exp.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "#fff", borderRadius: 12, border: "1px solid #eee", marginBottom: 8, marginLeft: 16, borderLeft: "3px solid #222" }}>
                    <img src={exp.img} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600 }}>{exp.title}</div><div style={{ fontFamily: "var(--fb)", fontSize: 12, color: "#999" }}>{exp.time} · {exp.duration}</div></div>
                    <div style={{ padding: "4px 10px", borderRadius: 12, background: "#e8f5e3", fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: "#008a05" }}>Booked</div>
                  </div>
                ))}
              </div>
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
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 12px" }}><h2 style={{ fontFamily: "var(--fh)", fontSize: 26, fontWeight: 700, color: "#222", margin: 0 }}>Messages</h2><p style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999", marginTop: 4 }}>Chat with your hosts</p></div>
      <div style={{ padding: "0 20px" }}>{cs.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer", alignItems: "flex-start" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{c.a}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontFamily: "var(--fb)", fontSize: 15, fontWeight: 600 }}>{c.h}</span><span style={{ fontFamily: "var(--fb)", fontSize: 12, color: "#bbb" }}>{c.t}</span></div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, color: c.u ? "#222" : "#999", fontWeight: c.u ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.l}</div>
          </div>
          {c.u && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#222", marginTop: 6, flexShrink: 0 }} />}
        </div>
      ))}</div>
    </div>
  );
}

/* ═══ TAB 5: PROFILE ═══ */
function Prof() {
  const mi = [{ l: "Personal Information", i: "👤" }, { l: "Payment Methods", i: "💳" }, { l: "Saved Experiences", i: "♥" }, { l: "Past Trips", i: "🗺" }, { l: "Notifications", i: "🔔" }, { l: "Privacy & Security", i: "🔒" }, { l: "Help & Support", i: "💬" }];
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#222", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fh)", fontSize: 32, fontWeight: 700, color: "#fff" }}>S</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: "#222", margin: 0 }}>Serge</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, color: "#999", marginTop: 4 }}>Member since 2026</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 32, padding: "20px 0", margin: "16px 20px", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        {[["3", "Trips"], ["12", "Saved"], ["7", "Reviews"]].map(([n, l], i) => <div key={i} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: "#222" }}>{n}</div><div style={{ fontFamily: "var(--fb)", fontSize: 12, color: "#999" }}>{l}</div></div>)}
      </div>
      <div style={{ padding: "0 20px" }}>{mi.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.i}</span><span style={{ fontFamily: "var(--fb)", fontSize: 15, color: "#222" }}>{item.l}</span></div>
          <span style={{ color: "#ccc", fontSize: 18 }}>›</span>
        </div>
      ))}</div>
      <div style={{ padding: "24px 20px", textAlign: "center" }}><button style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: "#e11d48", background: "none", border: "none", cursor: "pointer" }}>Log Out</button></div>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [tab, setTab] = useState("chat");
  const [trip, setTrip] = useState([]);
  const [userInfo, setUserInfo] = useState({ cities: [], interests: [], dates: null });
  const add = e => { if (!trip.some(t => t.id === e.id)) setTrip(p => [...p, e]); };
  const rm = id => setTrip(p => p.filter(t => t.id !== id));
  const tabs = [{ id: "chat", l: "AI Chat", i: ic.chat }, { id: "ideas", l: "Ideas", i: ic.ideas }, { id: "trip", l: "Your Trip", i: ic.trip }, { id: "messages", l: "Messages", i: ic.msg }, { id: "profile", l: "Profile", i: ic.prof }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'Figtree',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#f5f5f5;-webkit-font-smoothing:antialiased}::selection{background:#222;color:#fff}`}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", background: "#fff", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.06)" }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {tab === "chat" && <AIChat userInfo={userInfo} setUserInfo={setUserInfo} trip={trip} onAdd={add} />}
          {tab === "ideas" && <Ideas userInfo={userInfo} onAdd={add} trip={trip} />}
          {tab === "trip" && <Trip trip={trip} onRm={rm} userInfo={userInfo} />}
          {tab === "messages" && <Msgs />}
          {tab === "profile" && <Prof />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 70, borderTop: "1px solid #f0f0f0", background: "#fff", flexShrink: 0, paddingBottom: 6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", position: "relative" }}>
              {t.i(tab === t.id)}
              <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: tab === t.id ? "#222" : "#bbb" }}>{t.l}</span>
              {t.id === "trip" && trip.length > 0 && <div style={{ position: "absolute", top: 2, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#e11d48", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "var(--fb)" }}>{trip.length}</div>}
              {t.id === "messages" && <div style={{ position: "absolute", top: 2, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#e11d48" }} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

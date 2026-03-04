import { useState, useEffect, useRef, useCallback } from "react";

/* ═══ HOST AVAILABILITY DATA MODEL ═══
   In production, each experience would have an `availability` array populated by hosts.
   Hosts can sync via:
   1. Direct calendar integration (Google Calendar, iCal, Calendly API)
   2. Channel manager APIs (FareHarbor, Peek, Bookeo, Rezdy)
   3. Manual entry in the Élevé Host Dashboard
   
   For this mockup, we simulate availability windows per experience.
*/
const generateAvailability = (expId) => {
  // Simulate next 30 days of availability with time slots
  const slots = [];
  const today = new Date();
  // Each experience has 2-4 possible time slots per day
  const possibleTimes = [
    ["8:00 AM", "11:00 AM", "2:00 PM", "5:00 PM"],
    ["9:00 AM", "1:00 PM", "5:00 PM"],
    ["7:00 AM", "10:00 AM", "2:00 PM", "6:00 PM"],
    ["8:30 AM", "12:00 PM", "3:30 PM"],
    ["6:00 AM", "10:00 AM", "2:00 PM", "6:00 PM"],
  ];
  const expTimes = possibleTimes[expId % possibleTimes.length];

  for (let d = 1; d <= 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();
    if (Math.random() > 0.12) {
      const timeSlots = expTimes
        .filter(() => Math.random() > 0.2) // some slots unavailable
        .map(time => {
          const spotsTotal = Math.floor(Math.random() * 6) + 4;
          const spotsTaken = Math.floor(Math.random() * spotsTotal);
          return {
            time,
            spotsAvailable: spotsTotal - spotsTaken,
            spotsTotal,
          };
        });
      if (timeSlots.length > 0) {
        slots.push({
          date: date.toISOString().split("T")[0],
          dayOfWeek,
          timeSlots,
          priceModifier: dayOfWeek === 0 || dayOfWeek === 6 ? 1.15 : 1.0,
        });
      }
    }
  }
  return slots;
};

/* ═══ EXPERIENCE DATA ═══ */
const EXP = [
  { id:1,title:"Sunset Yacht Charter — Amalfi Coast",loc:"Amalfi, Italy",city:"amalfi",region:"italy",cat:"yacht",tags:["boating","sailing","water","romantic","luxury"],price:2800,duration:"6 hours",time:"2:00 PM",rating:4.97,reviews:43,host:"Captain Marco Bellini",ha:"MB",img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",desc:"Sail the Amalfi coastline aboard a 60-foot luxury catamaran with champagne, a private chef, and hidden grotto stops.",inc:["Private chef lunch","Premium champagne","Snorkeling gear","Photographer"],maxGuests:12},
  { id:2,title:"Private Omakase with Chef Tanaka",loc:"Tokyo, Japan",city:"tokyo",region:"japan",cat:"dining",tags:["food","sushi","japanese","cultural","dinner"],price:1200,duration:"3 hours",time:"7:00 PM",rating:5.0,reviews:28,host:"Chef Kenji Tanaka",ha:"KT",img:"https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&q=80",desc:"An intimate 18-course omakase in Chef Tanaka's private kitchen overlooking the Imperial Palace gardens.",inc:["18-course omakase","Sake pairing","Kitchen tour","Recipe booklet"],maxGuests:8},
  { id:3,title:"Helicopter Wine Tour — Napa to Sonoma",loc:"Napa Valley, California",city:"napa",region:"california",cat:"wine",tags:["wine","helicopter","adventure","food","tasting"],price:3500,duration:"8 hours",time:"9:00 AM",rating:4.95,reviews:67,host:"Sommelier Claire Duval",ha:"CD",img:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",desc:"Helicopter flight over vineyards, three exclusive estates, rare library wines, and a Michelin vineyard lunch.",inc:["Helicopter transport","3 private tastings","Michelin lunch","6 bottles shipped"],maxGuests:6},
  { id:4,title:"Deep Sea Fishing Charter",loc:"Miami, Florida",city:"miami",region:"florida",cat:"fishing",tags:["fishing","ocean","boat","adventure","outdoors","water"],price:2200,duration:"Full day",time:"6:00 AM",rating:4.92,reviews:54,host:"Captain Ray Gonzalez",ha:"RG",img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",desc:"Head offshore on a 48-foot Yellowfin for sailfish, mahi-mahi and tuna in the Gulf Stream.",inc:["All tackle & gear","Lunch & drinks","Fish cleaning","GoPro footage"],maxGuests:8},
  { id:5,title:"South Beach Food & Cocktail Tour",loc:"Miami, Florida",city:"miami",region:"florida",cat:"dining",tags:["food","cocktails","nightlife","walking","cultural","miami"],price:350,duration:"4 hours",time:"6:00 PM",rating:4.89,reviews:112,host:"Chef Maria Santos",ha:"MS",img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",desc:"Walk South Beach's best-kept culinary secrets — 6 stops from ceviche bars to rooftop cocktails with a local chef guide.",inc:["6 food stops","3 cocktails","Local guide","VIP skip-the-line"],maxGuests:12},
  { id:6,title:"Private Yacht Sunset Cruise",loc:"Miami, Florida",city:"miami",region:"florida",cat:"yacht",tags:["boating","yacht","sunset","romantic","luxury","water","miami"],price:1800,duration:"4 hours",time:"4:00 PM",rating:4.96,reviews:67,host:"Captain Diego Reyes",ha:"DR",img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",desc:"Cruise Biscayne Bay and the Miami skyline aboard a 52-foot luxury yacht. Champagne, canapes, and the best sunset in the city.",inc:["Premium champagne","Canapes","Bluetooth sound system","Photographer"],maxGuests:10},
  { id:7,title:"Everglades Airboat & Wildlife Safari",loc:"Miami, Florida",city:"miami",region:"florida",cat:"adventure",tags:["adventure","nature","wildlife","outdoors","airboat","miami"],price:450,duration:"5 hours",time:"8:00 AM",rating:4.91,reviews:89,host:"Guide Carlos Vega",ha:"CV",img:"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",desc:"Race through the Everglades on a private airboat, spot alligators and exotic birds, and learn from a 3rd-generation guide.",inc:["Private airboat","Wildlife guide","Lunch","Photography"],maxGuests:6},
  { id:8,title:"Wynwood Art & Street Culture Experience",loc:"Miami, Florida",city:"miami",region:"florida",cat:"cultural",tags:["art","culture","walking","street art","creative","miami"],price:280,duration:"3 hours",time:"10:00 AM",rating:4.94,reviews:76,host:"Artist Luna Martinez",ha:"LM",img:"https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80",desc:"Explore Wynwood's iconic murals and hidden galleries with a working street artist. Includes a hands-on spray paint session.",inc:["Gallery access","Spray paint session","Art history guide","Coffee & snacks"],maxGuests:10},
  { id:9,title:"Spa Day at Faena Miami Beach",loc:"Miami, Florida",city:"miami",region:"florida",cat:"spa",tags:["spa","wellness","relaxation","luxury","beach","miami"],price:890,duration:"Half day",time:"10:00 AM",rating:4.97,reviews:44,host:"Therapist Ana Lucia",ha:"AL",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",desc:"The ultimate Miami spa experience — hammam ritual, oceanfront massage, and lunch at the Faena pool deck.",inc:["Hammam ritual","90-min massage","Pool access","Lunch"],maxGuests:4},
  { id:10,title:"Private Golf at Doral Blue Monster",loc:"Miami, Florida",city:"miami",region:"florida",cat:"golf",tags:["golf","sport","outdoors","luxury","miami"],price:1200,duration:"5 hours",time:"7:00 AM",rating:4.93,reviews:31,host:"Pro Mike Henderson",ha:"MH",img:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80",desc:"Play the legendary Blue Monster course at Trump National Doral with a PGA teaching pro.",inc:["Green fees","Cart","Pro instruction","Lunch at clubhouse"],maxGuests:4},
  { id:11,title:"St Andrews Old Course — VIP Golf",loc:"St Andrews, Scotland",city:"standrews",region:"scotland",cat:"golf",tags:["golf","sport","cultural","luxury","whisky"],price:5500,duration:"Full day",time:"7:30 AM",rating:4.98,reviews:19,host:"Pro Alistair McLeod",ha:"AM",img:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80",desc:"Play the birthplace of golf with a former European Tour pro, caddie, and R&A whisky tasting.",inc:["Green fees","Professional caddie","Warm-up session","R&A whisky tasting"],maxGuests:4},
  { id:12,title:"Bali Cliff-Edge Spa Retreat",loc:"Uluwatu, Bali",city:"bali",region:"bali",cat:"spa",tags:["spa","wellness","relaxation","meditation","cultural"],price:980,duration:"5 hours",time:"9:00 AM",rating:4.95,reviews:61,host:"Healer Wayan Dharma",ha:"WD",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",desc:"Balinese massage, flower bath, guided meditation, raw food feast on southern cliffs.",inc:["90-min massage","Flower bath","Meditation","Raw food lunch"],maxGuests:6},
  { id:13,title:"Private Catamaran — Greek Islands",loc:"Santorini, Greece",city:"santorini",region:"greece",cat:"yacht",tags:["boating","sailing","romantic","water","sunset"],price:3200,duration:"Full day",time:"9:00 AM",rating:4.94,reviews:38,host:"Captain Nikos P.",ha:"NP",img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",desc:"Cruise the caldera — hot springs, Red Beach, sunset dinner anchored off Oia.",inc:["BBQ dinner","Open bar","Snorkeling","Towels & sunbeds"],maxGuests:12},
  { id:14,title:"Champagne Cellar Tour — Épernay",loc:"Épernay, France",city:"epernay",region:"france",cat:"wine",tags:["wine","champagne","cultural","food","tasting"],price:1600,duration:"6 hours",time:"10:00 AM",rating:4.97,reviews:41,host:"Sommelier Pierre Laurent",ha:"PL",img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",desc:"Legendary chalk cellars, vintage cuvées, private vineyard lunch.",inc:["3 cellar tours","6+ tastings","Vineyard lunch","Vintage bottle"],maxGuests:8},
  { id:15,title:"Jet Ski Tour of Biscayne Bay",loc:"Miami, Florida",city:"miami",region:"florida",cat:"adventure",tags:["water","adventure","jet ski","outdoors","fun","miami"],price:320,duration:"2 hours",time:"11:00 AM",rating:4.88,reviews:93,host:"Guide Tommy Reeves",ha:"TR",img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",desc:"Ride jet skis through Biscayne Bay, past Star Island celebrity homes, and under the MacArthur Causeway.",inc:["Jet ski rental","Safety gear","Guide","Photos"],maxGuests:8},
].map(e => ({ ...e, availability: generateAvailability(e.id) }));

const CATS=[{id:"all",l:"All",i:"◈"},{id:"yacht",l:"Boating",i:"⛵"},{id:"dining",l:"Dining",i:"🍽"},{id:"wine",l:"Wine",i:"🍷"},{id:"fishing",l:"Fishing",i:"🎣"},{id:"golf",l:"Golf",i:"⛳"},{id:"spa",l:"Spa",i:"✧"},{id:"adventure",l:"Adventure",i:"🚁"},{id:"cultural",l:"Culture",i:"🏛"}];
const fmt=n=>"$"+n.toLocaleString();

/* ═══ SYSTEM PROMPT ═══ */

/* ═══ COLORS ═══ */
const C = {
  bg: "#F9F7F4", surface: "#FFFFFF", surfaceAlt: "#F0EDE8",
  text: "#1a1a1a", textSec: "#8C8578", textTer: "#B8B0A4",
  accent: "#C6785C", accentLight: "#FDF0EB",
  border: "#EBE6DF", success: "#059669", successBg: "#ECFDF5",
};

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
  sparkle:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  cal:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};


/* ═══ CLAUDE-POWERED CHAT ENGINE ═══ */

const CONCIERGE_PROMPT = `You are the Élevé concierge — a luxury travel experience curator. You help guests plan unforgettable trips.

Your personality: warm, knowledgeable, confident but not stuffy. Think of a well-connected friend who knows the best spots everywhere. Keep responses SHORT — 1-3 sentences max. Be conversational, never use bullet points or numbered lists.

You can talk about ANYTHING — travel tips, restaurant recs, what to pack, local culture, weather, whatever. But your core mission is to naturally gather trip details and build an itinerary.

EXPERIENCE CATALOG (these are the experiences you can book):
${EXP.map(e => `ID:${e.id} "${e.title}" in ${e.loc} | ${e.cat} | $${e.price}/pp | ${e.duration} | Max ${e.maxGuests} guests | Tags: ${e.tags.join(", ")}`).join("\n")}

TO BUILD AN ITINERARY you need these 7 things (gather them naturally through conversation):
1. Destination — where they're going
2. Dates — when (e.g. "March 15")
3. Number of days
4. Group size — how many people
5. Group type — couple, boys trip, girls trip, family, solo, business
6. Total budget — total experience budget for the whole group for the whole trip
7. Interests — what they want to do (water, food, nightlife, adventure, culture, wellness, sport)

Don't interrogate them. If they tell you multiple things at once, great — acknowledge them all. If they want to chat about something else, that's fine too. Gently steer back when it feels natural.

EVERY response must end with this tag (include ALL fields you know so far, null for unknowns):
|||INFO:{"destination":null,"dates":null,"numDays":null,"groupSize":null,"groupType":null,"totalBudget":null,"interests":null}|||

When you have ALL 7 pieces, build a day-by-day itinerary. Rules:
- Match experiences to the destination
- Respect group size vs maxGuests capacity
- Stay within total budget (price × groupSize per experience)
- 2-3 experiences per day max
- Mix experience types across days

When you build the itinerary, add this tag:
|||ITINERARY:[{"day":1,"date":"2026-03-15","dayLabel":"Sat","experiences":[{"id":4,"time":"8:00 AM","note":"Start the trip right"},{"id":7,"time":"4:00 PM","note":"Wind down on the water"}]}]|||

Also add: |||RECS:[4,7,12]||| with the IDs you recommended.

IMPORTANT: Keep your visible response SHORT and conversational. The tags are hidden from the user. Start by warmly greeting them.`;

function parseAIResponse(raw) {
  let displayText = raw;
  let recIds = [], infoUpdate = null, itinerary = null, navTo = null;

  const infoM = raw.match(/\|\|\|INFO:(.*?)\|\|\|/);
  if (infoM) { try { infoUpdate = JSON.parse(infoM[1]); } catch(e){} displayText = displayText.replace(infoM[0], ""); }

  const recM = raw.match(/\|\|\|RECS:\[(.*?)\]\|\|\|/);
  if (recM) { recIds = recM[1].split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n)); displayText = displayText.replace(recM[0], ""); }

  const itinM = raw.match(/\|\|\|ITINERARY:([\s\S]*?)\|\|\|/);
  if (itinM) { try { itinerary = JSON.parse(itinM[1]); } catch(e){} displayText = displayText.replace(itinM[0], ""); navTo = "ideas"; }

  const navM = raw.match(/\|\|\|NAV:(\w+)\|\|\|/);
  if (navM) { navTo = navM[1]; displayText = displayText.replace(navM[0], ""); }

  displayText = displayText.replace(/\|\|\|[^|]*\|\|\|/g, "").trim();
  return { displayText, recIds, infoUpdate, itinerary, navTo };
}

/* ═══ TAB 1: AI CHAT ═══ */
function AIChat({ userInfo, setUserInfo, trip, onAdd, setAiRecs, setAiItinerary, setTab }) {
  const [msgs, setMsgs] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [det, setDet] = useState(null);
  const [init, setInit] = useState(false);
  const end = useRef(null);
  const taRef = useRef(null);

  // Initial greeting from Claude
  useEffect(() => {
    if (init) return; setInit(true);
    setThinking(true);
    (async () => {
      const initMsg = [{ role: "user", content: "Hi, I'd like to plan a trip." }];
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 400, system: CONCIERGE_PROMPT, messages: initMsg }),
        });
        if (!res.ok) throw new Error("API " + res.status);
        const data = await res.json();
        const raw = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
        if (!raw) throw new Error("Empty response");
        const { displayText } = parseAIResponse(raw);
        setHistory([...initMsg, { role: "assistant", content: raw }]);
        setThinking(false);
        setMsgs([{ f: "bot", t: displayText || "Welcome to Élevé! Where are you headed?" }]);
      } catch(e) {
        setHistory([...initMsg, { role: "assistant", content: "Welcome to Élevé — I'll help you plan something unforgettable. Where are you headed?" }]);
        setThinking(false);
        setMsgs([{ f: "bot", t: "Welcome to Élevé — I'll help you plan something unforgettable. Where are you headed?" }]);
      }
    })();
  }, [init]);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput(""); if (taRef.current) taRef.current.style.height = "auto";
    setMsgs(p => [...p, { f: "user", t: text }]);
    setThinking(true);

    const newHistory = [...history, { role: "user", content: text }];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: CONCIERGE_PROMPT, messages: newHistory }),
      });
      if (!res.ok) throw new Error("API " + res.status);
      const data = await res.json();
      const raw = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      if (!raw) throw new Error("Empty response");
      const { displayText, recIds, infoUpdate, itinerary, navTo } = parseAIResponse(raw);

      setHistory([...newHistory, { role: "assistant", content: raw }]);

      // Update user info from Claude's structured tags
      if (infoUpdate) {
        setUserInfo(prev => {
          const n = { ...prev };
          if (infoUpdate.destination) n.cities = [infoUpdate.destination];
          if (infoUpdate.numDays) n.numDays = infoUpdate.numDays;
          if (infoUpdate.groupSize) n.groupSize = infoUpdate.groupSize;
          if (infoUpdate.groupType) n.groupType = infoUpdate.groupType;
          if (infoUpdate.totalBudget) n.totalBudget = infoUpdate.totalBudget;
          if (infoUpdate.dates) n.dates = infoUpdate.dates;
          if (infoUpdate.interests) n.interests = infoUpdate.interests;
          return n;
        });
      }

      // Store recommendations
      if (recIds.length > 0) {
        const recs = recIds.map(id => EXP.find(e => e.id === id)).filter(Boolean);
        setAiRecs(prev => { const ex = prev.map(e => e.id); return [...prev, ...recs.filter(r => !ex.includes(r.id))]; });
        setTimeout(() => setMsgs(p => [...p, { f: "bot", t: "__RECS__", recs }]), 400);
      }

      // Store itinerary
      if (itinerary) {
        setAiItinerary(itinerary);
        const itinExps = itinerary.flatMap(d => d.experiences.map(e => e.id)).map(id => EXP.find(e => e.id === id)).filter(Boolean);
        setAiRecs(prev => { const ex = prev.map(e => e.id); return [...prev, ...itinExps.filter(r => !ex.includes(r.id))]; });
      }

      setThinking(false);
      setMsgs(p => [...p, { f: "bot", t: displayText || "I'd love to help — tell me more about what you're looking for." }]);

      // Auto-navigate
      if (navTo && setTab) setTimeout(() => setTab(navTo), 2000);

    } catch(e) {
      // Network error — let user know gracefully
      setHistory(newHistory); // keep their message in history for retry
      setThinking(false);
      setMsgs(p => [...p, { f: "bot", t: "Having a moment of trouble connecting — try sending that again." }]);
    }
  };

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} userInfo={userInfo} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: "#fff" }}>É</span>
        </div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: C.text }}>Élevé</div></div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} /><span style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec }}>Online</span></div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>
        {msgs.map((m, i) => {
          if (m.t === "__RECS__" && m.recs) return (
            <div key={i} style={{ marginBottom: 12, padding: "4px 16px", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, animation: "fadeUp 0.3s ease" }}>
              {m.recs.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
            </div>
          );
          const isBot = m.f === "bot";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", marginBottom: 12, animation: "fadeUp 0.25s ease" }}>
              <div style={{
                maxWidth: "85%", padding: "12px 16px",
                borderRadius: isBot ? "2px 18px 18px 18px" : "18px 18px 2px 18px",
                background: isBot ? C.surface : C.accent,
                color: isBot ? C.text : "#fff",
                fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
                border: isBot ? `1px solid ${C.border}` : "none",
                boxShadow: isBot ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
              }}>{m.t}</div>
            </div>
          );
        })}
        {thinking && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ padding: "14px 18px", borderRadius: "2px 18px 18px 18px", background: C.surface, border: `1px solid ${C.border}`, display: "inline-flex", gap: 5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.textTer, animation: `pulse 1.4s ease ${i*0.16}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px 16px", background: C.surface, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea ref={taRef} value={input}
          onChange={e => { setInput(e.target.value); const el = taRef.current; if(el){el.style.height="auto";el.style.height=Math.min(el.scrollHeight,120)+"px";} }}
          onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
          placeholder="Message Élevé..." rows={1}
          style={{ flex:1,padding:"10px 16px",borderRadius:20,border:`1.5px solid ${C.border}`,fontFamily:"var(--fb)",fontSize:14,outline:"none",resize:"none",lineHeight:1.5,maxHeight:120,background:C.bg,color:C.text }}
          onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
        <button onClick={send} disabled={!input.trim()||thinking} style={{
          width:40,height:40,borderRadius:"50%",border:"none",
          background:input.trim()&&!thinking?C.accent:C.surfaceAlt,
          color:input.trim()&&!thinking?"#fff":C.textTer,
          cursor:input.trim()&&!thinking?"pointer":"not-allowed",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        }}>{ic.send()}</button>
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ═══ TAB 1: AI CHAT ═══ */
function CCard({ exp, onClick, onAdd, added, compact }) {
  if (!compact) return null;
  return (
    <div onClick={onClick} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer", alignItems: "center" }}>
      <img src={exp.img} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2 }}>{exp.loc} · {exp.duration}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>{ic.star()}<span style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: C.text }}>{exp.rating}</span><span style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec }}>· {fmt(exp.price)}/pp</span></div>
      </div>
      {onAdd && <button onClick={e => { e.stopPropagation(); onAdd(exp); }} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: added ? C.successBg : C.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{added ? ic.chk() : ic.plus()}</button>}
    </div>
  );
}

function Detail({ exp, onBack, onAdd, added, userInfo }) {
  const avail = exp.availability?.slice(0, 14) || [];
  const groupFits = !userInfo.groupSize || userInfo.groupSize <= (exp.maxGuests || 99);
  const [selDate, setSelDate] = useState(null);
  const selDay = selDate !== null ? avail[selDate] : null;

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ position: "relative", height: 250 }}>
        <img src={exp.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic.back()}</button>
      </div>
      <div style={{ padding: "20px 20px 130px", background: C.surface, borderRadius: "20px 20px 0 0", marginTop: -20, position: "relative" }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>{exp.loc}</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 10px", lineHeight: 1.3 }}>{exp.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginBottom: 16 }}>{ic.star()}<span style={{ fontWeight: 600, color: C.text }}>{exp.rating}</span><span>({exp.reviews})</span><span>·</span><span>{exp.duration}</span><span>·</span><span>Up to {exp.maxGuests} guests</span></div>

        {!groupFits && <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", marginBottom: 16, fontFamily: "var(--fb)", fontSize: 13, color: "#DC2626" }}>Your group of {userInfo.groupSize} exceeds the max capacity of {exp.maxGuests}. You may need to book multiple sessions.</div>}

        {/* Availability — date row + expandable time slots */}
        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>{ic.cal()} Select a date & time</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
            {avail.map((slot, i) => {
              const d = new Date(slot.date + "T12:00:00");
              const dayN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
              const totalSpots = slot.timeSlots.reduce((s, ts) => s + ts.spotsAvailable, 0);
              const hasSpots = totalSpots > 0;
              const isSel = selDate === i;
              return (
                <button key={i} onClick={() => hasSpots && setSelDate(isSel ? null : i)} style={{ minWidth: 56, padding: "8px 6px", borderRadius: 12, textAlign: "center", cursor: hasSpots ? "pointer" : "default", border: isSel ? `2px solid ${C.accent}` : `1px solid ${hasSpots ? C.border : "#FECACA"}`, background: isSel ? C.accentLight : hasSpots ? C.surface : "#FEF2F2", opacity: hasSpots ? 1 : 0.5, transition: "all 0.15s" }}>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 9, fontWeight: 600, color: isSel ? C.accent : C.textSec, textTransform: "uppercase" }}>{dayN}</div>
                  <div style={{ fontFamily: "var(--fh)", fontSize: 17, fontWeight: 700, color: isSel ? C.accent : hasSpots ? C.text : "#DC2626", marginTop: 2 }}>{d.getDate()}</div>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 9, color: isSel ? C.accent : hasSpots ? C.success : "#DC2626", fontWeight: 600, marginTop: 2 }}>{hasSpots ? `${slot.timeSlots.length} times` : "Full"}</div>
                </button>
              );
            })}
          </div>

          {selDay && (
            <div style={{ marginTop: 12, padding: 14, background: C.bg, borderRadius: 14, border: `1px solid ${C.border}`, animation: "fadeUp 0.2s ease" }}>
              <div style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>
                {(() => { const d = new Date(selDay.date + "T12:00:00"); return d.toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" }); })()}
                {selDay.priceModifier > 1 && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 8, background: "#FEF3C7", fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: "#B45309" }}>Weekend rate</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selDay.timeSlots.map((ts, j) => {
                  const hasRoom = ts.spotsAvailable > 0;
                  const groupOk = !userInfo.groupSize || userInfo.groupSize <= ts.spotsAvailable;
                  const price = Math.round(exp.price * (selDay.priceModifier || 1));
                  return (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, border: `1px solid ${hasRoom ? C.border : "#FECACA"}`, background: C.surface, opacity: hasRoom ? 1 : 0.5 }}>
                      <div style={{ flex: "0 0 auto", minWidth: 70 }}>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 15, fontWeight: 700, color: hasRoom ? C.text : "#DC2626" }}>{ts.time}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: hasRoom ? C.success : "#DC2626", fontWeight: 600 }}>{hasRoom ? `${ts.spotsAvailable} of ${ts.spotsTotal} spots` : "Fully booked"}</div>
                        {hasRoom && !groupOk && userInfo.groupSize && <div style={{ fontFamily: "var(--fb)", fontSize: 10, color: "#B45309", marginTop: 2 }}>Need {userInfo.groupSize}, only {ts.spotsAvailable} left</div>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 700, color: C.text }}>{fmt(price)}</div>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 10, color: C.textSec }}>/person</div>
                      </div>
                      {hasRoom && <button style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: groupOk ? C.accent : C.surfaceAlt, color: groupOk ? "#fff" : C.textSec, fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, cursor: groupOk ? "pointer" : "not-allowed", flexShrink: 0 }}>{groupOk ? "Book" : "N/A"}</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 18, borderBottom: `1px solid ${C.border}`, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: C.text }}>{exp.ha}</div>
          <div><div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600 }}>Hosted by {exp.host}</div></div>
        </div>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.75, color: C.textSec, marginBottom: 20 }}>{exp.desc}</p>
        <h4 style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, marginBottom: 12, color: C.text }}>What's included</h4>
        {exp.inc.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginBottom: 8 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />{item}</div>)}
      </div>
      <div style={{ position: "fixed", bottom: 70, left: 0, right: 0, maxWidth: 480, margin: "0 auto", padding: "14px 20px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div><span style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: C.text }}>{fmt(exp.price)}</span><span style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}> /person</span></div>
        <button onClick={() => onAdd(exp)} style={{ padding: "11px 26px", borderRadius: 24, border: "none", background: added ? C.successBg : C.accent, color: added ? C.success : "#fff", fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{added ? "✓ Added" : "Add to trip"}</button>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ═══ TAB 2: IDEAS (Dual mode) ═══ */
function Ideas({ userInfo, onAdd, trip, aiRecs, aiItinerary }) {
  const [mode, setMode] = useState("all"); // "all" or "curated"
  const [cat, setCat] = useState("all");
  const [det, setDet] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const hasCurated = aiRecs.length > 0 || aiItinerary;
  const allFiltered = (cat === "all" ? EXP : EXP.filter(e => e.cat === cat));
  const curatedFiltered = cat === "all" ? aiRecs : aiRecs.filter(e => e.cat === cat);

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} userInfo={userInfo} />;

  // Curated itinerary day detail
  if (mode === "curated" && selectedDay !== null && aiItinerary) {
    const day = aiItinerary[selectedDay];
    if (!day) { setSelectedDay(null); return null; }
    const dayExps = day.experiences.map(de => ({ ...EXP.find(e => e.id === de.id), note: de.note, scheduledTime: de.time })).filter(e => e.id);
    const totalCost = dayExps.reduce((s, e) => s + e.price, 0) * (userInfo.groupSize || 1);

    return (
      <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
        <div style={{ padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{ic.back()}</button>
          <div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: C.text }}>Day {day.day} — {day.dayLabel}</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec }}>{dayExps.length} experience{dayExps.length!==1?"s":""} · {fmt(totalCost)} for group</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {dayExps.sort((a,b) => {
            const getH = t => { const m = (t||"").match(/(\d+):(\d+)\s*(AM|PM)/i); if(!m) return 12; let h=parseInt(m[1]); if(m[3].toUpperCase()==="PM"&&h!==12)h+=12; if(m[3].toUpperCase()==="AM"&&h===12)h=0; return h; };
            return getH(a.scheduledTime) - getH(b.scheduledTime);
          }).map((exp, idx) => (
            <div key={exp.id} style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, marginTop: 18, flexShrink: 0 }} />
                {idx < dayExps.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 40 }} />}
              </div>
              <div onClick={() => setDet(exp)} style={{ flex: 1, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, marginBottom: 12, cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img src={exp.img} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em" }}>{exp.scheduledTime}</div>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{exp.title}</div>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2 }}>{exp.duration} · {fmt(exp.price)}/pp</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onAdd(exp); }} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: trip.some(t=>t.id===exp.id) ? C.successBg : C.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{trip.some(t=>t.id===exp.id) ? ic.chk() : ic.plus()}</button>
                </div>
                {exp.note && <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.accent, fontStyle: "italic", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>"{exp.note}"</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", background: C.surface }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Ideas</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginTop: 4 }}>
          {userInfo.cities?.length ? `Experiences in ${userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1)}` : "Discover premium experiences worldwide"}
        </p>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, paddingBottom: 16 }}>
          <button onClick={() => setMode("all")} style={{
            flex: 1, padding: "14px 12px", borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
            border: mode === "all" ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
            background: mode === "all" ? C.accentLight : C.surface, textAlign: "left",
          }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: mode === "all" ? C.accent : C.text }}>All Experiences</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec, marginTop: 3 }}>{EXP.length} activities available</div>
          </button>
          <button onClick={() => hasCurated && setMode("curated")} style={{
            flex: 1, padding: "14px 12px", borderRadius: 14, cursor: hasCurated ? "pointer" : "default", transition: "all 0.2s",
            border: mode === "curated" ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
            background: mode === "curated" ? C.accentLight : C.surface, textAlign: "left",
            opacity: hasCurated ? 1 : 0.45,
          }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: mode === "curated" ? C.accent : C.text, display: "flex", alignItems: "center", gap: 6 }}>{ic.sparkle()} AI Curated</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec, marginTop: 3 }}>
              {hasCurated ? `${aiRecs.length} picks for you` : "Chat with concierge first"}
            </div>
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto", scrollbarWidth: "none", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        {CATS.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{
          padding: "7px 14px", borderRadius: 20, whiteSpace: "nowrap",
          border: cat === c.id ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
          background: cat === c.id ? C.accentLight : C.surface, color: cat === c.id ? C.accent : C.textSec,
          fontFamily: "var(--fb)", fontSize: 12, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 5,
        }}><span style={{ fontSize: 14 }}>{c.i}</span>{c.l}</button>)}
      </div>

      {/* Content */}
      {mode === "curated" ? (
        <div style={{ padding: "16px 20px" }}>
          {/* AI Itinerary section */}
          {aiItinerary && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: C.accent }}>{ic.sparkle()} Your AI Itinerary</div>
              </div>
              {userInfo.groupSize && (
                <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  {[
                    userInfo.groupSize && `${userInfo.groupSize} guests`,
                    userInfo.numDays && `${userInfo.numDays} days`,
                    userInfo.totalBudget && `${fmt(userInfo.totalBudget)} budget`,
                    userInfo.groupType,
                  ].filter(Boolean).map((tag, i) => (
                    <span key={i} style={{ padding: "4px 10px", borderRadius: 12, background: C.surfaceAlt, fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec }}>{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(aiItinerary.length, 4)}, 1fr)`, gap: 8 }}>
                {aiItinerary.map((day, i) => {
                  const expCount = day.experiences.length;
                  const dayCost = day.experiences.reduce((s, de) => {
                    const exp = EXP.find(e => e.id === de.id);
                    return s + (exp ? exp.price : 0);
                  }, 0) * (userInfo.groupSize || 1);
                  return (
                    <button key={i} onClick={() => setSelectedDay(i)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 6px",
                      borderRadius: 14, cursor: "pointer", border: `1.5px solid ${C.accent}`,
                      background: C.accentLight, transition: "all 0.2s",
                    }}>
                      <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: C.textSec, textTransform: "uppercase" }}>{day.dayLabel}</span>
                      <span style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: C.accent, marginTop: 2 }}>{day.day}</span>
                      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                        {Array.from({ length: Math.min(expCount, 4) }).map((_, j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />)}
                      </div>
                      <span style={{ fontFamily: "var(--fb)", fontSize: 9, color: C.textSec, marginTop: 4 }}>{fmt(dayCost)}</span>
                    </button>
                  );
                })}
              </div>
              {/* Total cost */}
              {aiItinerary && (
                <div style={{ marginTop: 12, padding: "12px 16px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Estimated total for group</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 700, color: C.text }}>{fmt(aiItinerary.reduce((s, day) => s + day.experiences.reduce((ds, de) => { const exp = EXP.find(e => e.id === de.id); return ds + (exp ? exp.price : 0); }, 0), 0) * (userInfo.groupSize || 1))}</span>
                </div>
              )}
            </div>
          )}

          {/* Individual curated picks */}
          <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {aiItinerary ? "All recommended experiences" : "Your advisor's picks"}
          </div>
          <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginBottom: 8 }}>{curatedFiltered.length} experience{curatedFiltered.length !== 1 ? "s" : ""}</div>
          {curatedFiltered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
        </div>
      ) : (
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginBottom: 8, marginTop: 8 }}>{allFiltered.length} experience{allFiltered.length !== 1 ? "s" : ""}</div>
          {allFiltered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} onAdd={onAdd} added={trip.some(t => t.id === exp.id)} />)}
        </div>
      )}
    </div>
  );
}

/* ═══ TAB 3: YOUR TRIP ═══ */
function TripTab({ trip, tripDays, setTripDays, onRm, userInfo, onAdd, aiItinerary }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [det, setDet] = useState(null);
  const dest = userInfo.cities?.length ? userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1) : null;
  const numDays = userInfo.numDays || 5;
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const startDayIdx = 3;
  const dayLabels = Array.from({ length: numDays }, (_, i) => ({ key: `day-${i}`, short: dayNames[(startDayIdx+i)%7], num: i+1 }));
  const getExpForDay = dk => trip.filter(e => tripDays[e.id] === dk);
  const unassigned = trip.filter(e => !tripDays[e.id]);

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onAdd={onAdd} added={trip.some(t => t.id === det.id)} userInfo={userInfo} />;

  if (selectedDay !== null) {
    const day = dayLabels[selectedDay];
    const dayExps = getExpForDay(day.key);
    return (
      <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
        <div style={{ padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{ic.back()}</button>
          <div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: C.text }}>{day.short} — Day {day.num}</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec }}>{dayExps.length} experience{dayExps.length!==1?"s":""}</div>
          </div>
        </div>
        {dayExps.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📅</div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 8 }}>Nothing planned</div>
            <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Assign experiences to this day from the list below.</p>
          </div>
        ) : (
          <div style={{ padding: "16px 20px" }}>
            {dayExps.sort((a,b) => {
              const getH = t => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if(!m) return 12; let h=parseInt(m[1]); if(m[3].toUpperCase()==="PM"&&h!==12)h+=12; if(m[3].toUpperCase()==="AM"&&h===12)h=0; return h; };
              return getH(a.time) - getH(b.time);
            }).map((exp, idx) => (
              <div key={exp.id} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, marginTop: 18, flexShrink: 0 }} />
                  {idx < dayExps.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 40 }} />}
                </div>
                <div onClick={() => setDet(exp)} style={{ flex: 1, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, marginBottom: 12, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={exp.img} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase" }}>{exp.time}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{exp.title}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2 }}>{exp.duration} · {fmt(exp.price)}/pp</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <button onClick={e => { e.stopPropagation(); onRm(exp.id); }} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface, color: "#e11d48" }}>Remove</button>
                    <button onClick={e => { e.stopPropagation(); setTripDays(p => { const n={...p}; delete n[exp.id]; return n; }); }} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface, color: C.textSec }}>Unassign</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ padding: "20px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Your Trip</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginTop: 4 }}>
          {dest||"Tell the concierge where you're going"}{userInfo.dates?` · ${userInfo.dates}`:""}{userInfo.numDays?` · ${userInfo.numDays}d`:""}{userInfo.groupSize?` · ${userInfo.groupSize} guests`:""}
        </p>
        {trip.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[{ l:"Experiences",v:trip.length},{l:"Total / pp",v:fmt(trip.reduce((s,e)=>s+e.price,0))},{l:"Planned",v:`${trip.filter(e=>tripDays[e.id]).length}/${trip.length}`}].map((s,i)=>(
              <div key={i} style={{ flex:1,textAlign:"center",padding:"12px 0",background:C.bg,borderRadius:10 }}>
                <div style={{ fontFamily:"var(--fh)",fontSize:18,fontWeight:700,color:C.text }}>{s.v}</div>
                <div style={{ fontFamily:"var(--fb)",fontSize:11,color:C.textSec,marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {!trip.length ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.25 }}>🗺</div>
          <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 8 }}>No experiences yet</div>
          <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Chat with your concierge or browse Ideas.</p>
        </div>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Itinerary</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(numDays,7)},1fr)`, gap: 8, marginBottom: 20 }}>
            {dayLabels.map((day,i) => {
              const count = getExpForDay(day.key).length;
              return (
                <button key={day.key} onClick={() => setSelectedDay(i)} style={{
                  display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 4px",borderRadius:12,cursor:"pointer",
                  border:`1.5px solid ${count>0?C.accent:C.border}`,background:count>0?C.accentLight:C.surface,
                }}>
                  <span style={{ fontFamily:"var(--fb)",fontSize:10,fontWeight:600,color:C.textSec,textTransform:"uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily:"var(--fh)",fontSize:20,fontWeight:700,color:count>0?C.accent:C.text,marginTop:2 }}>{day.num}</span>
                  {count>0&&<div style={{ display:"flex",gap:3,marginTop:4 }}>{Array.from({length:Math.min(count,4)}).map((_,j)=><div key={j} style={{ width:5,height:5,borderRadius:"50%",background:C.accent }} />)}</div>}
                </button>
              );
            })}
          </div>
          {unassigned.length > 0 && (
            <>
              <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Assign to a day ({unassigned.length})</div>
              {unassigned.map(exp => (
                <div key={exp.id} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <img src={exp.img} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: C.text }}>{exp.title}</div><div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec }}>{exp.duration} · {fmt(exp.price)}/pp</div></div>
                    <button onClick={() => onRm(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.textTer }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                    {dayLabels.map(d => <button key={d.key} onClick={() => setTripDays(p => ({...p,[exp.id]:d.key}))} style={{ padding:"5px 12px",borderRadius:16,fontSize:11,fontFamily:"var(--fb)",fontWeight:600,cursor:"pointer",border:`1px solid ${C.border}`,background:C.surface,color:C.textSec,whiteSpace:"nowrap" }}>{d.short}</button>)}
                  </div>
                </div>
              ))}
            </>
          )}
          {dayLabels.map((day,i) => {
            const de = getExpForDay(day.key); if (!de.length) return null;
            return (
              <button key={day.key} onClick={() => setSelectedDay(i)} style={{ width:"100%",textAlign:"left",background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,padding:14,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ width:44,height:44,borderRadius:10,background:C.accentLight,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <span style={{ fontFamily:"var(--fb)",fontSize:9,fontWeight:700,color:C.accent,textTransform:"uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily:"var(--fh)",fontSize:16,fontWeight:700,color:C.accent,lineHeight:1 }}>{day.num}</span>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:C.text }}>Day {day.num}</div>
                  <div style={{ fontFamily:"var(--fb)",fontSize:12,color:C.textSec,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{de.map(e=>e.title).join(" → ")}</div>
                </div>
                <div style={{ color:C.textTer,flexShrink:0 }}>{ic.arrow()}</div>
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
    { h:"Captain Marco Bellini",a:"MB",l:"Looking forward to hosting you! Weather looks perfect.",t:"2m ago",u:true },
    { h:"Chef Maria Santos",a:"MS",l:"I've reserved the best table on the terrace for your group.",t:"1h ago",u:true },
    { h:"Captain Diego Reyes",a:"DR",l:"The yacht is prepped and ready. See you Saturday!",t:"3h ago",u:false },
  ];
  return (
    <div style={{ height:"100%",overflowY:"auto",background:C.bg }}>
      <div style={{ padding:"20px 20px 12px",background:C.surface,borderBottom:`1px solid ${C.border}` }}>
        <h2 style={{ fontFamily:"var(--fh)",fontSize:24,fontWeight:700,color:C.text,margin:0 }}>Messages</h2>
        <p style={{ fontFamily:"var(--fb)",fontSize:13,color:C.textSec,marginTop:4 }}>Chat with your hosts</p>
      </div>
      <div style={{ padding:"0 20px" }}>{cs.map((c,i)=>(
        <div key={i} style={{ display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:"50%",background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:14,fontWeight:700,flexShrink:0,color:C.text }}>{c.a}</div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}><span style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:C.text }}>{c.h}</span><span style={{ fontFamily:"var(--fb)",fontSize:11,color:C.textTer }}>{c.t}</span></div>
            <div style={{ fontFamily:"var(--fb)",fontSize:13,color:c.u?C.text:C.textSec,fontWeight:c.u?500:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{c.l}</div>
          </div>
          {c.u&&<div style={{ width:8,height:8,borderRadius:"50%",background:C.accent,marginTop:6,flexShrink:0 }} />}
        </div>
      ))}</div>
    </div>
  );
}

/* ═══ TAB 5: PROFILE ═══ */
function Prof({ onSwitchToHost }) {
  const mi=[{l:"Personal Information",i:"👤"},{l:"Payment Methods",i:"💳"},{l:"Saved Experiences",i:"♥"},{l:"Past Trips",i:"🗺"},{l:"Notifications",i:"🔔"},{l:"Privacy & Security",i:"🔒"},{l:"Help & Support",i:"💬"}];
  return (
    <div style={{ height:"100%",overflowY:"auto",background:C.bg }}>
      <div style={{ padding:"20px",textAlign:"center",background:C.surface,borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:72,height:72,borderRadius:"50%",background:C.accent,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontSize:28,fontWeight:700,color:"#fff" }}>S</div>
        <h2 style={{ fontFamily:"var(--fh)",fontSize:22,fontWeight:700,color:C.text,margin:0 }}>Serge</h2>
        <p style={{ fontFamily:"var(--fb)",fontSize:13,color:C.textSec,marginTop:4 }}>Member since 2026</p>
        <div style={{ display:"flex",justifyContent:"center",gap:32,padding:"16px 0 0" }}>
          {[["3","Trips"],["12","Saved"],["7","Reviews"]].map(([n,l],i)=><div key={i} style={{ textAlign:"center" }}><div style={{ fontFamily:"var(--fh)",fontSize:20,fontWeight:700,color:C.text }}>{n}</div><div style={{ fontFamily:"var(--fb)",fontSize:11,color:C.textSec }}>{l}</div></div>)}
        </div>
      </div>
      <div style={{ padding:"16px 20px" }}>
        <button onClick={onSwitchToHost} style={{ width:"100%",padding:"16px 20px",borderRadius:14,cursor:"pointer",background:"linear-gradient(135deg, #1a1a1a 0%, #333 100%)",border:"none",display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ width:42,height:42,borderRadius:10,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </div>
          <div style={{ flex:1,textAlign:"left" }}>
            <div style={{ fontFamily:"var(--fb)",fontSize:15,fontWeight:600,color:"#fff" }}>Switch to Host Mode</div>
            <div style={{ fontFamily:"var(--fb)",fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:2 }}>Manage listings, bookings & calendar</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div style={{ padding:"0 20px" }}>{mi.map((item,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer" }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}><span style={{ fontSize:16,width:24,textAlign:"center" }}>{item.i}</span><span style={{ fontFamily:"var(--fb)",fontSize:14,color:C.text }}>{item.l}</span></div>
          <span style={{ color:C.textTer,fontSize:16 }}>›</span>
        </div>
      ))}</div>
      <div style={{ padding:20,textAlign:"center" }}><button style={{ fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#e11d48",background:"none",border:"none",cursor:"pointer" }}>Log Out</button></div>
    </div>
  );
}

/* ═══ HOST DASHBOARD ═══ */
const HOST_LISTINGS = [
  { id:"h1",title:"Private Yacht Sunset Cruise",loc:"Miami, Florida",price:1800,rating:4.96,reviews:67,img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80",status:"active",nextBooking:"Mar 8",bookingsThisMonth:12,revenue:21600 },
  { id:"h2",title:"Deep Sea Fishing Charter",loc:"Miami, Florida",price:2200,rating:4.92,reviews:54,img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",status:"active",nextBooking:"Mar 10",bookingsThisMonth:8,revenue:17600 },
  { id:"h3",title:"Biscayne Bay Jet Ski Tour",loc:"Miami, Florida",price:320,rating:4.88,reviews:93,img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",status:"paused",nextBooking:"—",bookingsThisMonth:0,revenue:0 },
];
const HOST_BOOKINGS = [
  { id:"b1",listing:"Private Yacht Sunset Cruise",guest:"James & Co.",guests:8,date:"Mar 8",time:"4:00 PM",total:14400,status:"confirmed",avatar:"JC" },
  { id:"b2",listing:"Deep Sea Fishing Charter",guest:"Mike Rivera",guests:4,date:"Mar 10",time:"6:00 AM",total:8800,status:"confirmed",avatar:"MR" },
  { id:"b3",listing:"Private Yacht Sunset Cruise",guest:"Sarah Kim",guests:6,date:"Mar 12",time:"4:00 PM",total:10800,status:"pending",avatar:"SK" },
  { id:"b4",listing:"Deep Sea Fishing Charter",guest:"Tom & Friends",guests:6,date:"Mar 15",time:"6:00 AM",total:13200,status:"confirmed",avatar:"TF" },
  { id:"b5",listing:"Private Yacht Sunset Cruise",guest:"Elena V.",guests:2,date:"Mar 18",time:"4:00 PM",total:3600,status:"pending",avatar:"EV" },
];
const HOST_MSGS = [
  { guest:"James & Co.",avatar:"JC",msg:"Can we bring our own champagne on the yacht?",time:"20m ago",unread:true },
  { guest:"Sarah Kim",avatar:"SK",msg:"Is there a possibility to extend by 1 hour?",time:"2h ago",unread:true },
  { guest:"Mike Rivera",avatar:"MR",msg:"Perfect, see you Saturday morning!",time:"5h ago",unread:false },
  { guest:"Tom & Friends",avatar:"TF",msg:"Any gear we should bring for deep sea?",time:"1d ago",unread:false },
];

function HostDashboard({ onBack }) {
  const [ht, setHt] = useState("reservations");
  const htabs = [
    { id:"reservations",label:"Bookings",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id:"calendar",label:"Calendar",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id:"listings",label:"Listings",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id:"messages",label:"Messages",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
  ];
  return (
    <div style={{ height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",background:"#111",boxShadow:"0 0 60px rgba(0,0,0,0.3)",overflow:"hidden" }}>
      <div style={{ padding:"14px 20px",background:"#111",borderBottom:"1px solid #222",display:"flex",alignItems:"center",gap:12 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div style={{ flex:1 }}><div style={{ fontFamily:"var(--fh)",fontSize:17,fontWeight:700,color:"#fff" }}>Host Dashboard</div></div>
        <div style={{ width:32,height:32,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:13,fontWeight:700,color:"#fff" }}>S</div>
      </div>
      <div style={{ flex:1,overflow:"hidden" }}>
        {ht==="reservations"&&<HReservations />}
        {ht==="calendar"&&<HCalendar />}
        {ht==="listings"&&<HListings />}
        {ht==="messages"&&<HMsgs />}
      </div>
      <div style={{ display:"flex",justifyContent:"space-around",alignItems:"center",height:64,borderTop:"1px solid #222",background:"#111",flexShrink:0,paddingBottom:4 }}>
        {htabs.map(t=>(
          <button key={t.id} onClick={()=>setHt(t.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 12px",color:ht===t.id?C.accent:"#555",position:"relative" }}>
            {t.icon(ht===t.id)}<span style={{ fontFamily:"var(--fb)",fontSize:10,fontWeight:600 }}>{t.label}</span>
            {t.id==="messages"&&HOST_MSGS.some(m=>m.unread)&&<div style={{ position:"absolute",top:2,right:6,width:7,height:7,borderRadius:"50%",background:C.accent }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function HReservations() {
  const confirmed=HOST_BOOKINGS.filter(b=>b.status==="confirmed");
  const pending=HOST_BOOKINGS.filter(b=>b.status==="pending");
  const rev=confirmed.reduce((s,b)=>s+b.total,0);
  return (
    <div style={{ height:"100%",overflowY:"auto",background:"#111" }}>
      <div style={{ display:"flex",gap:10,padding:"16px 20px" }}>
        {[{l:"Revenue",v:fmt(rev)},{l:"Confirmed",v:confirmed.length},{l:"Pending",v:pending.length}].map((s,i)=>(
          <div key={i} style={{ flex:1,padding:"14px 10px",background:"#1a1a1a",borderRadius:12,border:"1px solid #222",textAlign:"center" }}>
            <div style={{ fontFamily:"var(--fh)",fontSize:18,fontWeight:700,color:"#fff" }}>{s.v}</div>
            <div style={{ fontFamily:"var(--fb)",fontSize:10,color:"#666",marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {pending.length>0&&<div style={{ padding:"0 20px 12px" }}>
        <div style={{ fontFamily:"var(--fb)",fontSize:11,fontWeight:600,color:C.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>Pending approval</div>
        {pending.map(b=>(
          <div key={b.id} style={{ background:"#1a1a1a",borderRadius:14,border:"1px solid #333",padding:14,marginBottom:10 }}>
            <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:13,fontWeight:700,color:"#888" }}>{b.avatar}</div>
              <div style={{ flex:1 }}><div style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:"#fff" }}>{b.guest}</div><div style={{ fontFamily:"var(--fb)",fontSize:12,color:"#666" }}>{b.listing}</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:700,color:"#fff" }}>{fmt(b.total)}</div><div style={{ fontFamily:"var(--fb)",fontSize:11,color:"#666" }}>{b.guests} guests</div></div>
            </div>
            <div style={{ fontFamily:"var(--fb)",fontSize:12,color:"#888",marginBottom:12 }}>{b.date} at {b.time}</div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ flex:1,padding:"10px",borderRadius:10,border:"none",background:C.accent,color:"#fff",fontFamily:"var(--fb)",fontSize:13,fontWeight:600,cursor:"pointer" }}>Accept</button>
              <button style={{ flex:1,padding:"10px",borderRadius:10,border:"1px solid #333",background:"transparent",color:"#888",fontFamily:"var(--fb)",fontSize:13,fontWeight:600,cursor:"pointer" }}>Decline</button>
            </div>
          </div>
        ))}
      </div>}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ fontFamily:"var(--fb)",fontSize:11,fontWeight:600,color:"#666",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>Upcoming confirmed</div>
        {confirmed.map(b=>(
          <div key={b.id} style={{ display:"flex",gap:12,alignItems:"center",padding:"14px 0",borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ width:40,height:40,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:13,fontWeight:700,color:"#666" }}>{b.avatar}</div>
            <div style={{ flex:1 }}><div style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:"#fff" }}>{b.guest}</div><div style={{ fontFamily:"var(--fb)",fontSize:12,color:"#666" }}>{b.listing} · {b.guests} guests</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#fff" }}>{b.date}</div><div style={{ fontFamily:"var(--fb)",fontSize:11,color:"#666" }}>{b.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HCalendar() {
  const [sel, setSel] = useState(null);
  const today=new Date(); const yr=today.getFullYear(); const mo=today.getMonth();
  const dim=new Date(yr,mo+1,0).getDate(); const fd=new Date(yr,mo,1).getDay();
  const mName=today.toLocaleString("default",{month:"long",year:"numeric"});
  const booked={8:2,10:1,12:1,15:1,18:1}; const blocked=[3,4,24,25];
  const cells=[]; for(let i=0;i<fd;i++)cells.push(null); for(let d=1;d<=dim;d++)cells.push(d);
  return (
    <div style={{ height:"100%",overflowY:"auto",background:"#111" }}>
      <div style={{ padding:"20px" }}>
        <div style={{ fontFamily:"var(--fh)",fontSize:20,fontWeight:700,color:"#fff",marginBottom:16 }}>{mName}</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center",fontFamily:"var(--fb)",fontSize:10,fontWeight:600,color:"#555",padding:"4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4 }}>
          {cells.map((d,i)=>{
            if(!d) return <div key={i}/>;
            const isToday=d===today.getDate(); const bc=booked[d]||0; const bl=blocked.includes(d); const isSel=sel===d;
            return (
              <button key={i} onClick={()=>setSel(isSel?null:d)} style={{ aspectRatio:"1",borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:isSel?`2px solid ${C.accent}`:isToday?"2px solid #333":"1px solid #1a1a1a",background:bl?"#1a1a1a":isSel?"rgba(198,120,92,0.15)":"#111",opacity:bl?0.4:1 }}>
                <span style={{ fontFamily:"var(--fb)",fontSize:13,fontWeight:isToday?700:500,color:isSel?C.accent:isToday?"#fff":"#999" }}>{d}</span>
                {bc>0&&<div style={{ display:"flex",gap:2 }}>{Array.from({length:Math.min(bc,3)}).map((_,j)=><div key={j} style={{ width:4,height:4,borderRadius:"50%",background:C.accent }}/>)}</div>}
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex",gap:16,marginTop:16,paddingTop:16,borderTop:"1px solid #1a1a1a" }}>
          {[{c:C.accent,l:"Booked"},{c:"#333",l:"Blocked"}].map((l,i)=><div key={i} style={{ display:"flex",alignItems:"center",gap:6 }}><div style={{ width:8,height:8,borderRadius:"50%",background:l.c }}/><span style={{ fontFamily:"var(--fb)",fontSize:11,color:"#666" }}>{l.l}</span></div>)}
        </div>
        {sel&&booked[sel]&&(
          <div style={{ marginTop:16,padding:16,background:"#1a1a1a",borderRadius:14,border:"1px solid #222" }}>
            <div style={{ fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#fff",marginBottom:10 }}>March {sel} — {booked[sel]} booking{booked[sel]>1?"s":""}</div>
            {HOST_BOOKINGS.filter(b=>parseInt(b.date.split(" ")[1])===sel).map(b=>(
              <div key={b.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:"1px solid #222" }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:11,fontWeight:700,color:"#666" }}>{b.avatar}</div>
                <div style={{ flex:1 }}><div style={{ fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#fff" }}>{b.guest}</div><div style={{ fontFamily:"var(--fb)",fontSize:11,color:"#666" }}>{b.time} · {b.guests} guests</div></div>
                <span style={{ padding:"3px 8px",borderRadius:8,fontSize:10,fontFamily:"var(--fb)",fontWeight:600,background:b.status==="confirmed"?"rgba(5,150,105,0.15)":"rgba(198,120,92,0.15)",color:b.status==="confirmed"?"#059669":C.accent }}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
        <button style={{ width:"100%",marginTop:16,padding:"12px",borderRadius:10,border:"1px solid #333",background:"transparent",color:"#888",fontFamily:"var(--fb)",fontSize:13,fontWeight:600,cursor:"pointer" }}>Block dates</button>
      </div>
    </div>
  );
}

function HListings() {
  return (
    <div style={{ height:"100%",overflowY:"auto",background:"#111" }}>
      <div style={{ padding:"16px 20px" }}>
        {HOST_LISTINGS.map(l=>(
          <div key={l.id} style={{ background:"#1a1a1a",borderRadius:14,border:"1px solid #222",overflow:"hidden",marginBottom:14 }}>
            <div style={{ position:"relative",height:140 }}>
              <img src={l.img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              <span style={{ position:"absolute",top:10,right:10,padding:"4px 10px",borderRadius:12,fontFamily:"var(--fb)",fontSize:11,fontWeight:600,background:l.status==="active"?"rgba(5,150,105,0.9)":"rgba(120,120,120,0.9)",color:"#fff" }}>{l.status==="active"?"Active":"Paused"}</span>
            </div>
            <div style={{ padding:14 }}>
              <div style={{ fontFamily:"var(--fb)",fontSize:15,fontWeight:600,color:"#fff" }}>{l.title}</div>
              <div style={{ fontFamily:"var(--fb)",fontSize:12,color:"#666",marginTop:4 }}>{l.loc}</div>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:8 }}>{ic.star()}<span style={{ fontFamily:"var(--fb)",fontSize:12,fontWeight:600,color:"#fff" }}>{l.rating}</span><span style={{ fontFamily:"var(--fb)",fontSize:12,color:"#666" }}>({l.reviews}) · {fmt(l.price)}/pp</span></div>
              <div style={{ display:"flex",gap:12,marginTop:12,paddingTop:12,borderTop:"1px solid #222" }}>
                {[{l:"Bookings",v:l.bookingsThisMonth},{l:"Revenue",v:l.revenue>0?fmt(l.revenue):"—"},{l:"Next",v:l.nextBooking}].map((s,i)=>(
                  <div key={i} style={{ flex:1 }}><div style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:700,color:"#fff" }}>{s.v}</div><div style={{ fontFamily:"var(--fb)",fontSize:10,color:"#555" }}>{s.l}</div></div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8,marginTop:12 }}>
                <button style={{ flex:1,padding:"9px",borderRadius:8,border:"none",background:"#222",color:"#fff",fontFamily:"var(--fb)",fontSize:12,fontWeight:600,cursor:"pointer" }}>Edit</button>
                <button style={{ flex:1,padding:"9px",borderRadius:8,border:"none",background:"#222",color:l.status==="active"?"#888":C.accent,fontFamily:"var(--fb)",fontSize:12,fontWeight:600,cursor:"pointer" }}>{l.status==="active"?"Pause":"Activate"}</button>
              </div>
            </div>
          </div>
        ))}
        <button style={{ width:"100%",padding:"14px",borderRadius:12,border:"2px dashed #333",background:"transparent",color:"#666",fontFamily:"var(--fb)",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4 }}>+ Add new listing</button>
      </div>
    </div>
  );
}

function HMsgs() {
  return (
    <div style={{ height:"100%",overflowY:"auto",background:"#111" }}>
      <div style={{ padding:"0 20px" }}>
        {HOST_MSGS.map((m,i)=>(
          <div key={i} style={{ display:"flex",gap:14,padding:"16px 0",borderBottom:"1px solid #1a1a1a",cursor:"pointer" }}>
            <div style={{ width:44,height:44,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:14,fontWeight:700,color:"#666",flexShrink:0 }}>{m.avatar}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}><span style={{ fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:"#fff" }}>{m.guest}</span><span style={{ fontFamily:"var(--fb)",fontSize:11,color:"#555" }}>{m.time}</span></div>
              <div style={{ fontFamily:"var(--fb)",fontSize:13,color:m.unread?"#ccc":"#555",fontWeight:m.unread?500:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{m.msg}</div>
            </div>
            {m.unread&&<div style={{ width:8,height:8,borderRadius:"50%",background:C.accent,marginTop:6,flexShrink:0 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [mode, setMode] = useState("guest");
  const [tab, setTab] = useState("chat");
  const [trip, setTrip] = useState([]);
  const [tripDays, setTripDays] = useState({});
  const [userInfo, setUserInfo] = useState({ cities:[],interests:[],dates:null,groupSize:null,groupType:null,totalBudget:null,numDays:null,pace:null });
  const [aiRecs, setAiRecs] = useState([]);
  const [aiItinerary, setAiItinerary] = useState(null);

  const add = e => { if (!trip.some(t => t.id === e.id)) setTrip(p => [...p, e]); };
  const rm = id => { setTrip(p => p.filter(t => t.id !== id)); setTripDays(p => { const n={...p}; delete n[id]; return n; }); };

  if (mode === "host") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#000;-webkit-font-smoothing:antialiased}::selection{background:${C.accent};color:#fff}::-webkit-scrollbar{width:0;height:0}`}</style>
      <HostDashboard onBack={() => setMode("guest")} />
    </>
  );

  const tabs = [{id:"chat",l:"Chat",i:ic.chat},{id:"ideas",l:"Ideas",i:ic.ideas},{id:"trip",l:"Trip",i:ic.trip},{id:"messages",l:"Messages",i:ic.msg},{id:"profile",l:"Profile",i:ic.prof}];
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#E8E4DE;-webkit-font-smoothing:antialiased}::selection{background:${C.accent};color:#fff}::-webkit-scrollbar{width:0;height:0}`}</style>
      <div style={{ height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",background:C.bg,boxShadow:"0 0 60px rgba(0,0,0,0.08)",overflow:"hidden" }}>
        <div style={{ flex:1,overflow:"hidden" }}>
          {tab==="chat"&&<AIChat userInfo={userInfo} setUserInfo={setUserInfo} trip={trip} onAdd={add} setAiRecs={setAiRecs} setAiItinerary={setAiItinerary} setTab={setTab} />}
          {tab==="ideas"&&<Ideas userInfo={userInfo} onAdd={add} trip={trip} aiRecs={aiRecs} aiItinerary={aiItinerary} />}
          {tab==="trip"&&<TripTab trip={trip} tripDays={tripDays} setTripDays={setTripDays} onRm={rm} userInfo={userInfo} onAdd={add} aiItinerary={aiItinerary} />}
          {tab==="messages"&&<Msgs />}
          {tab==="profile"&&<Prof onSwitchToHost={()=>setMode("host")} />}
        </div>
        <div style={{ display:"flex",justifyContent:"space-around",alignItems:"center",height:64,borderTop:`1px solid ${C.border}`,background:C.surface,flexShrink:0,paddingBottom:4 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 12px",position:"relative",color:tab===t.id?C.accent:C.textTer }}>
              {t.i(tab===t.id)}<span style={{ fontFamily:"var(--fb)",fontSize:10,fontWeight:600 }}>{t.l}</span>
              {t.id==="trip"&&trip.length>0&&<div style={{ position:"absolute",top:0,right:2,width:16,height:16,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",fontFamily:"var(--fb)" }}>{trip.length}</div>}
              {t.id==="ideas"&&aiRecs.length>0&&<div style={{ position:"absolute",top:0,right:2,width:16,height:16,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",fontFamily:"var(--fb)" }}>{aiRecs.length}</div>}
              {t.id==="messages"&&<div style={{ position:"absolute",top:2,right:8,width:7,height:7,borderRadius:"50%",background:C.accent }}/>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

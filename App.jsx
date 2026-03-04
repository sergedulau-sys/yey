import { useState } from "react";

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


/* ═══ TAB 1: AI CHAT (placeholder) ═══ */
function AIChat({ userInfo, setUserInfo, trip, onAdd, onBookSlot, setAiRecs, setAiItinerary, setTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: "#fff" }}>É</span>
        </div>
        <div style={{ flex: 1 }}><div style={{ fontFamily: "var(--fh)", fontSize: 16, fontWeight: 700, color: C.text }}>Élevé</div></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", alignItems: "flex-start" }}>
        <div style={{ maxWidth: "92%", padding: "16px 18px", borderRadius: "2px 18px 18px 18px", background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.7, color: C.text }}>
            <p style={{ margin: "0 0 14px" }}>Hello Mr. Anthony Barrios, this is your conscience speaking. I want you to know that AI is so powerful that I can read your dirty little mind.</p>
            <p style={{ margin: "0 0 14px" }}>On a serious note, the chatbox requires a plug in which costs 30 bucks a month. Once you approve I'll pay it and we can create this part of the app.</p>
            <p style={{ margin: 0 }}>I've used examples for events and shit which you can add to your trip and see your itinerary for each day (also used a made up trip for that one since you can't tell the AI when you're going).</p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px 16px", background: C.surface }}>
        <div style={{ padding: "10px 16px", borderRadius: 20, border: `1.5px solid ${C.border}`, fontFamily: "var(--fb)", fontSize: 14, color: C.textTer, background: C.bg }}>AI chat coming soon...</div>
      </div>
    </div>
  );
}

/* ═══ SHARED: CCard ═══ */
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
      <div onClick={e => { e.stopPropagation(); onClick && onClick(); }} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: added ? C.successBg : C.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{added ? ic.chk() : ic.arrow()}</div>
    </div>
  );
}

/* ═══ SHARED: TRIP DATES ═══ */
const TRIP_DATES = [
  { key: "day-0", date: "2026-03-12", label: "Thu, Mar 12", short: "Thu", num: 12, dayNum: 1, full: "Thursday, March 12" },
  { key: "day-1", date: "2026-03-13", label: "Fri, Mar 13", short: "Fri", num: 13, dayNum: 2, full: "Friday, March 13" },
  { key: "day-2", date: "2026-03-14", label: "Sat, Mar 14", short: "Sat", num: 14, dayNum: 3, full: "Saturday, March 14" },
];

/* ═══ SHARED: Detail View ═══ */
function Detail({ exp, onBack, onBookSlot, trip, tripDays, userInfo }) {
  const [selDate, setSelDate] = useState(null);
  const [justBooked, setJustBooked] = useState(null);

  const getAvailForDate = (dateStr) => (exp.availability || []).find(a => a.date === dateStr);

  const getScheduleForDay = (dayKey) => {
    if (!trip || !tripDays) return [];
    return trip
      .filter(e => tripDays[e.id]?.day === dayKey && e.id !== exp.id)
      .map(e => ({ ...e, bookedTime: tripDays[e.id]?.time || e.time }))
      .sort((a, b) => {
        const toMin = t => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if(!m)return 720; let h=parseInt(m[1]); const mn=parseInt(m[2]); if(m[3].toUpperCase()==="PM"&&h!==12)h+=12; if(m[3].toUpperCase()==="AM"&&h===12)h=0; return h*60+mn; };
        return toMin(a.bookedTime) - toMin(b.bookedTime);
      });
  };

  const handleBook = (dayKey, dateStr, time) => {
    if (onBookSlot) onBookSlot(exp, dateStr, time);
    setJustBooked(`${dayKey}-${time}`);
    setTimeout(() => setJustBooked(null), 2500);
  };

  const selDay = selDate !== null ? TRIP_DATES[selDate] : null;
  const selAvail = selDay ? getAvailForDate(selDay.date) : null;
  const selSchedule = selDay ? getScheduleForDay(selDay.key) : [];
  const isAdded = trip?.some(t => t.id === exp.id);

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220 }}>
        <img src={exp.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%)" }} />
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic.back()}</button>
      </div>

      <div style={{ padding: "20px 20px 40px", background: C.surface, borderRadius: "20px 20px 0 0", marginTop: -20, position: "relative" }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>{exp.loc}</div>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 8px", lineHeight: 1.3 }}>{exp.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginBottom: 20 }}>{ic.star()}<span style={{ fontWeight: 600, color: C.text }}>{exp.rating}</span><span>({exp.reviews})</span><span>·</span><span>{exp.duration}</span><span>·</span><span>Up to {exp.maxGuests}</span></div>

        {/* ═══ STEP 1: Pick a trip date ═══ */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>When do you want to do this?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {TRIP_DATES.map((day, i) => {
              const isSel = selDate === i;
              const sched = getScheduleForDay(day.key);
              return (
                <button key={day.key} onClick={() => setSelDate(isSel ? null : i)} style={{
                  flex: 1, padding: "14px 6px", borderRadius: 14, cursor: "pointer",
                  border: isSel ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                  background: isSel ? C.accentLight : C.surface,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: isSel ? C.accent : C.textSec }}>{day.short}</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: isSel ? C.accent : C.text }}>{day.num}</span>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 9, color: isSel ? C.accent : C.textSec }}>Mar</span>
                  {sched.length > 0 && <span style={{ fontFamily: "var(--fb)", fontSize: 9, color: C.textSec, marginTop: 2 }}>{sched.length} planned</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ STEP 2: Show your day's schedule + available times ═══ */}
        {selDay && (
          <div style={{ animation: "fadeUp 0.2s ease", marginBottom: 20 }}>

            {/* Current schedule for this day */}
            <div style={{ marginBottom: 14, padding: 14, background: C.bg, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Your {selDay.label} schedule
              </div>
              {selSchedule.length === 0 ? (
                <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.success }}>Wide open — nothing booked yet!</div>
              ) : (
                selSchedule.map((e, i) => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: C.accent, minWidth: 65 }}>{e.bookedTime}</div>
                    <img src={e.img} alt="" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
                      <div style={{ fontFamily: "var(--fb)", fontSize: 10, color: C.textSec }}>{e.duration}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Available time slots for this experience on this date */}
            <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Available times</span>
              {selAvail?.priceModifier > 1 && <span style={{ padding: "3px 10px", borderRadius: 8, background: "#FEF3C7", fontSize: 10, fontWeight: 600, color: "#B45309" }}>Weekend +15%</span>}
            </div>

            {selAvail && selAvail.timeSlots?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selAvail.timeSlots.map((ts, j) => {
                  const hasRoom = ts.spotsAvailable > 0;
                  const price = Math.round(exp.price * (selAvail.priceModifier || 1));
                  const isBooked = justBooked === `${selDay.key}-${ts.time}`;
                  const conflict = selSchedule.find(e => e.bookedTime === ts.time);
                  return (
                    <div key={j} style={{
                      padding: "12px 14px", borderRadius: 14,
                      border: `1px solid ${isBooked ? C.success : conflict ? "#FCD34D" : hasRoom ? C.border : "#FECACA"}`,
                      background: isBooked ? C.successBg : C.surface,
                      opacity: hasRoom ? 1 : 0.4,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ minWidth: 68 }}>
                          <div style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 700, color: isBooked ? C.success : hasRoom ? C.text : "#DC2626" }}>{ts.time}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: hasRoom ? C.success : "#DC2626", fontWeight: 600 }}>
                            {hasRoom ? `${ts.spotsAvailable} of ${ts.spotsTotal} spots` : "Fully booked"}
                          </div>
                          <div style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: C.text, marginTop: 1 }}>{fmt(price)}<span style={{ fontWeight: 400, fontSize: 11, color: C.textSec }}> /pp</span></div>
                        </div>
                        {hasRoom && !isBooked && (
                          <button onClick={() => handleBook(selDay.key, selDay.date, ts.time)} style={{
                            padding: "9px 18px", borderRadius: 20, border: "none",
                            background: C.accent, color: "#fff",
                            fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", flexShrink: 0,
                          }}>Add</button>
                        )}
                        {isBooked && <span style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 600, color: C.success, display: "flex", alignItems: "center", gap: 4 }}>{ic.chk()} Added!</span>}
                      </div>
                      {conflict && hasRoom && <div style={{ fontFamily: "var(--fb)", fontSize: 10, color: "#B45309", marginTop: 6 }}>⚠ You have "{conflict.title}" at this time</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: "center", background: C.bg, borderRadius: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>No availability on this date</div>
              </div>
            )}
          </div>
        )}

        {/* Host + description */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: C.text }}>{exp.ha}</div>
          <div><div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600 }}>Hosted by {exp.host}</div></div>
        </div>
        <p style={{ fontFamily: "var(--fb)", fontSize: 14, lineHeight: 1.75, color: C.textSec, marginBottom: 18 }}>{exp.desc}</p>
        <h4 style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, marginBottom: 10, color: C.text }}>What's included</h4>
        {exp.inc.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginBottom: 8 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />{item}</div>)}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ═══ TAB 2: IDEAS ═══ */
function Ideas({ userInfo, onAdd, onBookSlot, trip, tripDays, aiRecs, aiItinerary }) {
  const [mode, setMode] = useState(aiItinerary ? "curated" : "all");
  const [cat, setCat] = useState("all");
  const [det, setDet] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const hasCurated = aiRecs.length > 0 || aiItinerary;
  const allFiltered = (cat === "all" ? EXP : EXP.filter(e => e.cat === cat));
  const curatedFiltered = cat === "all" ? aiRecs : aiRecs.filter(e => e.cat === cat);

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onBookSlot={onBookSlot} trip={trip} tripDays={tripDays} userInfo={userInfo} />;

  // Curated itinerary day detail
  if (mode === "curated" && selectedDay !== null && aiItinerary) {
    const day = aiItinerary[selectedDay];
    if (!day) { setSelectedDay(null); return null; }
    const dayExps = day.experiences.map(de => ({ ...EXP.find(e => e.id === de.id), note: de.note, scheduledTime: de.time })).filter(e => e.id);
    return (
      <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
        <div style={{ padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{ic.back()}</button>
          <div><div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: C.text }}>Day {day.day} — {day.dayLabel}</div></div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {dayExps.map((exp, idx) => (
            <div key={exp.id} style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, marginTop: 18, flexShrink: 0 }} />
                {idx < dayExps.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 40 }} />}
              </div>
              <div onClick={() => setDet(exp)} style={{ flex: 1, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, marginBottom: 12, cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img src={exp.img} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.accent, textTransform: "uppercase" }}>{exp.scheduledTime}</div>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{exp.title}</div>
                    <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2 }}>{exp.duration} · {fmt(exp.price)}/pp</div>
                  </div>
                </div>
                {exp.note && <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.accent, fontStyle: "italic", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>"{exp.note}"</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderCurated = () => (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {ic.sparkle()}<span style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 600, color: C.accent }}>Your AI-Curated Itinerary</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {aiItinerary.map((day, i) => {
          const count = day.experiences.length;
          const dayCost = day.experiences.reduce((s, de) => { const found = EXP.find(x => x.id === de.id); return s + (found ? found.price : 0); }, 0);
          return (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              flex: 1, padding: "14px 6px", borderRadius: 16, cursor: "pointer",
              border: `2px solid ${C.accent}`, background: C.accentLight,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: C.textSec, textTransform: "uppercase" }}>{day.dayLabel}</span>
              <span style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{day.day}</span>
              <span style={{ fontFamily: "var(--fb)", fontSize: 9, color: C.textSec }}>Mar {12 + i}</span>
              <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                {Array.from({ length: count }).map((_, j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />)}
              </div>
              <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: C.accent, marginTop: 2 }}>{fmt(dayCost)}/pp</span>
            </button>
          );
        })}
      </div>
      {aiItinerary.map((day, i) => {
        const dayExps = day.experiences.map(de => { const found = EXP.find(x => x.id === de.id); return found ? { ...found, note: de.note, scheduledTime: de.time } : null; }).filter(Boolean);
        return (
          <div key={i} style={{ marginBottom: 16 }}>
            <button onClick={() => setSelectedDay(i)} style={{ width: "100%", textAlign: "left", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.accentLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--fb)", fontSize: 9, fontWeight: 700, color: C.accent, textTransform: "uppercase" }}>{day.dayLabel}</span>
                <span style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{day.day}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text }}>Day {day.day} — {dayExps.length} experiences</div>
                <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dayExps.map(ex => ex.title).join(" → ")}</div>
              </div>
              <div style={{ color: C.textTer, flexShrink: 0 }}>{ic.arrow()}</div>
            </button>
          </div>
        );
      })}
      <div style={{ padding: "14px 16px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Estimated total / person</span>
        <span style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: C.text }}>{fmt(aiItinerary.reduce((s, day) => s + day.experiences.reduce((ds, de) => { const found = EXP.find(x => x.id === de.id); return ds + (found ? found.price : 0); }, 0), 0))}</span>
      </div>
      {(() => {
        const allIds = aiItinerary.flatMap(d => d.experiences.map(e => e.id));
        const allAdded = allIds.every(id => trip.some(t => t.id === id));
        const addAll = () => {
          aiItinerary.forEach(day => {
            day.experiences.forEach(de => {
              const found = EXP.find(x => x.id === de.id);
              if (found && !trip.some(t => t.id === found.id)) {
                onBookSlot(found, day.date, de.time);
              }
            });
          });
        };
        return (
          <button onClick={allAdded ? undefined : addAll} style={{
            width: "100%", padding: "16px 20px", borderRadius: 16, border: "none",
            background: allAdded ? C.successBg : C.accent,
            color: allAdded ? C.success : "#fff",
            fontFamily: "var(--fb)", fontSize: 16, fontWeight: 700,
            cursor: allAdded ? "default" : "pointer",
            marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: allAdded ? "none" : "0 4px 16px rgba(183,149,111,0.35)",
          }}>
            {allAdded ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{ic.chk()} Entire Itinerary Added</span>
            ) : (
              <span>Add Entire Itinerary to Trip</span>
            )}
          </button>
        );
      })()}
      <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>All recommended experiences</div>
      {curatedFiltered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} added={trip.some(t => t.id === exp.id)} />)}
    </div>
  );

  const renderAll = () => (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto", scrollbarWidth: "none", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        {CATS.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{ padding: "7px 14px", borderRadius: 20, whiteSpace: "nowrap", border: cat === c.id ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`, background: cat === c.id ? C.accentLight : C.surface, color: cat === c.id ? C.accent : C.textSec, fontFamily: "var(--fb)", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 14 }}>{c.i}</span>{c.l}</button>)}
      </div>
      <div style={{ padding: "8px 20px 20px" }}>
        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginBottom: 8, marginTop: 8 }}>{allFiltered.length} experiences</div>
        {allFiltered.map(exp => <CCard key={exp.id} exp={exp} compact onClick={() => setDet(exp)} added={trip.some(t => t.id === exp.id)} />)}
      </div>
    </div>
  );

  const contentSection = (mode === "curated" && aiItinerary) ? renderCurated() : renderAll();

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ padding: "20px 20px 0", background: C.surface }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Ideas</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginTop: 4 }}>
          {userInfo.cities?.length ? `Experiences in ${userInfo.cities[0].charAt(0).toUpperCase() + userInfo.cities[0].slice(1)}` : "Discover premium experiences worldwide"}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16, paddingBottom: 16 }}>
          <button onClick={() => setMode("all")} style={{ flex: 1, padding: "14px 12px", borderRadius: 14, cursor: "pointer", border: mode === "all" ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`, background: mode === "all" ? C.accentLight : C.surface, textAlign: "left" }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: mode === "all" ? C.accent : C.text }}>All Experiences</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec, marginTop: 3 }}>{EXP.length} activities</div>
          </button>
          <button onClick={() => hasCurated && setMode("curated")} style={{ flex: 1, padding: "14px 12px", borderRadius: 14, cursor: hasCurated ? "pointer" : "default", border: mode === "curated" ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`, background: mode === "curated" ? C.accentLight : C.surface, textAlign: "left", opacity: hasCurated ? 1 : 0.45 }}>
            <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: mode === "curated" ? C.accent : C.text, display: "flex", alignItems: "center", gap: 6 }}>{ic.sparkle()} AI Curated</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 11, color: C.textSec, marginTop: 3 }}>{hasCurated ? `${aiRecs.length} picks` : "Chat first"}</div>
          </button>
        </div>
      </div>
      {contentSection}
    </div>
  );
}

/* ═══ TAB 3: YOUR TRIP ═══ */
function TripTab({ trip, tripDays, setTripDays, onRm, userInfo, onAdd, onBookSlot, aiItinerary }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [det, setDet] = useState(null);

  const getExpForDay = (dayKey) => {
    return trip
      .filter(e => tripDays[e.id]?.day === dayKey)
      .sort((a, b) => {
        const tA = tripDays[a.id]?.time || "12:00 PM";
        const tB = tripDays[b.id]?.time || "12:00 PM";
        const toMin = t => { const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i); if(!m)return 720; let h=parseInt(m[1]); const mn=parseInt(m[2]); if(m[3].toUpperCase()==="PM"&&h!==12)h+=12; if(m[3].toUpperCase()==="AM"&&h===12)h=0; return h*60+mn; };
        return toMin(tA) - toMin(tB);
      });
  };

  const totalCost = trip.reduce((s, e) => s + e.price, 0);
  const assignedCount = trip.filter(e => tripDays[e.id]).length;

  if (det) return <Detail exp={det} onBack={() => setDet(null)} onBookSlot={onBookSlot} trip={trip} tripDays={tripDays} userInfo={userInfo} />;

  /* ─── Day detail view ─── */
  if (selectedDay !== null) {
    const day = TRIP_DATES[selectedDay];
    const dayExps = getExpForDay(day.key);
    return (
      <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
        <div style={{ padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>{ic.back()}</button>
          <div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 20, fontWeight: 700, color: C.text }}>{day.full}</div>
            <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec }}>{dayExps.length} experience{dayExps.length !== 1 ? "s" : ""} scheduled</div>
          </div>
        </div>
        {dayExps.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📅</div>
            <div style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 8 }}>Nothing scheduled yet</div>
            <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Browse Ideas and add experiences to this day.</p>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            {dayExps.map((exp, idx) => {
              const slot = tripDays[exp.id];
              return (
                <div key={exp.id} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.accent, marginTop: 20, flexShrink: 0, border: "3px solid " + C.accentLight }} />
                    {idx < dayExps.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${C.accent}40, ${C.border})`, minHeight: 50 }} />}
                  </div>
                  <div onClick={() => setDet(exp)} style={{ flex: 1, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 16, cursor: "pointer", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", gap: 14, padding: 14, alignItems: "center" }}>
                      <img src={exp.img} alt="" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase" }}>{slot?.time || exp.time}</div>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
                        <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, marginTop: 2 }}>{exp.duration} · {fmt(exp.price)}/pp</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, padding: "0 14px 12px" }}>
                      <button onClick={e => { e.stopPropagation(); setTripDays(p => { const n={...p}; delete n[exp.id]; return n; }); }} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface, color: C.textSec }}>Unschedule</button>
                      <button onClick={e => { e.stopPropagation(); onRm(exp.id); }} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 11, fontFamily: "var(--fb)", fontWeight: 600, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface, color: "#e11d48" }}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ─── Main trip overview ─── */
  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.bg }}>
      <div style={{ padding: "20px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: "var(--fh)", fontSize: 24, fontWeight: 700, color: C.text, margin: 0 }}>Your Trip</h2>
        <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec, marginTop: 4 }}>Miami · March 12–14, 2026 · 3 days</p>
        {trip.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[{ l:"Experiences",v:trip.length},{l:"Total / pp",v:fmt(totalCost)},{l:"Scheduled",v:`${assignedCount}/${trip.length}`}].map((s,i)=>(
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
          <p style={{ fontFamily: "var(--fb)", fontSize: 13, color: C.textSec }}>Browse the Ideas tab to find experiences.</p>
        </div>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontFamily: "var(--fb)", fontSize: 11, fontWeight: 600, color: C.textSec, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Your itinerary</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {TRIP_DATES.map((day, i) => {
              const dayExps = getExpForDay(day.key);
              const count = dayExps.length;
              return (
                <button key={day.key} onClick={() => setSelectedDay(i)} style={{
                  flex: 1, padding: "16px 8px", borderRadius: 16, cursor: "pointer",
                  border: `2px solid ${count > 0 ? C.accent : C.border}`,
                  background: count > 0 ? C.accentLight : C.surface,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 10, fontWeight: 600, color: C.textSec, textTransform: "uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 28, fontWeight: 700, color: count > 0 ? C.accent : C.text, lineHeight: 1 }}>{day.dayNum}</span>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 10, color: C.textSec }}>Mar {day.num}</span>
                  {count > 0 ? (
                    <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                      {Array.from({ length: Math.min(count, 4) }).map((_, j) => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />)}
                    </div>
                  ) : (
                    <span style={{ fontFamily: "var(--fb)", fontSize: 9, color: C.textTer }}>Empty</span>
                  )}
                </button>
              );
            })}
          </div>

          {TRIP_DATES.map((day, i) => {
            const dayExps = getExpForDay(day.key);
            if (!dayExps.length) return null;
            return (
              <button key={day.key} onClick={() => setSelectedDay(i)} style={{ width: "100%", textAlign: "left", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: 14, marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.accentLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--fb)", fontSize: 9, fontWeight: 700, color: C.accent, textTransform: "uppercase" }}>{day.short}</span>
                  <span style={{ fontFamily: "var(--fh)", fontSize: 18, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{day.dayNum}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 14, fontWeight: 600, color: C.text }}>Day {day.dayNum} — {dayExps.length} experience{dayExps.length !== 1 ? "s" : ""}</div>
                  <div style={{ fontFamily: "var(--fb)", fontSize: 12, color: C.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{dayExps.map(e => `${tripDays[e.id]?.time || ""} ${e.title}`.trim()).join(" → ")}</div>
                </div>
                <div style={{ color: C.textTer, flexShrink: 0 }}>{ic.arrow()}</div>
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
  // Pre-built AI curated itinerary for Miami March 12-14
  const defaultItinerary = [
    { day: 1, date: "2026-03-12", dayLabel: "Thu", experiences: [
      { id: 15, time: "9:00 AM", note: "Start the trip with some adrenaline on the water" },
      { id: 5, time: "5:00 PM", note: "Hit South Beach for food and cocktails as the sun sets" },
    ]},
    { day: 2, date: "2026-03-13", dayLabel: "Fri", experiences: [
      { id: 4, time: "6:00 AM", note: "Early morning deep sea fishing — best bite is at dawn" },
      { id: 8, time: "2:00 PM", note: "Explore Wynwood's murals and galleries after lunch" },
      { id: 6, time: "6:00 PM", note: "End the day with a private sunset yacht cruise" },
    ]},
    { day: 3, date: "2026-03-14", dayLabel: "Sat", experiences: [
      { id: 7, time: "8:00 AM", note: "Everglades adventure — see gators up close" },
      { id: 9, time: "2:00 PM", note: "Wind down the trip with a luxury spa afternoon" },
    ]},
  ];
  const defaultRecs = defaultItinerary.flatMap(d => d.experiences.map(e => e.id)).map(id => EXP.find(e => e.id === id)).filter(Boolean);
  const [aiRecs, setAiRecs] = useState(defaultRecs);
  const [aiItinerary, setAiItinerary] = useState(defaultItinerary);

  const add = e => { if (!trip.some(t => t.id === e.id)) setTrip(p => [...p, e]); };
  const rm = id => { setTrip(p => p.filter(t => t.id !== id)); setTripDays(p => { const n={...p}; delete n[id]; return n; }); };
  const bookSlot = (exp, date, time) => {
    if (!trip.some(t => t.id === exp.id)) setTrip(p => [...p, exp]);
    // Find which trip day matches this date
    const dayMap = { "2026-03-12": "day-0", "2026-03-13": "day-1", "2026-03-14": "day-2" };
    const dayKey = dayMap[date] || "day-0";
    setTripDays(p => ({ ...p, [exp.id]: { day: dayKey, time } }));
  };

  if (mode === "host") return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#000;-webkit-font-smoothing:antialiased}::selection{background:${C.accent};color:#fff}::-webkit-scrollbar{width:0;height:0}`}</style>
      <HostDashboard onBack={() => setMode("guest")} />
    </div>
  );

  const tabs = [{id:"chat",l:"Chat",i:ic.chat},{id:"ideas",l:"Ideas",i:ic.ideas},{id:"trip",l:"Trip",i:ic.trip},{id:"messages",l:"Messages",i:ic.msg},{id:"profile",l:"Profile",i:ic.prof}];
  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#E8E4DE;-webkit-font-smoothing:antialiased}::selection{background:${C.accent};color:#fff}::-webkit-scrollbar{width:0;height:0}`}</style>
      <div style={{ height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",background:C.bg,boxShadow:"0 0 60px rgba(0,0,0,0.08)",overflow:"hidden" }}>
        <div style={{ flex:1,overflow:"hidden" }}>
          {tab==="chat"&&<AIChat userInfo={userInfo} setUserInfo={setUserInfo} trip={trip} onAdd={add} onBookSlot={bookSlot} setAiRecs={setAiRecs} setAiItinerary={setAiItinerary} setTab={setTab} />}
          {tab==="ideas"&&<Ideas userInfo={userInfo} onAdd={add} onBookSlot={bookSlot} trip={trip} tripDays={tripDays} aiRecs={aiRecs} aiItinerary={aiItinerary} />}
          {tab==="trip"&&<TripTab trip={trip} tripDays={tripDays} setTripDays={setTripDays} onRm={rm} userInfo={userInfo} onAdd={add} onBookSlot={bookSlot} aiItinerary={aiItinerary} />}
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
    </div>
  );
}

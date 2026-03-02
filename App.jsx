import { useState, useEffect, useRef } from "react";

/* ─── Experience Database ─── */
const EXPERIENCES = [
  { id: 1, title: "Sunset Yacht Charter along the Amalfi Coast", location: "Amalfi, Italy", region: "europe", category: "yacht", vibe: ["romantic", "relaxation", "adventure"], price: 2800, duration: "6 hours", rating: 4.97, reviews: 43, host: "Captain Marco Bellini", hostAvatar: "MB", maxGuests: 8, img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80", description: "Sail the stunning Amalfi coastline aboard a 60-foot luxury catamaran with champagne, a private chef, and hidden grotto stops.", includes: ["Private chef lunch", "Premium champagne", "Snorkeling gear", "Professional photographer"] },
  { id: 2, title: "Private Omakase with Chef Tanaka", location: "Tokyo, Japan", region: "asia", category: "dining", vibe: ["cultural", "romantic", "foodie"], price: 1200, duration: "3 hours", rating: 5.0, reviews: 28, host: "Chef Kenji Tanaka", hostAvatar: "KT", maxGuests: 4, img: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&q=80", description: "An intimate 18-course omakase in Chef Tanaka's private kitchen overlooking the Imperial Palace gardens.", includes: ["18-course omakase", "Sake pairing", "Kitchen tour", "Signed recipe booklet"] },
  { id: 3, title: "Helicopter Wine Tour — Napa to Sonoma", location: "Napa Valley, California", region: "americas", category: "wine", vibe: ["adventure", "foodie", "celebration"], price: 3500, duration: "8 hours", rating: 4.95, reviews: 67, host: "Sommelier Claire Duval", hostAvatar: "CD", maxGuests: 6, img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80", description: "Helicopter flight over vineyards, three exclusive estates, rare library wines, and a Michelin-starred vineyard lunch.", includes: ["Helicopter transport", "3 private tastings", "Michelin lunch", "6 bottles shipped home"] },
  { id: 4, title: "Deep Sea Marlin Fishing Charter", location: "Cabo San Lucas, Mexico", region: "americas", category: "fishing", vibe: ["adventure", "thrill", "outdoors"], price: 4200, duration: "Full day", rating: 4.92, reviews: 31, host: "Captain Luis Mendoza", hostAvatar: "LM", maxGuests: 6, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", description: "Board a 52-foot Viking sportfisher and chase blue marlin and yellowfin tuna in Cabo's rich waters.", includes: ["All tackle & gear", "Gourmet lunch & drinks", "Fish processing", "GoPro footage"] },
  { id: 5, title: "St Andrews Old Course — VIP Golf Day", location: "St Andrews, Scotland", region: "europe", category: "golf", vibe: ["cultural", "outdoors", "celebration"], price: 5500, duration: "Full day", rating: 4.98, reviews: 19, host: "Pro Alistair McLeod", hostAvatar: "AM", maxGuests: 4, img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80", description: "Play the birthplace of golf with a former European Tour pro. Includes caddie, warm-up, and R&A whisky tasting.", includes: ["Green fees", "Professional caddie", "Warm-up session", "R&A whisky tasting"] },
  { id: 6, title: "Volcanic Hot Springs & Sound Healing", location: "Reykjavik, Iceland", region: "europe", category: "spa", vibe: ["relaxation", "wellness", "adventure"], price: 1800, duration: "5 hours", rating: 4.93, reviews: 52, host: "Healer Sigrid Jonsdottir", hostAvatar: "SJ", maxGuests: 6, img: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80", description: "Journey to a private geothermal lagoon for Nordic bathing rituals, breathwork, and sound healing.", includes: ["Private transport", "Bathing rituals", "Sound healing", "Herbal feast"] },
  { id: 7, title: "Helicopter Safari over Victoria Falls", location: "Livingstone, Zambia", region: "africa", category: "adventure", vibe: ["adventure", "thrill", "outdoors"], price: 6200, duration: "Full day", rating: 4.99, reviews: 14, host: "Guide James Mwanza", hostAvatar: "JM", maxGuests: 4, img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80", description: "Sunrise helicopter over Victoria Falls, riverside brunch, and a walking safari through a private conservancy.", includes: ["Helicopter flight", "Riverside brunch", "Walking safari", "Sundowner cocktails"] },
  { id: 8, title: "Truffle Hunting & Villa Dinner in Tuscany", location: "Tuscany, Italy", region: "europe", category: "dining", vibe: ["cultural", "foodie", "romantic"], price: 950, duration: "6 hours", rating: 4.96, reviews: 73, host: "Chef Isabella Rossi", hostAvatar: "IR", maxGuests: 8, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", description: "Hunt white truffles through Tuscan oak groves, then feast at a private 16th-century villa.", includes: ["Truffle hunt", "5-course dinner", "Wine pairing", "Truffles to take home"] },
  { id: 9, title: "Private Catamaran Cruise — Greek Islands", location: "Santorini, Greece", region: "europe", category: "yacht", vibe: ["romantic", "relaxation", "adventure"], price: 3200, duration: "Full day", rating: 4.94, reviews: 38, host: "Captain Nikos Papadopoulos", hostAvatar: "NP", maxGuests: 10, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", description: "Cruise the caldera with hot spring stops, Red Beach, and sunset dinner anchored off Oia.", includes: ["BBQ dinner onboard", "Open bar", "Snorkeling", "Towels & sunbeds"] },
  { id: 10, title: "Fly Fishing in Patagonia", location: "Bariloche, Argentina", region: "americas", category: "fishing", vibe: ["outdoors", "relaxation", "adventure"], price: 2100, duration: "Full day", rating: 4.91, reviews: 22, host: "Guide Mateo Silva", hostAvatar: "MS", maxGuests: 4, img: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=80", description: "Wade pristine Patagonian rivers targeting wild trout against the Andes backdrop.", includes: ["All gear provided", "Streamside lunch", "4x4 transport", "Photography"] },
  { id: 11, title: "Champagne Cellar Tour — Épernay", location: "Épernay, France", region: "europe", category: "wine", vibe: ["cultural", "foodie", "celebration"], price: 1600, duration: "6 hours", rating: 4.97, reviews: 41, host: "Sommelier Pierre Laurent", hostAvatar: "PL", maxGuests: 6, img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", description: "Descend into legendary chalk cellars, taste vintage cuvées, and enjoy a private vineyard lunch.", includes: ["3 cellar tours", "6+ tastings", "Vineyard lunch", "Vintage champagne bottle"] },
  { id: 12, title: "Bali Cliff-Edge Spa & Meditation", location: "Uluwatu, Bali", region: "asia", category: "spa", vibe: ["relaxation", "wellness", "cultural"], price: 980, duration: "5 hours", rating: 4.95, reviews: 61, host: "Healer Wayan Dharma", hostAvatar: "WD", maxGuests: 6, img: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80", description: "A transformative retreat — Balinese massage, flower bath, meditation, and raw food feast on southern cliffs.", includes: ["90-min massage", "Flower bath", "Meditation session", "Raw food lunch"] },
];

const fmt = (n) => "$" + n.toLocaleString();

/* ─── Icons ─── */
const StarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="#222"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const BackIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>;
const HeartIcon = ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#e11d48" : "none"} stroke={filled ? "#e11d48" : "#fff"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;

/* ─── Onboarding Questions ─── */
const QUESTIONS = [
  {
    id: "vibe",
    text: "What kind of experience are you in the mood for?",
    subtitle: "Pick as many as you'd like",
    multi: true,
    options: [
      { value: "adventure", label: "Adventure & Thrills", emoji: "🪂" },
      { value: "relaxation", label: "Relaxation & Wellness", emoji: "🧘" },
      { value: "foodie", label: "Food & Drink", emoji: "🍷" },
      { value: "cultural", label: "Culture & History", emoji: "🏛" },
      { value: "romantic", label: "Romance", emoji: "💫" },
      { value: "celebration", label: "Celebration", emoji: "🥂" },
    ],
  },
  {
    id: "region",
    text: "Any particular part of the world?",
    subtitle: "Or we can surprise you",
    multi: true,
    options: [
      { value: "europe", label: "Europe", emoji: "🇪🇺" },
      { value: "asia", label: "Asia & Pacific", emoji: "🌏" },
      { value: "americas", label: "Americas", emoji: "🌎" },
      { value: "africa", label: "Africa", emoji: "🌍" },
      { value: "anywhere", label: "Surprise me", emoji: "✨" },
    ],
  },
  {
    id: "budget",
    text: "What's your budget per person?",
    subtitle: "This helps us find the right fit",
    multi: false,
    options: [
      { value: "low", label: "Under $1,500", emoji: "💰" },
      { value: "mid", label: "$1,500 – $3,500", emoji: "💎" },
      { value: "high", label: "$3,500+", emoji: "👑" },
      { value: "any", label: "No budget in mind", emoji: "∞" },
    ],
  },
  {
    id: "group",
    text: "Who's joining you?",
    subtitle: "Helps us pick the right group size",
    multi: false,
    options: [
      { value: "solo", label: "Just me", emoji: "🙋" },
      { value: "couple", label: "My partner", emoji: "💑" },
      { value: "friends", label: "Friends", emoji: "👯" },
      { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
    ],
  },
];

/* ─── Matching Logic ─── */
function getRecommendations(answers) {
  let scored = EXPERIENCES.map(exp => {
    let score = 0;
    // Vibe match
    const vibes = answers.vibe || [];
    vibes.forEach(v => { if (exp.vibe.includes(v)) score += 3; });
    // Region match
    const regions = answers.region || [];
    if (!regions.includes("anywhere") && regions.length > 0) {
      if (regions.includes(exp.region)) score += 2;
      else score -= 1;
    }
    // Budget match
    const budget = answers.budget;
    if (budget === "low" && exp.price <= 1500) score += 2;
    else if (budget === "mid" && exp.price > 1500 && exp.price <= 3500) score += 2;
    else if (budget === "high" && exp.price > 3500) score += 2;
    // Rating boost
    score += exp.rating - 4.9;
    return { ...exp, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6);
}

/* ─── Chat Bubble ─── */
function Bubble({ from, children, animate }) {
  const isBot = from === "bot";
  return (
    <div style={{
      display: "flex", justifyContent: isBot ? "flex-start" : "flex-end",
      marginBottom: 12,
      animation: animate ? "fadeSlideUp 0.4s ease forwards" : "none",
      opacity: animate ? 0 : 1,
    }}>
      {isBot && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: "#222",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: "#fff",
          marginRight: 10, flexShrink: 0, marginTop: 2,
        }}>É</div>
      )}
      <div style={{
        maxWidth: 420, padding: "14px 18px", borderRadius: 20,
        borderBottomLeftRadius: isBot ? 6 : 20,
        borderBottomRightRadius: isBot ? 20 : 6,
        background: isBot ? "#f4f2ef" : "#222",
        color: isBot ? "#222" : "#fff",
        fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Option Chip ─── */
function Chip({ option, selected, onClick, multi }) {
  const active = selected;
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 18px", borderRadius: 28,
      border: active ? "2px solid #222" : "1.5px solid #ddd",
      background: active ? "#222" : "#fff",
      color: active ? "#fff" : "#444",
      fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
      cursor: "pointer", transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 18 }}>{option.emoji}</span>
      {option.label}
    </button>
  );
}

/* ─── Experience Card (Results) ─── */
function ResultCard({ exp, onClick, delay }) {
  const [hov, setHov] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor: "pointer",
        animation: `fadeSlideUp 0.5s ease ${delay}s forwards`,
        opacity: 0,
      }}
    >
      <div style={{
        position: "relative", width: "100%", aspectRatio: "3/4",
        borderRadius: 16, overflow: "hidden", marginBottom: 12,
      }}>
        <img src={exp.img} alt={exp.title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transition: "transform 0.5s ease",
          transform: hov ? "scale(1.05)" : "scale(1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 30%, rgba(0,0,0,0.4) 100%)" }} />
        <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} style={{
          position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.25)",
          border: "none", cursor: "pointer", padding: 6, borderRadius: "50%",
          backdropFilter: "blur(4px)", display: "flex",
        }}><HeartIcon filled={liked} /></button>
        <div style={{
          position: "absolute", bottom: 16, left: 16, right: 16,
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
          }}>{exp.location}</div>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600,
            color: "#fff", lineHeight: 1.25,
          }}>{exp.title}</div>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-body)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
          <StarIcon />
          <span style={{ fontWeight: 600 }}>{exp.rating}</span>
          <span style={{ color: "#999" }}>({exp.reviews})</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>From {fmt(exp.price)}<span style={{ fontWeight: 400, color: "#999", fontSize: 13 }}> / person</span></span>
      </div>
    </div>
  );
}

/* ─── Detail Page ─── */
function DetailPage({ exp, onBack }) {
  const [date, setDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const dates = ["Mar 15", "Mar 18", "Mar 22", "Mar 25", "Apr 1"];

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid #eee",
        position: "sticky", top: 0, background: "#fff", zIndex: 50,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#222",
        }}><BackIcon /> Back to results</button>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 32px 60px" }}>
        <div style={{ width: "100%", height: 400, borderRadius: 18, overflow: "hidden", marginBottom: 32 }}>
          <img src={exp.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{exp.location}</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 700, color: "#222", margin: "0 0 10px", lineHeight: 1.2 }}>{exp.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontSize: 15, marginBottom: 24 }}>
              <StarIcon /><span style={{ fontWeight: 600 }}>{exp.rating}</span>
              <span style={{ color: "#999" }}>({exp.reviews} reviews)</span>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ color: "#666" }}>{exp.duration}</span>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ color: "#666" }}>Up to {exp.maxGuests} guests</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 24, borderBottom: "1px solid #eee", marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: "#f0ede8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700,
              }}>{exp.hostAvatar}</div>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600 }}>Hosted by {exp.host}</div>
              </div>
            </div>
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>What you'll do</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "#484848", margin: "0 0 28px" }}>{exp.description}</p>
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 600, margin: "0 0 14px" }}>What's included</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {exp.includes.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-body)", fontSize: 15, color: "#484848" }}>
                  <span style={{ fontSize: 8, color: "#222" }}>●</span> {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{
              border: "1px solid #ddd", borderRadius: 14, padding: 24,
              boxShadow: "0 6px 24px rgba(0,0,0,0.07)", position: "sticky", top: 80,
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 24, fontWeight: 700, marginBottom: 2 }}>From {fmt(exp.price)}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#999", marginBottom: 24 }}>per person</div>
              <div style={{ border: "1px solid #ccc", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #ccc" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Date</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {dates.map(d => (
                      <button key={d} onClick={() => setDate(d)} style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 13,
                        fontFamily: "var(--font-body)", cursor: "pointer",
                        border: date === d ? "2px solid #222" : "1px solid #ddd",
                        background: date === d ? "#f7f7f7" : "#fff", color: "#222",
                      }}>{d}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Guests</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#999", marginTop: 2 }}>{guests} guest{guests > 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{guests}</span>
                    <button onClick={() => setGuests(Math.min(exp.maxGuests, guests + 1))} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              </div>
              <button style={{
                width: "100%", padding: "15px 0", borderRadius: 12, border: "none",
                background: date ? "#222" : "#ccc", color: "#fff",
                fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700,
                cursor: date ? "pointer" : "not-allowed",
              }}>Reserve</button>
              <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: 13, color: "#bbb", marginTop: 10 }}>You won't be charged yet</p>
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #eee", fontFamily: "var(--font-body)", fontSize: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                  <span>{fmt(exp.price)} × {guests}</span><span>{fmt(exp.price * guests)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                  <span>Service fee</span><span>{fmt(Math.round(exp.price * guests * 0.08))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#222", paddingTop: 14, borderTop: "1px solid #eee" }}>
                  <span>Total</span><span>{fmt(Math.round(exp.price * guests * 1.08))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [phase, setPhase] = useState("chat"); // chat | results | detail
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selections, setSelections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [results, setResults] = useState([]);
  const [detailExp, setDetailExp] = useState(null);
  const [thinking, setThinking] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      setMessages([{ from: "bot", text: "Welcome to Élevé. I'm your personal concierge — let me help you discover something extraordinary." }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", text: QUESTIONS[0].text, subtitle: QUESTIONS[0].subtitle }]);
        setShowOptions(true);
      }, 800);
    }, 500);
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions]);

  const currentQ = QUESTIONS[qIndex];

  const toggleSelection = (value) => {
    if (currentQ.multi) {
      setSelections(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else {
      setSelections([value]);
    }
  };

  const submitAnswer = () => {
    if (selections.length === 0) return;
    const labels = selections.map(v => currentQ.options.find(o => o.value === v)?.label).join(", ");
    const newAnswers = { ...answers, [currentQ.id]: selections.length === 1 ? selections[0] : selections };

    setMessages(prev => [...prev, { from: "user", text: labels }]);
    setShowOptions(false);
    setAnswers(newAnswers);
    setSelections([]);

    if (qIndex < QUESTIONS.length - 1) {
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        const nextQ = QUESTIONS[qIndex + 1];
        // Add a contextual response before next question
        const responses = [
          "Great taste. Now let me narrow things down...",
          "Love it. That helps a lot.",
          "Perfect, I'm getting a clear picture.",
        ];
        setMessages(prev => [...prev, { from: "bot", text: responses[qIndex] || "Got it." }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "bot", text: nextQ.text, subtitle: nextQ.subtitle }]);
          setQIndex(qIndex + 1);
          setShowOptions(true);
        }, 600);
      }, 1000);
    } else {
      // Final — generate results
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        const recs = getRecommendations(newAnswers);
        setResults(recs);
        setMessages(prev => [...prev, {
          from: "bot",
          text: `I've curated ${recs.length} experiences just for you. Let me show you what I found.`,
        }]);
        setTimeout(() => setPhase("results"), 1200);
      }, 1500);
    }
  };

  const startOver = () => {
    setPhase("chat");
    setQIndex(0);
    setAnswers({});
    setSelections([]);
    setShowOptions(false);
    setResults([]);
    setMessages([]);
    setTimeout(() => {
      setMessages([{ from: "bot", text: "Welcome back! Let's find your next extraordinary experience." }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { from: "bot", text: QUESTIONS[0].text, subtitle: QUESTIONS[0].subtitle }]);
        setShowOptions(true);
      }, 800);
    }, 300);
  };

  /* ─── DETAIL VIEW ─── */
  if (phase === "detail" && detailExp) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`:root{--font-heading:'Newsreader',Georgia,serif;--font-body:'Figtree',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#fff;-webkit-font-smoothing:antialiased}::selection{background:#222;color:#fff}@keyframes fadeSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <DetailPage exp={detailExp} onBack={() => { setDetailExp(null); setPhase("results"); }} />
      </>
    );
  }

  /* ─── RESULTS VIEW ─── */
  if (phase === "results") {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`:root{--font-heading:'Newsreader',Georgia,serif;--font-body:'Figtree',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#faf9f7;-webkit-font-smoothing:antialiased}::selection{background:#222;color:#fff}@keyframes fadeSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ minHeight: "100vh" }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "20px 40px", background: "#fff", borderBottom: "1px solid #eee",
            position: "sticky", top: 0, zIndex: 50,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#222",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "#fff",
              }}>É</div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "#222" }}>Élevé</span>
            </div>
            <button onClick={startOver} style={{
              padding: "9px 20px", borderRadius: 8, border: "1px solid #ddd",
              background: "#fff", fontFamily: "var(--font-body)", fontSize: 13,
              fontWeight: 600, cursor: "pointer", color: "#222",
            }}>Start Over</button>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 60px" }}>
            <div style={{
              animation: "fadeSlideUp 0.5s ease forwards", opacity: 0,
              marginBottom: 36,
            }}>
              <h1 style={{
                fontFamily: "var(--font-heading)", fontSize: 36, fontWeight: 700,
                color: "#222", margin: "0 0 8px", lineHeight: 1.2,
              }}>Curated for you</h1>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 16, color: "#888",
              }}>Based on your preferences — {results.length} experiences handpicked by your concierge</p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 28,
            }}>
              {results.map((exp, i) => (
                <ResultCard key={exp.id} exp={exp} delay={0.1 + i * 0.1} onClick={() => { setDetailExp(exp); setPhase("detail"); }} />
              ))}
            </div>

            {/* Browse all CTA */}
            <div style={{
              textAlign: "center", marginTop: 48, padding: "36px 0",
              borderTop: "1px solid #eee",
              animation: "fadeSlideUp 0.5s ease 0.8s forwards", opacity: 0,
            }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#999", marginBottom: 14 }}>
                Not seeing what you're looking for?
              </p>
              <button onClick={startOver} style={{
                padding: "13px 32px", borderRadius: 10, border: "none",
                background: "#222", color: "#fff",
                fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600,
                cursor: "pointer",
              }}>Tell me more about what you want</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── CHAT VIEW (Default) ─── */
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root { --font-heading: 'Newsreader', Georgia, serif; --font-body: 'Figtree', -apple-system, sans-serif; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; -webkit-font-smoothing: antialiased; }
        ::selection { background: #222; color: #fff; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px 32px", borderBottom: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#222",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#fff",
            }}>É</div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "#222" }}>Élevé Concierge</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#aaa" }}>Your personal luxury experience guide</div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "28px 32px",
          maxWidth: 600, margin: "0 auto", width: "100%",
        }}>
          {/* Progress */}
          <div style={{
            display: "flex", gap: 6, justifyContent: "center", marginBottom: 28,
          }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: i <= qIndex ? 40 : 24, height: 4, borderRadius: 2,
                background: i < qIndex ? "#222" : i === qIndex ? "#222" : "#e8e8e8",
                transition: "all 0.4s ease",
              }} />
            ))}
          </div>

          {messages.map((msg, i) => (
            <Bubble key={i} from={msg.from} animate={i === messages.length - 1}>
              {msg.text}
              {msg.subtitle && (
                <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{msg.subtitle}</div>
              )}
            </Bubble>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#222",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: "#fff",
              }}>É</div>
              <div style={{
                padding: "14px 18px", borderRadius: 20, borderBottomLeftRadius: 6,
                background: "#f4f2ef", display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#aaa",
                    animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEnd} />
        </div>

        {/* Options Area */}
        {showOptions && currentQ && (
          <div style={{
            borderTop: "1px solid #f0f0f0", padding: "20px 32px 28px",
            maxWidth: 600, margin: "0 auto", width: "100%",
            animation: "fadeSlideUp 0.3s ease forwards",
          }}>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16,
              justifyContent: "center",
            }}>
              {currentQ.options.map(opt => (
                <Chip
                  key={opt.value}
                  option={opt}
                  selected={selections.includes(opt.value)}
                  onClick={() => toggleSelection(opt.value)}
                  multi={currentQ.multi}
                />
              ))}
            </div>
            <button
              onClick={submitAnswer}
              disabled={selections.length === 0}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                background: selections.length > 0 ? "#222" : "#e8e8e8",
                color: selections.length > 0 ? "#fff" : "#bbb",
                fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600,
                cursor: selections.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              Continue <span style={{ fontSize: 18, marginTop: -1 }}>→</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

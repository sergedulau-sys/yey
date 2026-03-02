import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: "◈" },
  { id: "yacht", label: "Yacht & Boating", icon: "⛵" },
  { id: "dining", label: "Fine Dining", icon: "🍽" },
  { id: "wine", label: "Wine & Spirits", icon: "🍷" },
  { id: "fishing", label: "Fishing", icon: "🎣" },
  { id: "golf", label: "Golf", icon: "⛳" },
  { id: "spa", label: "Spa & Wellness", icon: "✧" },
  { id: "adventure", label: "Adventure", icon: "🚁" },
];

const EXP = [
  { id:1,title:"Sunset Yacht Charter — Amalfi Coast",location:"Amalfi, Italy",region:"europe",category:"yacht",vibe:["romantic","relaxation","adventure"],price:2800,duration:"6 hours",time:"2:00 PM",rating:4.97,reviews:43,host:"Captain Marco Bellini",ha:"MB",maxGuests:8,img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&q=80",desc:"Sail the Amalfi coastline aboard a 60-foot luxury catamaran with champagne, a private chef, and hidden grotto stops.",inc:["Private chef lunch","Premium champagne","Snorkeling gear","Photographer"]},
  { id:2,title:"Private Omakase with Chef Tanaka",location:"Tokyo, Japan",region:"asia",category:"dining",vibe:["cultural","romantic","foodie"],price:1200,duration:"3 hours",time:"7:00 PM",rating:5.0,reviews:28,host:"Chef Kenji Tanaka",ha:"KT",maxGuests:4,img:"https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&q=80",desc:"An intimate 18-course omakase in Chef Tanaka's private kitchen overlooking the Imperial Palace gardens.",inc:["18-course omakase","Sake pairing","Kitchen tour","Recipe booklet"]},
  { id:3,title:"Helicopter Wine Tour — Napa to Sonoma",location:"Napa Valley, California",region:"americas",category:"wine",vibe:["adventure","foodie","celebration"],price:3500,duration:"8 hours",time:"9:00 AM",rating:4.95,reviews:67,host:"Sommelier Claire Duval",ha:"CD",maxGuests:6,img:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",desc:"Helicopter flight over vineyards, three exclusive estates, rare library wines, and a Michelin vineyard lunch.",inc:["Helicopter transport","3 private tastings","Michelin lunch","6 bottles shipped"]},
  { id:4,title:"Deep Sea Marlin Fishing Charter",location:"Cabo San Lucas, Mexico",region:"americas",category:"fishing",vibe:["adventure","thrill","outdoors"],price:4200,duration:"Full day",time:"6:00 AM",rating:4.92,reviews:31,host:"Captain Luis Mendoza",ha:"LM",maxGuests:6,img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",desc:"Board a 52-foot Viking sportfisher and chase blue marlin and yellowfin tuna in Cabo's waters.",inc:["All tackle & gear","Gourmet lunch","Fish processing","GoPro footage"]},
  { id:5,title:"St Andrews Old Course — VIP Golf",location:"St Andrews, Scotland",region:"europe",category:"golf",vibe:["cultural","outdoors","celebration"],price:5500,duration:"Full day",time:"7:30 AM",rating:4.98,reviews:19,host:"Pro Alistair McLeod",ha:"AM",maxGuests:4,img:"https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80",desc:"Play the birthplace of golf with a former European Tour pro, caddie, and R&A whisky tasting.",inc:["Green fees","Professional caddie","Warm-up session","R&A whisky tasting"]},
  { id:6,title:"Volcanic Hot Springs & Sound Healing",location:"Reykjavik, Iceland",region:"europe",category:"spa",vibe:["relaxation","wellness","adventure"],price:1800,duration:"5 hours",time:"10:00 AM",rating:4.93,reviews:52,host:"Healer Sigrid Jonsdottir",ha:"SJ",maxGuests:6,img:"https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80",desc:"Private geothermal lagoon — Nordic bathing rituals, breathwork, and sound healing ceremony.",inc:["Private transport","Bathing rituals","Sound healing","Herbal feast"]},
  { id:7,title:"Helicopter Safari — Victoria Falls",location:"Livingstone, Zambia",region:"africa",category:"adventure",vibe:["adventure","thrill","outdoors"],price:6200,duration:"Full day",time:"5:30 AM",rating:4.99,reviews:14,host:"Guide James Mwanza",ha:"JM",maxGuests:4,img:"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",desc:"Sunrise helicopter over Victoria Falls, riverside brunch, walking safari through private conservancy.",inc:["Helicopter flight","Riverside brunch","Walking safari","Sundowners"]},
  { id:8,title:"Truffle Hunting & Villa Dinner",location:"Tuscany, Italy",region:"europe",category:"dining",vibe:["cultural","foodie","romantic"],price:950,duration:"6 hours",time:"10:00 AM",rating:4.96,reviews:73,host:"Chef Isabella Rossi",ha:"IR",maxGuests:8,img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",desc:"Hunt white truffles through Tuscan groves, then five-course dinner at a 16th-century villa.",inc:["Truffle hunt","5-course dinner","Wine pairing","Truffles to take home"]},
  { id:9,title:"Private Catamaran — Greek Islands",location:"Santorini, Greece",region:"europe",category:"yacht",vibe:["romantic","relaxation","adventure"],price:3200,duration:"Full day",time:"9:00 AM",rating:4.94,reviews:38,host:"Captain Nikos P.",ha:"NP",maxGuests:10,img:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",desc:"Cruise the caldera — hot springs, Red Beach, sunset dinner anchored off Oia.",inc:["BBQ dinner","Open bar","Snorkeling","Towels & sunbeds"]},
  { id:10,title:"Fly Fishing in Patagonia",location:"Bariloche, Argentina",region:"americas",category:"fishing",vibe:["outdoors","relaxation","adventure"],price:2100,duration:"Full day",time:"7:00 AM",rating:4.91,reviews:22,host:"Guide Mateo Silva",ha:"MS",maxGuests:4,img:"https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=80",desc:"Wade pristine Patagonian rivers targeting wild trout against the Andes.",inc:["All gear","Streamside lunch","4x4 transport","Photography"]},
  { id:11,title:"Champagne Cellar Tour — Épernay",location:"Épernay, France",region:"europe",category:"wine",vibe:["cultural","foodie","celebration"],price:1600,duration:"6 hours",time:"10:00 AM",rating:4.97,reviews:41,host:"Sommelier Pierre Laurent",ha:"PL",maxGuests:6,img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",desc:"Legendary chalk cellars, vintage cuvées, private vineyard lunch.",inc:["3 cellar tours","6+ tastings","Vineyard lunch","Vintage bottle"]},
  { id:12,title:"Bali Cliff-Edge Spa Retreat",location:"Uluwatu, Bali",region:"asia",category:"spa",vibe:["relaxation","wellness","cultural"],price:980,duration:"5 hours",time:"9:00 AM",rating:4.95,reviews:61,host:"Healer Wayan Dharma",ha:"WD",maxGuests:6,img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",desc:"Balinese massage, flower bath, guided meditation, raw food feast on southern cliffs.",inc:["90-min massage","Flower bath","Meditation","Raw food lunch"]},
];

const fmt=n=>"$"+n.toLocaleString();
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
};

const QS=[
  {id:"destination",text:"Where are you headed?",sub:"Tell me about your trip",multi:false,opts:[{v:"italy",l:"Italy",e:"🇮🇹"},{v:"japan",l:"Japan",e:"🇯🇵"},{v:"california",l:"California",e:"🌴"},{v:"greece",l:"Greece",e:"🇬🇷"},{v:"bali",l:"Bali",e:"🌺"},{v:"anywhere",l:"Surprise me",e:"✨"}]},
  {id:"dates",text:"When are you going?",sub:"Approximate is fine",multi:false,opts:[{v:"mar",l:"March 2026",e:"📅"},{v:"apr",l:"April 2026",e:"📅"},{v:"may",l:"May 2026",e:"📅"},{v:"jun",l:"Summer 2026",e:"☀️"},{v:"flex",l:"I'm flexible",e:"🤷"}]},
  {id:"vibe",text:"What are you in the mood for?",sub:"Pick as many as you like",multi:true,opts:[{v:"adventure",l:"Adventure",e:"🪂"},{v:"relaxation",l:"Relaxation",e:"🧘"},{v:"foodie",l:"Food & Drink",e:"🍷"},{v:"cultural",l:"Culture",e:"🏛"},{v:"romantic",l:"Romance",e:"💫"},{v:"celebration",l:"Celebration",e:"🥂"}]},
  {id:"budget",text:"Budget per person?",sub:"Helps me find the right fit",multi:false,opts:[{v:"low",l:"Under $1,500",e:"💰"},{v:"mid",l:"$1,500–$3,500",e:"💎"},{v:"high",l:"$3,500+",e:"👑"},{v:"any",l:"No limit",e:"∞"}]},
];
const DM={italy:"europe",japan:"asia",california:"americas",greece:"europe",bali:"asia",anywhere:null};
const DL={mar:"March 15–20, 2026",apr:"April 10–15, 2026",may:"May 5–10, 2026",jun:"June 20–25, 2026",flex:"March 22–27, 2026"};

function getRecs(a){
  const dr=DM[a.destination];const vs=Array.isArray(a.vibe)?a.vibe:[a.vibe];
  return EXP.map(e=>{let s=0;vs.forEach(v=>{if(e.vibe.includes(v))s+=3});if(dr&&e.region===dr)s+=4;if(!dr)s+=1;const b=a.budget;if(b==="low"&&e.price<=1500)s+=2;else if(b==="mid"&&e.price>1500&&e.price<=3500)s+=2;else if(b==="high"&&e.price>3500)s+=2;else if(b==="any")s+=1;s+=(e.rating-4.9)*2;return{...e,score:s}}).sort((a,b)=>b.score-a.score).slice(0,6);
}

function CCard({exp,onClick,onAdd,added,compact}){
  const[hov,setHov]=useState(false);const[liked,setLiked]=useState(false);
  if(compact)return(
    <div onClick={onClick} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer",alignItems:"center"}}>
      <img src={exp.img} alt="" style={{width:72,height:72,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"var(--fb)",fontSize:15,fontWeight:600,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.title}</div>
        <div style={{fontFamily:"var(--fb)",fontSize:13,color:"#999",marginTop:2}}>{exp.location} · {exp.duration}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>{ic.star()}<span style={{fontFamily:"var(--fb)",fontSize:13,fontWeight:600}}>{exp.rating}</span><span style={{fontFamily:"var(--fb)",fontSize:13,color:"#999"}}>· {fmt(exp.price)}/pp</span></div>
      </div>
      {onAdd&&<button onClick={e=>{e.stopPropagation();onAdd(exp)}} style={{width:36,height:36,borderRadius:"50%",border:"none",background:added?"#e8f5e3":"#222",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{added?ic.chk():ic.plus()}</button>}
    </div>
  );
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{minWidth:200,maxWidth:220,scrollSnapAlign:"start",cursor:"pointer",flexShrink:0}}>
      <div style={{position:"relative",width:"100%",height:280,borderRadius:14,overflow:"hidden",marginBottom:10}}>
        <img src={exp.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s",transform:hov?"scale(1.04)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 35%, rgba(0,0,0,0.35) 100%)"}}/>
        <button onClick={e=>{e.stopPropagation();setLiked(!liked)}} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.2)",border:"none",cursor:"pointer",padding:5,borderRadius:"50%",backdropFilter:"blur(4px)",display:"flex"}}>{ic.heart(liked)}</button>
        {onAdd&&<button onClick={e=>{e.stopPropagation();onAdd(exp)}} style={{position:"absolute",bottom:12,right:12,width:34,height:34,borderRadius:"50%",border:"none",background:added?"#e8f5e3":"#222",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{added?ic.chk():ic.plus()}</button>}
        <div style={{position:"absolute",bottom:12,left:12,right:50}}><div style={{fontFamily:"var(--fb)",fontSize:11,color:"rgba(255,255,255,0.8)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{exp.location}</div></div>
      </div>
      <div style={{fontFamily:"var(--fb)"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#222",lineHeight:1.3,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{exp.title}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}><span style={{display:"flex",alignItems:"center",gap:3}}>{ic.star()}<span style={{fontWeight:600}}>{exp.rating}</span></span><span style={{fontWeight:600}}>{fmt(exp.price)}<span style={{fontWeight:400,color:"#999"}}>/pp</span></span></div>
      </div>
    </div>
  );
}

function Detail({exp,onBack,onAdd,added}){
  return(
    <div style={{height:"100%",overflowY:"auto"}}>
      <div style={{position:"relative",height:280}}>
        <img src={exp.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <button onClick={onBack} style={{position:"absolute",top:16,left:16,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic.back()}</button>
      </div>
      <div style={{padding:"20px 20px 120px"}}>
        <div style={{fontFamily:"var(--fb)",fontSize:12,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{exp.location}</div>
        <h2 style={{fontFamily:"var(--fh)",fontSize:24,fontWeight:700,color:"#222",margin:"0 0 8px",lineHeight:1.25}}>{exp.title}</h2>
        <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--fb)",fontSize:14,color:"#666",marginBottom:20}}>{ic.star()}<span style={{fontWeight:600,color:"#222"}}>{exp.rating}</span><span>({exp.reviews})</span><span>·</span><span>{exp.duration}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:18,borderBottom:"1px solid #f0f0f0",marginBottom:18}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:14,fontWeight:700}}>{exp.ha}</div>
          <div style={{fontFamily:"var(--fb)",fontSize:15,fontWeight:600}}>Hosted by {exp.host}</div>
        </div>
        <p style={{fontFamily:"var(--fb)",fontSize:15,lineHeight:1.7,color:"#484848",marginBottom:20}}>{exp.desc}</p>
        <h4 style={{fontFamily:"var(--fb)",fontSize:16,fontWeight:600,marginBottom:12}}>What's included</h4>
        {exp.inc.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--fb)",fontSize:14,color:"#484848",marginBottom:8}}><span style={{fontSize:7,color:"#222"}}>●</span>{item}</div>)}
      </div>
      <div style={{position:"fixed",bottom:70,left:0,right:0,maxWidth:480,margin:"0 auto",padding:"14px 20px",background:"#fff",borderTop:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:40}}>
        <div><span style={{fontFamily:"var(--fb)",fontSize:20,fontWeight:700}}>{fmt(exp.price)}</span><span style={{fontFamily:"var(--fb)",fontSize:14,color:"#999"}}> /person</span></div>
        <button onClick={()=>onAdd(exp)} style={{padding:"12px 28px",borderRadius:10,border:"none",background:added?"#e8f5e3":"#222",color:added?"#008a05":"#fff",fontFamily:"var(--fb)",fontSize:15,fontWeight:600,cursor:"pointer"}}>{added?"✓ Added to trip":"Add to trip"}</button>
      </div>
    </div>
  );
}

function AIChat({onAdd,trip,setDates}){
  const[qi,setQi]=useState(0);const[ans,setAns]=useState({});const[sel,setSel]=useState([]);const[msgs,setMsgs]=useState([]);const[showO,setShowO]=useState(false);const[think,setThink]=useState(false);const[recs,setRecs]=useState([]);const[phase,setPhase]=useState("ob");const[det,setDet]=useState(null);const end=useRef(null);
  useEffect(()=>{setTimeout(()=>{setMsgs([{f:"bot",t:"Welcome to Élevé. I'm your concierge — tell me what you're dreaming of and I'll make it happen."}]);setTimeout(()=>{setMsgs(p=>[...p,{f:"bot",t:QS[0].text,s:QS[0].sub}]);setShowO(true)},700)},400)},[]);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"})},[msgs,showO,recs]);
  const cq=QS[qi];const tog=v=>cq?.multi?setSel(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]):setSel([v]);
  const sub=()=>{if(!sel.length)return;const labs=sel.map(v=>cq.opts.find(o=>o.v===v)?.l).join(", ");const na={...ans,[cq.id]:sel.length===1?sel[0]:sel};setMsgs(p=>[...p,{f:"user",t:labs}]);setShowO(false);setAns(na);setSel([]);
    if(qi<QS.length-1){setThink(true);const rs=["Great choice.","Love it — narrowing things down.","Perfect, almost there.","Got it."];setTimeout(()=>{setThink(false);setMsgs(p=>[...p,{f:"bot",t:rs[qi]}]);setTimeout(()=>{const nq=QS[qi+1];setMsgs(p=>[...p,{f:"bot",t:nq.text,s:nq.sub}]);setQi(qi+1);setShowO(true)},500)},800)}
    else{setThink(true);setTimeout(()=>{setThink(false);const r=getRecs(na);setRecs(r);if(na.dates)setDates(DL[na.dates]||"March 15–20, 2026");setMsgs(p=>[...p,{f:"bot",t:`Here are ${r.length} experiences I picked for you. Tap + to add any to your trip.`}]);setPhase("res")},1200)}
  };
  if(phase==="det"&&det)return<Detail exp={det} onBack={()=>{setDet(null);setPhase("res")}} onAdd={onAdd} added={trip.some(t=>t.id===det.id)}/>;
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontSize:15,fontWeight:700,color:"#fff"}}>É</div>
        <div><div style={{fontFamily:"var(--fh)",fontSize:17,fontWeight:700,color:"#222"}}>Élevé Concierge</div><div style={{fontFamily:"var(--fb)",fontSize:11,color:"#bbb"}}>Always available</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {phase==="ob"&&<div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:24}}>{QS.map((_,i)=><div key={i} style={{width:i<=qi?36:20,height:3,borderRadius:2,background:i<=qi?"#222":"#e8e8e8",transition:"all 0.3s"}}/>)}</div>}
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.f==="bot"?"flex-start":"flex-end",marginBottom:10}}>
          {m.f==="bot"&&<div style={{width:28,height:28,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontSize:12,fontWeight:700,color:"#fff",marginRight:8,marginTop:2,flexShrink:0}}>É</div>}
          <div style={{maxWidth:340,padding:"12px 16px",borderRadius:18,borderBottomLeftRadius:m.f==="bot"?5:18,borderBottomRightRadius:m.f==="bot"?18:5,background:m.f==="bot"?"#f4f2ef":"#222",color:m.f==="bot"?"#222":"#fff",fontFamily:"var(--fb)",fontSize:15,lineHeight:1.5}}>{m.t}{m.s&&<div style={{fontSize:12,color:"#999",marginTop:3}}>{m.s}</div>}</div>
        </div>)}
        {think&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:28,height:28,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontSize:12,fontWeight:700,color:"#fff"}}>É</div><div style={{padding:"12px 16px",borderRadius:18,borderBottomLeftRadius:5,background:"#f4f2ef",display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#bbb",animation:`pulse 1.4s ease ${i*0.16}s infinite`}}/>)}</div></div>}
        {phase==="res"&&recs.length>0&&<div style={{marginTop:8}}>
          {recs.map(exp=><CCard key={exp.id} exp={exp} compact onClick={()=>{setDet(exp);setPhase("det")}} onAdd={onAdd} added={trip.some(t=>t.id===exp.id)}/>)}
          <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>{setPhase("ob");setQi(0);setAns({});setSel([]);setMsgs([{f:"bot",t:"Let's try again — tell me what you want."}]);setTimeout(()=>{setMsgs(p=>[...p,{f:"bot",t:QS[0].text,s:QS[0].sub}]);setShowO(true)},600)}} style={{padding:"10px 24px",borderRadius:10,border:"1px solid #ddd",background:"#fff",fontFamily:"var(--fb)",fontSize:13,fontWeight:600,cursor:"pointer",color:"#666"}}>Start over</button></div>
        </div>}
        <div ref={end}/>
      </div>
      {showO&&cq&&<div style={{borderTop:"1px solid #f0f0f0",padding:"16px 16px 20px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12,justifyContent:"center"}}>{cq.opts.map(o=><button key={o.v} onClick={()=>tog(o.v)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:24,border:sel.includes(o.v)?"2px solid #222":"1.5px solid #ddd",background:sel.includes(o.v)?"#222":"#fff",color:sel.includes(o.v)?"#fff":"#444",fontFamily:"var(--fb)",fontSize:14,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}><span style={{fontSize:16}}>{o.e}</span>{o.l}</button>)}</div>
        <button onClick={sub} disabled={!sel.length} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:sel.length?"#222":"#e8e8e8",color:sel.length?"#fff":"#bbb",fontFamily:"var(--fb)",fontSize:15,fontWeight:600,cursor:sel.length?"pointer":"not-allowed"}}>Continue →</button>
      </div>}
      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

function Ideas({onAdd,trip}){
  const[cat,setCat]=useState("all");const[det,setDet]=useState(null);
  const fl=cat==="all"?EXP:EXP.filter(e=>e.category===cat);
  if(det)return<Detail exp={det} onBack={()=>setDet(null)} onAdd={onAdd} added={trip.some(t=>t.id===det.id)}/>;
  return(
    <div style={{height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 20px 12px"}}><h2 style={{fontFamily:"var(--fh)",fontSize:26,fontWeight:700,color:"#222",margin:0}}>Explore</h2><p style={{fontFamily:"var(--fb)",fontSize:14,color:"#999",marginTop:4}}>Browse all experiences</p></div>
      <div style={{display:"flex",gap:8,padding:"0 20px 16px",overflowX:"auto",scrollbarWidth:"none"}}>{CATEGORIES.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{padding:"8px 16px",borderRadius:20,whiteSpace:"nowrap",border:cat===c.id?"2px solid #222":"1.5px solid #ddd",background:cat===c.id?"#222":"#fff",color:cat===c.id?"#fff":"#666",fontFamily:"var(--fb)",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:15}}>{c.icon}</span>{c.label}</button>)}</div>
      <div style={{padding:"0 20px 20px"}}>{fl.map(exp=><CCard key={exp.id} exp={exp} compact onClick={()=>setDet(exp)} onAdd={onAdd} added={trip.some(t=>t.id===exp.id)}/>)}</div>
    </div>
  );
}

function Trip({trip,onRm,dates}){
  const days=["Day 1","Day 2","Day 3","Day 4","Day 5"];const[da,setDa]=useState({});
  return(
    <div style={{height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 20px 0"}}><h2 style={{fontFamily:"var(--fh)",fontSize:26,fontWeight:700,color:"#222",margin:0}}>Your Trip</h2><p style={{fontFamily:"var(--fb)",fontSize:14,color:"#999",marginTop:4}}>{dates||"Set dates via AI Chat"}</p></div>
      {!trip.length?<div style={{padding:"60px 20px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🗺</div><div style={{fontFamily:"var(--fh)",fontSize:20,fontWeight:600,color:"#222",marginBottom:8}}>No activities yet</div><p style={{fontFamily:"var(--fb)",fontSize:14,color:"#999",lineHeight:1.6}}>Talk to your AI concierge or browse Ideas to build your itinerary.</p></div>
      :<div style={{padding:"16px 20px"}}>
        {trip.filter(e=>!da[e.id]).length>0&&<div style={{marginBottom:24}}><div style={{fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Assign to a day</div>
          {trip.filter(e=>!da[e.id]).map(exp=><div key={exp.id} style={{background:"#f9f8f6",borderRadius:14,padding:14,marginBottom:10}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
              <img src={exp.img} alt="" style={{width:56,height:56,borderRadius:10,objectFit:"cover"}}/>
              <div style={{flex:1}}><div style={{fontFamily:"var(--fb)",fontSize:14,fontWeight:600}}>{exp.title}</div><div style={{fontFamily:"var(--fb)",fontSize:12,color:"#999"}}>{exp.duration} · {exp.time} · {fmt(exp.price)}/pp</div></div>
              <button onClick={()=>onRm(exp.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#ccc",padding:4}}>✕</button>
            </div>
            <div style={{display:"flex",gap:6}}>{days.map(d=><button key={d} onClick={()=>setDa(p=>({...p,[exp.id]:d}))} style={{padding:"5px 12px",borderRadius:16,fontSize:12,fontFamily:"var(--fb)",fontWeight:500,cursor:"pointer",border:"1px solid #ddd",background:"#fff",color:"#444"}}>{d}</button>)}</div>
          </div>)}
        </div>}
        {days.map(day=>{const di=trip.filter(e=>da[e.id]===day);if(!di.length)return null;return(
          <div key={day} style={{marginBottom:24}}>
            <div style={{fontFamily:"var(--fb)",fontSize:13,fontWeight:600,color:"#222",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10,display:"flex",alignItems:"center",gap:8}}><div style={{width:8,height:8,borderRadius:"50%",background:"#222"}}/>{day}</div>
            {di.map(exp=><div key={exp.id} style={{display:"flex",gap:12,alignItems:"center",padding:12,background:"#fff",borderRadius:12,border:"1px solid #eee",marginBottom:8,marginLeft:16,borderLeft:"3px solid #222"}}>
              <img src={exp.img} alt="" style={{width:50,height:50,borderRadius:8,objectFit:"cover"}}/>
              <div style={{flex:1}}><div style={{fontFamily:"var(--fb)",fontSize:14,fontWeight:600}}>{exp.title}</div><div style={{fontFamily:"var(--fb)",fontSize:12,color:"#999"}}>{exp.time} · {exp.duration}</div></div>
              <div style={{padding:"4px 10px",borderRadius:12,background:"#e8f5e3",fontFamily:"var(--fb)",fontSize:11,fontWeight:600,color:"#008a05"}}>Booked</div>
            </div>)}
          </div>
        )})}
      </div>}
    </div>
  );
}

function Msgs(){
  const cs=[{h:"Captain Marco Bellini",a:"MB",l:"Looking forward to hosting you! Weather looks perfect for Saturday.",t:"2m ago",u:true},{h:"Chef Kenji Tanaka",a:"KT",l:"I'll prepare the seasonal uni — it's exceptional right now.",t:"1h ago",u:true},{h:"Sommelier Claire Duval",a:"CD",l:"Great, I've reserved the private tasting room for your group.",t:"3h ago",u:false}];
  return(
    <div style={{height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 20px 12px"}}><h2 style={{fontFamily:"var(--fh)",fontSize:26,fontWeight:700,color:"#222",margin:0}}>Messages</h2><p style={{fontFamily:"var(--fb)",fontSize:14,color:"#999",marginTop:4}}>Chat with your hosts</p></div>
      <div style={{padding:"0 20px"}}>{cs.map((c,i)=><div key={i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer",alignItems:"flex-start"}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fb)",fontSize:15,fontWeight:700,flexShrink:0}}>{c.a}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontFamily:"var(--fb)",fontSize:15,fontWeight:600,color:"#222"}}>{c.h}</span><span style={{fontFamily:"var(--fb)",fontSize:12,color:"#bbb"}}>{c.t}</span></div>
          <div style={{fontFamily:"var(--fb)",fontSize:14,color:c.u?"#222":"#999",fontWeight:c.u?500:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.l}</div>
        </div>
        {c.u&&<div style={{width:8,height:8,borderRadius:"50%",background:"#222",marginTop:6,flexShrink:0}}/>}
      </div>)}</div>
    </div>
  );
}

function Prof(){
  const mi=[{l:"Personal Information",i:"👤"},{l:"Payment Methods",i:"💳"},{l:"Saved Experiences",i:"♥"},{l:"Past Trips",i:"🗺"},{l:"Notifications",i:"🔔"},{l:"Privacy & Security",i:"🔒"},{l:"Help & Support",i:"💬"}];
  return(
    <div style={{height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 20px 0",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"#222",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontSize:32,fontWeight:700,color:"#fff"}}>S</div>
        <h2 style={{fontFamily:"var(--fh)",fontSize:24,fontWeight:700,color:"#222",margin:0}}>Serge</h2>
        <p style={{fontFamily:"var(--fb)",fontSize:14,color:"#999",marginTop:4}}>Member since 2026</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:32,padding:"20px 0",margin:"16px 20px",borderTop:"1px solid #f0f0f0",borderBottom:"1px solid #f0f0f0"}}>
        {[["3","Trips"],["12","Saved"],["7","Reviews"]].map(([n,l],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontFamily:"var(--fh)",fontSize:22,fontWeight:700,color:"#222"}}>{n}</div><div style={{fontFamily:"var(--fb)",fontSize:12,color:"#999"}}>{l}</div></div>)}
      </div>
      <div style={{padding:"0 20px"}}>{mi.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}><span style={{fontSize:18,width:24,textAlign:"center"}}>{item.i}</span><span style={{fontFamily:"var(--fb)",fontSize:15,color:"#222"}}>{item.l}</span></div>
        <span style={{color:"#ccc",fontSize:18}}>›</span>
      </div>)}</div>
      <div style={{padding:"24px 20px",textAlign:"center"}}><button style={{fontFamily:"var(--fb)",fontSize:14,fontWeight:600,color:"#e11d48",background:"none",border:"none",cursor:"pointer"}}>Log Out</button></div>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState("chat");const[trip,setTrip]=useState([]);const[dates,setDates]=useState("");
  const add=e=>{if(!trip.some(t=>t.id===e.id))setTrip(p=>[...p,e])};
  const rm=id=>setTrip(p=>p.filter(t=>t.id!==id));
  const tabs=[{id:"chat",l:"AI Chat",i:ic.chat},{id:"ideas",l:"Ideas",i:ic.ideas},{id:"trip",l:"Your Trip",i:ic.trip},{id:"messages",l:"Messages",i:ic.msg},{id:"profile",l:"Profile",i:ic.prof}];
  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`:root{--fh:'Newsreader',Georgia,serif;--fb:'Figtree',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}body{background:#f5f5f5;-webkit-font-smoothing:antialiased}::selection{background:#222;color:#fff}`}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",background:"#fff",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.06)"}}>
        <div style={{flex:1,overflow:"hidden"}}>
          {tab==="chat"&&<AIChat onAdd={add} trip={trip} setDates={setDates}/>}
          {tab==="ideas"&&<Ideas onAdd={add} trip={trip}/>}
          {tab==="trip"&&<Trip trip={trip} onRm={rm} dates={dates}/>}
          {tab==="messages"&&<Msgs/>}
          {tab==="profile"&&<Prof/>}
        </div>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",height:70,borderTop:"1px solid #f0f0f0",background:"#fff",flexShrink:0,paddingBottom:6}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",position:"relative"}}>
            {t.i(tab===t.id)}
            <span style={{fontFamily:"var(--fb)",fontSize:10,fontWeight:600,color:tab===t.id?"#222":"#bbb"}}>{t.l}</span>
            {t.id==="trip"&&trip.length>0&&<div style={{position:"absolute",top:2,right:4,width:16,height:16,borderRadius:"50%",background:"#e11d48",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",fontFamily:"var(--fb)"}}>{trip.length}</div>}
            {t.id==="messages"&&<div style={{position:"absolute",top:2,right:8,width:8,height:8,borderRadius:"50%",background:"#e11d48"}}/>}
          </button>)}
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useCallback, useEffect } from "react";

const SECRET_HASH = "a941a4c4fd0c01cddef61b8be963bf4c1e2b0811c037ce3f1835fddf6ef6c223";

// ─────────────────────────────────────────────────────────────────────────────
// 📖 Story chapters — edit text freely
// ─────────────────────────────────────────────────────────────────────────────
const STORY_STEPS = [
  {
    emoji: "🕯️",
    title: "Once upon a time…",
    text: "There was someone so beautiful My Chanda, the stars themselves took notes.",
  },
  {
    emoji: "🎈",
    title: "Years passed like pages…",
    text: "Each one filled with love, adventures, and sukoon moments worth keeping forever.",
  },
  {
    emoji: "📖",
    title: "And today…",
    text: "In our Mini Home We gathered every memory, every smile, every shared secret — and made something just for you.",
  },
  {
    emoji: "💌",
    title: "This is your story.",
    text: "Written in photographs. Sealed with love. Happy Birthday Mera Chanda 🎂",
  },
];

// ── 21 photo positions matching the physical wall layout ──────────────────────
const LAYOUT = [
  { id: 0,  x: 155, y: 0,   rot: -3 },
  { id: 1,  x: 385, y: 0,   rot:  2 },
  { id: 2,  x: 60,  y: 110, rot: -5 },
  { id: 3,  x: 210, y: 100, rot:  2 },
  { id: 4,  x: 330, y: 95,  rot: -2 },
  { id: 5,  x: 480, y: 105, rot:  4 },
  { id: 6,  x: 20,  y: 210, rot: -4 },
  { id: 7,  x: 160, y: 205, rot:  1 },
  { id: 8,  x: 280, y: 200, rot: -1 },
  { id: 9,  x: 390, y: 208, rot:  3 },
  { id: 10, x: 510, y: 215, rot: -3 },
  { id: 11, x: 85,  y: 315, rot:  3 },
  { id: 12, x: 205, y: 308, rot: -2 },
  { id: 13, x: 325, y: 312, rot:  2 },
  { id: 14, x: 440, y: 320, rot: -4 },
  { id: 15, x: 145, y: 415, rot: -3 },
  { id: 16, x: 260, y: 410, rot:  1 },
  { id: 17, x: 370, y: 418, rot:  3 },
  { id: 18, x: 195, y: 510, rot:  2 },
  { id: 19, x: 305, y: 508, rot: -2 },
  { id: 20, x: 248, y: 600, rot:  1 },
];

const PHOTO_W = 115;
const PHOTO_H = 88;

// Your Cloudinary images
const MY_IMAGES = [
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341116/IMG_6622_ozuywb.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341116/IMG_6628_mwlpfp.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341117/IMG_6624_hg4kbd.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341117/IMG_6623_mjitwo.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341117/IMG_6621_nfdwfd.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341117/IMG_6625_prj9rg.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341117/IMG_6620_qyvx7a.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341120/IMG_6611_uyte9c.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341120/IMG_6609_e6rkiw.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341121/IMG_6606_hnosl0.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341119/IMG_6613_uxkdix.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341123/IMG_6617_xgrrpw.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341124/IMG_6612_erzngr.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341118/IMG_6627_ee2k3y.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341118/IMG_6618_bofrkw.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341118/IMG_6615_gtorsy.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341119/IMG_6619_rigoww.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341118/IMG_6626_bl3hai.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341120/IMG_6610_mbmyfo.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341121/IMG_6607_qtihb7.jpg",
  "https://res.cloudinary.com/dmyyka28o/image/upload/v1776341125/IMG_6608_n4oaeu.jpg",
];

// ── SHA-256 hash helper (browser built-in, no library needed) ─────────────────
async function sha256(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Shared keyframes injected once ───────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes twinkle    { 0%,100%{opacity:0.1;} 50%{opacity:0.9;} }
  @keyframes cffall     { 0%{transform:translateY(0) rotate(0deg);opacity:.85;} 100%{transform:translateY(110vh) rotate(540deg);opacity:0;} }
  @keyframes balloonrise{ 0%{transform:translateY(0) translateX(0);opacity:.9;} 30%{transform:translateY(-35vh) translateX(18px);opacity:.88;} 60%{transform:translateY(-70vh) translateX(-14px);opacity:.7;} 100%{transform:translateY(-115vh) translateX(8px);opacity:0;} }
  @keyframes giftfall   { 0%{transform:translateY(0) rotate(0deg);opacity:.88;} 100%{transform:translateY(110vh) rotate(480deg);opacity:0;} }
  @keyframes shake      { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-10px);} 40%,80%{transform:translateX(10px);} }
  @keyframes float-up   { 0%,100%{transform:translateY(0) rotate(-2deg);} 50%{transform:translateY(-12px) rotate(2deg);} }
  @keyframes fadeInUp   { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
  @keyframes pulse-ring { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.5;} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0;} }
  @keyframes storyIn    { from{opacity:0;transform:translateY(30px) scale(0.96);} to{opacity:1;transform:translateY(0) scale(1);} }
  @keyframes emojiPop   { 0%{transform:scale(0) rotate(-20deg);} 70%{transform:scale(1.2) rotate(5deg);} 100%{transform:scale(1) rotate(0deg);} }
  @keyframes drop       { from{opacity:0;transform:translateY(-40px) scale(0.7);} to{opacity:1;transform:translateY(0) scale(1);} }
  @keyframes heartbeat  { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 20px #ff6b9d44);} 20%{transform:scale(1.04);filter:drop-shadow(0 0 40px #ff6b9d88);} 40%{transform:scale(0.98);} }
  @keyframes pulse-title{ 0%,100%{text-shadow:0 0 12px #ff6b9d88,0 2px 4px rgba(0,0,0,.15);} 50%{text-shadow:0 0 28px #ff6b9dcc,0 0 55px #ffd93d44,0 2px 4px rgba(0,0,0,.15);} }
  @keyframes page-glow  { from{width:0;} to{width:80%;} }
  .ctrl-btn { transition: transform 0.18s ease, opacity 0.18s ease; }
  .ctrl-btn:hover { transform: scale(1.06) !important; opacity: 0.88; }
`;

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const items = useRef(
    Array.from({ length: 38 }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 3.5 + Math.random() * 4,
      size: 5 + Math.random() * 7,
      color: ["#ff6b9d","#ffd93d","#6bcb77","#4d96ff","#ff6b35","#c77dff","#ff9f1c"][i % 7],
      shape: ["circle","rect","star"][i % 3],
      rot: Math.random() * 360,
    }))
  ).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:`${p.x}%`, top:"-20px",
          width:p.size, height:p.shape==="circle"?p.size:p.size*1.3,
          background:p.color,
          borderRadius:p.shape==="circle"?"50%":p.shape==="rect"?"2px":"0",
          clipPath:p.shape==="star"?"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)":"none",
          animation:`cffall ${p.dur}s ${p.delay}s linear infinite`,
          transform:`rotate(${p.rot}deg)`, opacity:0.82,
        }}/>
      ))}
    </div>
  );
}

// ── Balloons ──────────────────────────────────────────────────────────────────
function Balloons() {
  const items = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 9,
      dur: 7 + Math.random() * 6,
      size: 22 + Math.random() * 18,
      color: ["#ff6b9d","#ffd93d","#6bcb77","#4d96ff","#ff6b35","#c77dff","#ff9f1c"][i % 7],
    }))
  ).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:`${p.x}%`, bottom:"-60px",
          fontSize:p.size, animation:`balloonrise ${p.dur}s ${p.delay}s ease-in-out infinite`,
          opacity:0.88, filter:`hue-rotate(${(i*47)%360}deg)`,
        }}>🎈</div>
      ))}
    </div>
  );
}

// ── Gifts ─────────────────────────────────────────────────────────────────────
function Gifts() {
  const items = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 8,
      dur: 4.5 + Math.random() * 5,
      size: 18 + Math.random() * 16,
      rot: Math.random() * 360,
    }))
  ).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:`${p.x}%`, top:"-48px",
          fontSize:p.size,
          animation:`giftfall ${p.dur}s ${p.delay}s linear infinite`,
          transform:`rotate(${p.rot}deg)`, opacity:0.85,
        }}>🎁</div>
      ))}
    </div>
  );
}

// ── Stars (night mode) ────────────────────────────────────────────────────────
function Stars() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {Array.from({ length: 55 }).map((_, i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${(Math.sin(i*1.9+1)*0.5+0.5)*100}%`,
          top:`${(Math.cos(i*2.1+0.5)*0.5+0.5)*100}%`,
          width:i%7===0?3:2, height:i%7===0?3:2,
          borderRadius:"50%", background:"white",
          animation:`twinkle ${1.5+(i%4)*0.5}s ${i*0.11}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ text, speed = 30, onDone }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); onDone && onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span>
      {displayed}
      <span style={{ opacity: displayed.length < text.length ? 1 : 0 }}>|</span>
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Secret code lock (SHA-256 hashed)
// ════════════════════════════════════════════════════════════════════════════
function SecretScreen({ onUnlock }) {
  const [code, setCode]       = useState("");
  const [shake, setShake]     = useState(false);
  const [wrong, setWrong]     = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [checking, setChecking] = useState(false);

  const tryUnlock = async () => {
    if (checking || !code.trim()) return;
    setChecking(true);
    const hash = await sha256(code.trim().toLowerCase());
    if (hash === SECRET_HASH) {
      setGlowing(true);
      setTimeout(onUnlock, 900);
    } else {
      setShake(true); setWrong(true);
      setTimeout(() => { setShake(false); setWrong(false); }, 700);
      setCode("");
    }
    setChecking(false);
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 50% 30%,#1a0030 0%,#0a0018 55%,#000008 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Georgia','Palatino Linotype',serif",
      position:"relative", overflow:"hidden", padding:"2rem",
    }}>
      <style>{GLOBAL_CSS}</style>
      <Stars/>

      {/* Pulse rings */}
      {[0,1].map(i=>(
        <div key={i} style={{
          position:"absolute",
          width:300+i*220, height:300+i*220,
          borderRadius:"50%",
          border:`1px solid rgba(255,107,157,${0.12-i*0.05})`,
          top:"50%", left:"50%",
          animation:`pulse-ring ${3+i}s ${i}s ease-out infinite`,
        }}/>
      ))}

      {/* Floating book */}
      <div style={{
        fontSize:64, marginBottom:"1rem",
        animation:"float-up 4s ease-in-out infinite",
        filter:"drop-shadow(0 0 20px rgba(255,107,157,0.55))",
      }}>📖</div>

      {/* Heading */}
      <div style={{ textAlign:"center", marginBottom:"2rem", animation:"fadeInUp 0.7s ease both" }}>
        <p style={{ fontSize:"clamp(0.6rem,1.5vw,0.75rem)", letterSpacing:"0.4em",
          textTransform:"uppercase", color:"rgba(255,180,220,0.45)", marginBottom:8 }}>
          a birthday story awaits
        </p>
        <h1 style={{ fontSize:"clamp(1.6rem,4.5vw,2.6rem)", color:"#fff5f8", fontWeight:700,
          margin:0, textShadow:"0 0 30px rgba(255,107,157,0.6),0 2px 4px rgba(0,0,0,0.4)",
          letterSpacing:"0.03em" }}>
          Do you know the secret?
        </h1>
        <p style={{ marginTop:10, fontSize:"clamp(0.8rem,2vw,0.95rem)",
          color:"rgba(255,200,230,0.5)", letterSpacing:"0.05em", fontStyle:"italic" }}>
          Whisper the magic word to open this storybook…
        </p>
      </div>

      {/* Input */}
      <div style={{
        animation: shake ? "shake 0.5s ease" : "fadeInUp 0.8s 0.15s ease both",
        width:"100%", maxWidth:320,
      }}>
        <div style={{
          background: glowing?"rgba(255,107,157,0.18)":wrong?"rgba(255,80,80,0.08)":"rgba(255,255,255,0.04)",
          border:`1.5px solid ${glowing?"#ff6b9d":wrong?"rgba(255,80,80,0.55)":"rgba(255,150,200,0.22)"}`,
          borderRadius:16, padding:"1rem 1.2rem",
          transition:"all 0.3s ease",
          boxShadow:glowing?"0 0 40px 10px rgba(255,107,157,0.45)":"none",
        }}>
          <input
            type="password"
            value={code}
            onChange={e=>setCode(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
            placeholder="enter the secret word…"
            autoFocus
            style={{
              width:"100%", background:"transparent", border:"none", outline:"none",
              fontSize:"1.1rem", color:wrong?"#ff8080":"#fff5f8",
              fontFamily:"inherit", textAlign:"center",
              letterSpacing:"0.18em", caretColor:"#ff6b9d",
            }}
          />
        </div>

        {wrong && (
          <p style={{ textAlign:"center", color:"#ff8080", fontSize:"0.78rem",
            marginTop:8, letterSpacing:"0.05em", fontStyle:"italic" }}>
            Hmm… that's not quite right. Try again 🔮
          </p>
        )}

        <button
          onClick={tryUnlock}
          disabled={checking}
          style={{
            width:"100%", marginTop:14, padding:"0.75rem", borderRadius:12,
            border:"none",
            background:"linear-gradient(135deg,#ff6b9d,#c77dff)",
            color:"white", fontSize:"0.9rem", fontFamily:"inherit",
            fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase",
            cursor:"pointer", boxShadow:"0 4px 20px rgba(255,107,157,0.4)",
            transition:"transform 0.2s ease,box-shadow 0.2s ease",
            opacity: checking ? 0.7 : 1,
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 6px 28px rgba(255,107,157,0.6)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 4px 20px rgba(255,107,157,0.4)"; }}
        >
          {checking ? "…" : "✨ Open the Storybook"}
        </button>
      </div>

      <p style={{ marginTop:"2.5rem", fontSize:"0.65rem",
        color:"rgba(255,180,220,0.22)", letterSpacing:"0.1em", fontStyle:"italic" }}>
        Only the one who knows the word may enter 🌙
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Story chapters with typewriter
// ════════════════════════════════════════════════════════════════════════════
function StoryScreen({ onFinish }) {
  const [step, setStep]     = useState(0);
  const [typing, setTyping] = useState(true);
  const current = STORY_STEPS[step];

  const next = () => {
    if (typing) return;
    if (step < STORY_STEPS.length - 1) { setStep(s=>s+1); setTyping(true); }
    else onFinish();
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 50% 20%,#1a0030 0%,#080015 60%,#000008 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Georgia','Palatino Linotype',serif",
      position:"relative", overflow:"hidden", padding:"2rem",
    }}>
      <Stars/>
      <Confetti/>

      {/* Progress dots */}
      <div style={{ display:"flex", gap:8, marginBottom:"2rem", position:"relative", zIndex:5 }}>
        {STORY_STEPS.map((_,i)=>(
          <div key={i} style={{
            width:i===step?24:8, height:8, borderRadius:999,
            background:i<=step?"#ff6b9d":"rgba(255,255,255,0.15)",
            transition:"all 0.4s ease",
            boxShadow:i===step?"0 0 10px #ff6b9d":"none",
          }}/>
        ))}
      </div>

      {/* Story card */}
      <div key={step} style={{
        maxWidth:480, width:"100%",
        background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,150,200,0.18)",
        borderRadius:24, padding:"2.5rem 2rem",
        textAlign:"center",
        backdropFilter:"blur(12px)",
        boxShadow:"0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.07)",
        animation:"storyIn 0.6s cubic-bezier(.34,1.56,.64,1) both",
        position:"relative", zIndex:5,
      }}>
        <div style={{
          position:"absolute", top:0, left:"10%", right:"10%",
          height:2, borderRadius:2,
          background:"linear-gradient(to right,transparent,#ff6b9d,#c77dff,transparent)",
          animation:"page-glow 0.8s ease both",
        }}/>

        <div style={{ fontSize:56, marginBottom:"1rem",
          animation:"emojiPop 0.5s cubic-bezier(.34,1.56,.64,1) both",
          filter:"drop-shadow(0 0 16px rgba(255,107,157,0.5))" }}>
          {current.emoji}
        </div>

        <h2 style={{ fontSize:"clamp(1rem,3vw,1.4rem)", color:"#fff5f8",
          fontWeight:700, margin:"0 0 1rem",
          textShadow:"0 0 20px rgba(255,107,157,0.4)", letterSpacing:"0.03em" }}>
          {current.title}
        </h2>

        <p style={{ fontSize:"clamp(0.9rem,2.5vw,1.05rem)",
          color:"rgba(255,210,230,0.85)", lineHeight:1.75,
          margin:"0 0 1.8rem", fontStyle:"italic",
          letterSpacing:"0.02em", minHeight:60 }}>
          <Typewriter key={step} text={current.text} speed={28} onDone={()=>setTyping(false)}/>
        </p>

        <button
          onClick={next}
          disabled={typing}
          style={{
            padding:"0.65rem 2rem", borderRadius:999,
            border:"1.5px solid rgba(255,107,157,0.45)",
            background:typing?"rgba(255,107,157,0.04)":"linear-gradient(135deg,#ff6b9d88,#c77dff88)",
            color:typing?"rgba(255,255,255,0.25)":"#fff5f8",
            fontSize:"0.82rem", fontFamily:"inherit",
            letterSpacing:"0.12em", textTransform:"uppercase",
            cursor:typing?"default":"pointer",
            transition:"all 0.3s ease",
            boxShadow:typing?"none":"0 0 20px rgba(255,107,157,0.3)",
          }}
          onMouseEnter={e=>{ if(!typing) e.currentTarget.style.transform="scale(1.05)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; }}
        >
          {step < STORY_STEPS.length-1 ? "Turn the page →" : "🎂 Open your gift →"}
        </button>
      </div>

      <p style={{ marginTop:"1.5rem", fontSize:"0.65rem",
        color:"rgba(255,180,220,0.28)", letterSpacing:"0.15em",
        position:"relative", zIndex:5 }}>
        chapter {step+1} of {STORY_STEPS.length}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Heart photo wall (your original component, unchanged)
// ════════════════════════════════════════════════════════════════════════════
function PhotoCard({ slot, src, onReplace, nightMode }) {
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef();

  const shadow = nightMode
    ? hovered
      ? "4px 6px 20px rgba(0,0,0,0.7),0 0 18px 5px rgba(255,180,255,0.45)"
      : "3px 5px 14px rgba(0,0,0,0.55),0 0 8px 2px rgba(200,150,255,0.2)"
    : hovered
    ? "5px 8px 24px rgba(0,0,0,0.35),0 0 14px 4px rgba(255,150,100,0.35)"
    : "3px 5px 12px rgba(0,0,0,0.22)";

  return (
    <div
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={()=>inputRef.current?.click()} title="Click to replace photo"
      style={{
        position:"absolute", left:slot.x, top:slot.y,
        width:PHOTO_W, height:PHOTO_H+22,
        background:"#fff", borderRadius:3,
        padding:"5px 5px 17px", boxSizing:"border-box",
        boxShadow:shadow,
        transform:`rotate(${slot.rot+(hovered?slot.rot*-0.4:0)}deg) scale(${hovered?1.1:1})`,
        transformOrigin:"center center",
        transition:"transform 0.28s ease,box-shadow 0.3s ease",
        cursor:"pointer", zIndex:hovered?30:slot.id+1,
        animation:`drop 0.45s cubic-bezier(.34,1.56,.64,1) ${slot.id*60}ms both`,
      }}
    >
      <div style={{ width:"100%", height:PHOTO_H-10, overflow:"hidden", position:"relative", borderRadius:1 }}>
        <img src={src} alt={`photo ${slot.id+1}`} style={{
          width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"filter 0.3s ease",
          filter:nightMode
            ? hovered?"brightness(1.25) saturate(1.4)":"brightness(0.8) saturate(1.1)"
            : hovered?"brightness(1.08)":"brightness(1)",
        }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.38)",
          display:"flex", alignItems:"center", justifyContent:"center",
          opacity:hovered?1:0, transition:"opacity 0.22s ease" }}>
          <span style={{ fontSize:20 }}>📷</span>
        </div>
      </div>
      <div style={{ height:17, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:9, color:"#bbb", letterSpacing:"0.06em", userSelect:"none" }}>
        {hovered?"click to change":`photo ${slot.id+1}`}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }}
        onChange={e=>{ const f=e.target.files?.[0]; if(f) onReplace(slot.id,URL.createObjectURL(f)); e.target.value=""; }}/>
    </div>
  );
}

function HeartWallScreen() {
  const [images, setImages]           = useState(MY_IMAGES);
  const [nightMode, setNightMode]     = useState(false);
  const [name]                        = useState("Mera Chanda");
  const bulkRef                       = useRef();

  const handleReplace = useCallback((id,url)=>{
    setImages(p=>{ const n=[...p]; n[id]=url; return n; });
  },[]);

  const handleBulk = e => {
    const files = Array.from(e.target.files||[]);
    if(!files.length) return;
    setImages(p=>{ const n=[...p]; files.slice(0,21).forEach((f,i)=>{ n[i]=URL.createObjectURL(f); }); return n; });
    e.target.value="";
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:nightMode?"#0d0018":"linear-gradient(to bottom,#f8bbd0,#e91e8c)",
      transition:"background 1s ease",
      display:"flex", flexDirection:"column", alignItems:"center",
      fontFamily:"'Georgia','Palatino Linotype',serif",
      padding:"1.5rem 1rem 3rem",
      position:"relative", overflow:"hidden",
    }}>
      <Confetti/>
      <Balloons/>
      <Gifts/>
      {nightMode && <Stars/>}

      {/* Header */}
      <div style={{ textAlign:"center", position:"relative", zIndex:10, marginBottom:"1rem" }}>
        <div style={{ fontSize:"clamp(0.65rem,1.8vw,0.8rem)", letterSpacing:"0.35em",
          textTransform:"uppercase", color:nightMode?"#ffd93dbb":"#4a7c6f", marginBottom:4 }}>
          Happy Birthday 🎂
        </div>
        <h1 style={{ fontSize:"clamp(1.4rem,4.5vw,2.4rem)", margin:0, fontWeight:700,
          color:nightMode?"#fff9e6":"#1a3a34",
          animation:"pulse-title 3s ease-in-out infinite",
          fontFamily:"'Dancing Script',cursive",
          letterSpacing:"0.04em" }}>
          {name} ❤️
        </h1>
      </div>

      {/* Heart canvas */}
      <div style={{ position:"relative", width:640, height:720, maxWidth:"96vw",
        animation:"heartbeat 3s ease-in-out infinite", zIndex:5, flexShrink:0 }}>
        {LAYOUT.map(slot=>(
          <PhotoCard key={slot.id} slot={slot} src={images[slot.id]}
            onReplace={handleReplace} nightMode={nightMode}/>
        ))}
      </div>

      <p style={{ fontSize:"0.65rem",
        color:nightMode?"rgba(255,200,150,0.4)":"rgba(255,255,255,0.39)",
        marginTop:"0.4rem", letterSpacing:"0.09em", position:"relative", zIndex:6 }}>
        Click any photo to swap it individually
      </p>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap",
        justifyContent:"center", marginTop:"1rem", position:"relative", zIndex:10 }}>
        <input ref={bulkRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleBulk}/>

        <button className="ctrl-btn"
          onClick={()=>setImages([...MY_IMAGES])}
          style={{ padding:"0.5rem 1.3rem", borderRadius:999, cursor:"pointer",
            border:`1.5px solid ${nightMode?"rgba(255,255,255,0.18)":"rgba(26,58,52,0.22)"}`,
            background:"transparent",
            color:nightMode?"rgba(255,255,255,0.55)":"rgba(26,58,52,0.5)",
            fontSize:"0.78rem", letterSpacing:"0.08em", fontFamily:"inherit" }}>
          ↺ Reset Photos
        </button>

        <button className="ctrl-btn" onClick={()=>setNightMode(v=>!v)}
          style={{ padding:"0.5rem 1.3rem", borderRadius:999, cursor:"pointer",
            border:`1.5px solid ${nightMode?"rgba(180,150,255,0.45)":"rgba(255,180,50,0.45)"}`,
            background:nightMode?"rgba(100,60,180,0.15)":"rgba(255,200,50,0.1)",
            color:nightMode?"#d4a8ff":"#7a3a00",
            fontSize:"0.78rem", letterSpacing:"0.08em", fontFamily:"inherit" }}>
          {nightMode?"☀ Day Mode":"🌙 Night Mode"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT — orchestrate all 3 screens
// ════════════════════════════════════════════════════════════════════════════
export default function HeartWall21() {
  const [screen, setScreen] = useState("lock"); // "lock" | "story" | "heart"

  if (screen === "lock")  return <SecretScreen  onUnlock={()=>setScreen("story")}/>;
  if (screen === "story") return <StoryScreen   onFinish={()=>setScreen("heart")}/>;
  return <HeartWallScreen />;
}
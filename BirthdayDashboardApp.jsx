import React, { useState, useEffect, useCallback, useRef } from "react";
import { surpriseChime } from "./main";

// ─── Config (customize these) ───
const NAME = "Boostuu";
const WELCOME_TOP = "Happy Birthday";
const WELCOME_SUB= "Boostuu❤️ "
const PHOTOS = ["/surprise.png"]; // Add more: "/photo1.jpg", "/photo2.jpg"
const SONG_URL = "/gemini_generated_media_6e914d71.mp3"; // Place this file in public/
const VOICE_URL = "/voice.mp3"; // Place voice.mp3 in public/ for voice message
const TIMELINE = [
  { date: "Chats & Smiles", title: "First Chat", emoji: "💬", desc: "We couldn't stop talking" },
  { date: "The Beginning", title: "First Meeting", emoji: "👀", desc: "The day our story began" },
  { date: "Memory Forever", title: "First Photo Together", emoji: "📸", desc: "Captured in time" },
  { date: "Growing Stronger", title: "First Fight 😄", emoji: "😤", desc: "We came back stronger" },
  { date: "Today", title: "Your Birthday ❤️", emoji: "🎂", desc: "Celebrating you" },
];

const REASONS = [
  "Your smile", "Your caring nature", "Your cute anger 😄", "Your voice",
  "The way you look at me", "Your laugh", 
  "Your silly side", "Everything about you", 
  "Your love", "Your honesty", "How you make me feel", "Your presence",
];

const PROMISES = [
  "I promise to always support you",
  "I promise to make you smile every day",
  "I promise to never leave your hand",
  "I promise to listen when you need me",
  "I promise to love you more each day",
];

const SPECIAL_MESSAGE = `You are the most special person in my life. Before you, my world was black and white. You brought color, music, and meaning. You changed how I see everything. I promise to stand by you, make you laugh, and love you with everything I have. Happy Birthday, my love.`;

const QUIZ_QUESTIONS = [
  { q: "What's my favorite thing about you?", d: 0, options: ["Your smile", "Your voice", "Your kindness", "Everything"] },
  { q: "When did we first meet?", d: 0, options: ["The best day", "A lucky day", "Fate", "Destiny"] },
  { q: "What do I promise you most?", c: 2, options: ["Gifts", "Trips", "Never to leave you", "Surprises"] },
];

// Typing effect hook
function useTyping(text, speed = 40, start = true) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setDisplay("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      if (i <= text.length) {
        setDisplay(text.slice(0, i));
        i++;
      } else {
        setDone(true);
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return { display, done };
}

// Countdown to birthday — customize BIRTHDAY_MONTH (0-11), BIRTHDAY_DAY
const BIRTHDAY_MONTH = 1; // February = 1 (0 = Jan)
const BIRTHDAY_DAY = 21;

function useCountdown() {
  const [state, setState] = useState({ isToday: false, days: 0, text: "" });
  useEffect(() => {
    const today = new Date();
    const bday = new Date(today.getFullYear(), BIRTHDAY_MONTH, BIRTHDAY_DAY);
    if (today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()) {
      setState({ isToday: true, text: "Today is your special day!" });
    } else if (bday < today) {
      const next = new Date(today.getFullYear() + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
      const d = Math.ceil((next - today) / 86400000);
      setState({ isToday: false, days: d, text: `${d} days until your next birthday!` });
    } else {
      const d = Math.ceil((bday - today) / 86400000);
      setState({ isToday: false, days: d, text: `${d} days until your birthday!` });
    }
  }, []);
  return state;
}

export default function BirthdayApp({ name }) {
  const displayName = name || NAME;
  const [showSurprise, setShowSurprise] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [revealText, setRevealText] = useState(false);
  const [heartClicks, setHeartClicks] = useState(0);
  const [hiddenMsg, setHiddenMsg] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const songAudioRef = useRef(null);
  const [showLoveMeter, setShowLoveMeter] = useState(false);
  const [loveBurst, setLoveBurst] = useState(false);

  const countdown = useCountdown();
  const { display: typedMsg, done: msgDone } = useTyping(SPECIAL_MESSAGE, 35, true);

  const toggleMusic = useCallback(() => {
    if (typeof Audio === "undefined") return;
    if (!songAudioRef.current) {
      songAudioRef.current = new Audio(SONG_URL);
      songAudioRef.current.addEventListener("ended", () => setMusicPlaying(false));
    }
    const audio = songAudioRef.current;
    try {
      if (musicPlaying) {
        audio.pause();
        setMusicPlaying(false);
      } else {
        audio.currentTime = 0;
        audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
      }
    } catch (e) {
      setMusicPlaying(false);
    }
  }, [musicPlaying]);

  useEffect(() => {
    if (revealText) {
      try {
        if (surpriseChime && typeof surpriseChime?.play === "function") {
          surpriseChime.currentTime = 0;
          surpriseChime.play().catch(() => {});
        }
        if (songAudioRef.current) {
          songAudioRef.current.currentTime = 0;
          songAudioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
        } else if (typeof Audio !== "undefined") {
          const audio = new Audio(SONG_URL);
          songAudioRef.current = audio;
          audio.addEventListener("ended", () => setMusicPlaying(false));
          audio.play().then(() => setMusicPlaying(true)).catch(() => {});
        }
        setShowFireworks(true);
      } catch (e) {}
    }
  }, [revealText]);

  const openSurprise = () => {
    setShowSurprise(true);
    setBoxOpen(false);
    setRevealText(false);
    setTimeout(() => setBoxOpen(true), 450);
    setTimeout(() => setRevealText(true), 950);
  };

  const onHeartClick = useCallback(() => {
    const next = heartClicks + 1;
    setHeartClicks(next);
    if (next >= 5) setHiddenMsg(true);
  }, [heartClicks]);

  const onQuizAnswer = (idx) => {
    if (QUIZ_QUESTIONS[quizIndex].a === idx) setQuizScore((s) => s + 1);
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true);
    else setQuizIndex((i) => i + 1);
  };

  return (
    <div className="birthday-page">
      {/* 1. WELCOME HERO */}
      <section className="welcome-hero">
        <div className="welcome-overlay" />
        <div className="welcome-content">
          <p className="welcome-pre">{WELCOME_TOP}</p>
          <h1 className="welcome-title">
            <span className="name-animate">{displayName}</span>
            <span className="heart-float" onClick={onHeartClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onHeartClick()}>❤️</span>
          </h1>
          <p className="welcome-sub">{WELCOME_SUB}</p>
        </div>
        <div className="float-balloons">
          {["🎈", "🎈", "❤️", "💕", "🎂", "✨"].map((s, i) => (
            <span key={i} className="balloon" style={{ "--delay": i * 0.5 + "s", "--x": (i % 3) * 30 + 10 + "%" }}>{s}</span>
          ))}
        </div>
        <a href="#message" className="scroll-hint">↓</a>
      </section>

      {/* 2. SPECIAL MESSAGE */}
      <section id="message" className="section message-section">
        <h2 className="section-title">💌 A Message for You</h2>
        <div className="message-card glass-card">
          <p className="typed-message">{typedMsg}<span className="cursor">|</span></p>
          {msgDone && VOICE_URL && (
            <a href={VOICE_URL} target="_blank" rel="noreferrer" className="btn btn-voice">🎙️ Listen to my voice message</a>
          )}
        </div>
      </section>

      {/* 3. PHOTO GALLERY */}
      <section className="section gallery-section">
        <h2 className="section-title">📸 Our Memories</h2>
        <div className="gallery">
          <div className="gallery-track" style={{ transform: `translateX(-${galleryIndex * 100}%)` }}>
            {PHOTOS.map((src, i) => (
              <div key={i} className="gallery-slide">
                <img src={src} alt={`Memory ${i + 1}`} />
                <span className="gallery-heart">💕</span>
              </div>
            ))}
          </div>
          {PHOTOS.length > 1 && (
            <div className="gallery-nav">
              {PHOTOS.map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} className={`gallery-dot ${i === galleryIndex ? "active" : ""}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. REASONS */}
      <section className="section reasons-section">
        <h2 className="section-title">❤️ Why I Love You</h2>
        <div className="reasons-grid">
          {REASONS.map((r, i) => (
            <div key={i} className="reason-card" style={{ animationDelay: i * 0.05 + "s" }}>
              <span className="reason-icon">❤️</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOVE TIMELINE */}
      <section className="section timeline-section">
        <h2 className="section-title">⏳ Our Journey</h2>
        <div className="timeline">
          {TIMELINE.map((e, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-emoji">{e.emoji}</span>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <small>{e.date}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FUTURE PROMISES */}
      <section className="section promises-section">
        <h2 className="section-title">🎯 My Promises to You</h2>
        <div className="promises-list">
          {PROMISES.map((p, i) => (
            <div key={i} className="promise-card">
              <span className="promise-check">✓</span>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SURPRISE BOX */}
      <section className="section surprise-section">
        <h2 className="section-title">🎁 Your Surprise</h2>
        <div className="surprise-cta">
          <button className="btn btn-primary btn-gift" onClick={openSurprise}>Open the Gift 💖</button>
        </div>
        {showSurprise && (
          <div className="gift-wrapper">
            <div className={`gift ${boxOpen ? "open" : ""}`}>
              <div className={`gift-lid ${boxOpen ? "lift" : ""}`} />
              <div className="gift-body">
                <div className="gift-ribbon-h" />
                <div className="gift-bow" />
              </div>
              <div className={`gift-content ${revealText ? "reveal" : ""}`}>
                <img src={PHOTOS[0]} alt="Surprise" className="surprise-photo" />
                <h2>🎉 Surprise! 🎉</h2>
                <p>{displayName}, you are the best thing that ever happened to me. I promise to always make you smile 💕</p>
              </div>
              <div className={`confetti ${revealText ? "burst" : ""}`}>
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = Math.random() * 120 - 60;
                  const dist = 150 + Math.random() * 200;
                  const x = Math.round(Math.cos((angle * Math.PI) / 180) * dist);
                  const y = Math.round(Math.sin((angle * Math.PI) / 180) * -dist - 60);
                  const colors = ["#ec4899","#f59e0b","#22d3ee","#a78bfa","#f97316","#34d399","#f472b6","#8b5cf6"];
                  return <span key={i} className="confetti-piece" style={{ "--x": x + "px", "--y": y + "px", "--d": Math.random() * 300 + "ms", background: colors[i % colors.length], borderRadius: i % 3 === 0 ? "50%" : "2px" }} />;
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 8. MUSIC - Add song.mp3 to public/ folder */}
      {SONG_URL && (
        <section className="section music-section">
          <h2 className="section-title">🎶 For You</h2>
          <div className="music-card">
            <button className="btn-music" onClick={toggleMusic} type="button">
              {musicPlaying ? "⏸️ Pause" : "🎵 Play our song"}
            </button>
          </div>
        </section>
      )}

      {/* 9. COUNTDOWN */}
      <section className="section countdown-section">
        <h2 className="section-title">{countdown.isToday ? "🎂" : "⏳"}</h2>
        <p className="countdown-text">{countdown.isToday ? "Today is your special day!" : countdown.text}</p>
      </section>

      {/* 10. QUIZ */}
      <section className="section quiz-section">
        <h2 className="section-title">🧠 How Well Do You Know Me?</h2>
        {!quizDone ? (
          <div className="quiz-card">
            <p className="quiz-q">{QUIZ_QUESTIONS[quizIndex]?.q}</p>
            <div className="quiz-options">
              {QUIZ_QUESTIONS[quizIndex]?.options.map((opt, i) => (
                <button key={i} className="btn quiz-opt" onClick={() => onQuizAnswer(i)}>{opt}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-result">
            <p>You got {quizScore}/{QUIZ_QUESTIONS.length} right! 💕</p>
          </div>
        )}
      </section>

      {/* 11. LOVE METER (secret - click to reveal) */}
      <section className="section love-meter-section">
        {loveBurst && (
          <div className="love-burst" aria-hidden="true">
            {["❤️", "💕", "💖", "💗", "💓", "💘", "💝", "❤️", "💕", "💖"].map((h, i) => (
              <span key={i} className="love-burst-piece" style={{ "--i": i }}>{h}</span>
            ))}
          </div>
        )}
        {!showLoveMeter ? (
          <button
            type="button"
            className="love-meter-secret"
            onClick={() => {
              setLoveBurst(true);
              setTimeout(() => setLoveBurst(false), 1400);
              setTimeout(() => setShowLoveMeter(true), 500);
            }}
            aria-label="Reveal secret"
          >
            <span className="love-meter-secret-icon">💕</span>
          </button>
        ) : (
          <>
            <h2 className="section-title">💖 Love Meter</h2>
            <div className="love-meter">
              <div className="love-meter-fill" style={{ width: "100%" }} />
              <span className="love-meter-text">100%</span>
            </div>
          </>
        )}
      </section>

      {/* 12. HIDDEN MESSAGE */}
      {hiddenMsg && (
        <div className="hidden-msg-overlay" onClick={() => setHiddenMsg(false)}>
          <div className="hidden-msg">You found the secret! I love you more than words can say. Forever yours. 💕</div>
        </div>
      )}

      {/* FIREWORKS */}
      {showFireworks && (
        <div className="fireworks" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="firework" style={{ left: (i * 20 + 10) + "%", animationDelay: i * 0.3 + "s" }} />
          ))}
        </div>
      )}

      {/* FINAL NOTE */}
      <footer className="final-note">
        <p className="final-text">"You are my today and all my tomorrows."</p>
        <p className="final-sign">— Forever yours, with love</p>
        <span className="footer-hearts">♥ ♥ ♥</span>
      </footer>
    </div>
  );
}

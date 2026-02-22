import React, { useState, useEffect, useRef } from "react";

const SECRET = "Boostuu";

const presets = [
  "Happy Birthday to the most beautiful person in my life! You make my world brighter every day 🌸✨",
  "Wishing you a day filled with love, laughter, and all your favorite things 🎂💐",
  "To my soulmate — every moment with you is a gift. Happy Birthday! 💖",
  "Cheers to you and the joy you bring — have an amazing birthday! 🥂🎉",
];

const slideBackgrounds = [
  "linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbc2eb 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)",
];

export default function EntryPage({ onEnter }) {
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (!unlocked) return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, presets.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlocked]);

  function tryUnlock() {
    if (password === SECRET) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect — try again");
    }
  }

  function handleEnter() {
    onEnter({ name: name || "My Love", message: presets[index], photo });
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let moving = false;
    function onPointerDown(e) {
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      moving = true;
    }
    function onPointerMove(e) {
      if (!moving) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const dx = x - startX;
      if (dx > 80) {
        setIndex((i) => Math.max(i - 1, 0));
        moving = false;
      } else if (dx < -80) {
        setIndex((i) => Math.min(i + 1, presets.length - 1));
        moving = false;
      }
    }
    function onPointerUp() {
      moving = false;
    }
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % presets.length);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [unlocked]);

  return (
    <div className="entry-page">
      <div className="glass-card entry-card fade-in">
        <div className="topbar">
          <div>
            <h2>✨ Welcome — Enter the Secret</h2>
            <p className="subtitle">
              Unlock your surprise, pick a message, and add a photo to continue
            </p>
          </div>
          <div>
            <button
              className="back-btn"
              onClick={() => {
                setPassword("");
                setUnlocked(false);
                setError("");
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        {!unlocked ? (
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the secret word"
              className="input-field"
              style={{ marginBottom: 16 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <button onClick={tryUnlock} className="btn btn-primary" type="button">
                Unlock ✨
              </button>
              {error && <span style={{ color: "#dc2626", fontSize: 14 }}>{error}</span>}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, marginBottom: 20 }} className="entry-grid">
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#374151" }}>
                  Their name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#374151" }}>
                  Add a photo (optional)
                </label>
                <PhotoUploader onChange={setPhoto} />
              </div>
            </div>

            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14, color: "#374151" }}>
              Choose your message
            </label>
            <div className="carousel-wrapper" ref={containerRef}>
              <div
                className="carousel-track"
                style={{
                  width: `${presets.length * 100}%`,
                  transform: `translateX(-${index * (100 / presets.length)}%)`,
                }}
              >
                {presets.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      flex: `0 0 ${100 / presets.length}%`,
                      padding: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      className={`carousel-slide ${i === index ? "active" : ""}`}
                      style={{ background: slideBackgrounds[i % slideBackgrounds.length] }}
                    >
                      {p}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                  className="btn btn-ghost"
                  disabled={index === 0}
                  type="button"
                >
                  ←
                </button>
                <button
                  onClick={() => setIndex((i) => Math.min(i + 1, presets.length - 1))}
                  className="btn btn-ghost"
                  disabled={index === presets.length - 1}
                  type="button"
                >
                  →
                </button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {presets.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className="nav-dot"
                    style={{ background: i === index ? "#ec4899" : "#e5e7eb" }}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleEnter} className="btn btn-primary" type="button">
                Enter the surprise 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoUploader({ onChange }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    onChange(url);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        border: "2px dashed #e5e7eb",
        borderRadius: 12,
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.25s, background 0.25s",
        background: preview ? "transparent" : "rgba(0,0,0,0.02)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#ec4899";
        e.currentTarget.style.background = "rgba(236,72,153,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.background = preview ? "transparent" : "rgba(0,0,0,0.02)";
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      {preview ? (
        <img src={preview} alt="Preview" style={{ maxHeight: 80, borderRadius: 8, objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: 13, color: "#9ca3af" }}>📷 Click to add photo</span>
      )}
    </div>
  );
}

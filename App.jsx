import React, { useState } from "react";
import BirthdayApp from "./BirthdayDashboardApp";

const PASSWORD = "Boostuu";

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [justUnlocked, setJustUnlocked] = useState(false);

  function handleUnlock(e) {
    e?.preventDefault();
    if (password.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      setJustUnlocked(true);
      setTimeout(() => setUnlocked(true), 600);
      setError("");
    } else {
      setError("Not quite — try again");
      setTimeout(() => setError(""), 2000);
    }
  }

  if (!unlocked) {
    return (
      <>
        <div className="bg-canvas" aria-hidden="true">
          <div className="blob a" />
          <div className="blob b" />
          <div className="blob c" />
          <div className="blob d" />
          <span className="float-heart">❤️</span>
          <span className="float-heart">💕</span>
          <span className="float-heart">💖</span>
          <span className="float-heart">✨</span>
          <span className="float-heart">🌸</span>
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
        </div>
        <div className={`unlock-screen ${justUnlocked ? "unlock-success" : ""}`}>
          <div className="glass-card unlock-card fade-in">
            <div className="unlock-icon">🔐</div>
            <h2 className="unlock-title">Your surprise awaits</h2>
            <p className="unlock-subtitle">Whisper the magic word to continue</p>
            <form onSubmit={handleUnlock}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="..."
                className="input-field unlock-input"
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary unlock-btn">
                Unlock 🎁
              </button>
              {error && <p className="unlock-error">{error}</p>}
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-canvas" aria-hidden="true">
        <div className="blob a" />
        <div className="blob b" />
        <div className="blob c" />
        <div className="blob d" />
        <span className="float-heart">❤️</span>
        <span className="float-heart">💕</span>
        <span className="float-heart">💖</span>
        <span className="float-heart">✨</span>
        <span className="float-heart">🌸</span>
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
      </div>
      <BirthdayApp name="Boostuu" />
    </>
  );
}

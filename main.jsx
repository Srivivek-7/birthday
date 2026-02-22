import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Place chime.mp3, song.mp3, voice.mp3 in public/ to use
export const surpriseChime = typeof Audio !== "undefined" ? new Audio("/chime.mp3") : null;

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

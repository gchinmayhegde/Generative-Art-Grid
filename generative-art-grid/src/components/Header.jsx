import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Header({ theme, setTheme }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">🎨 Generative Art Grid</h1>
        <p className="text-sm text-white/60">A tiny creative engine — moving lights, waveforms & soft grains</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-white/60 mr-2">Theme</div>
        <button
          className="p-2 rounded-md glass hover:scale-105 transition-transform"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-500" />}
        </button>
      </div>
    </div>
  );
}

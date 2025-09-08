import React, { useEffect, useState } from "react";
import Home from "./pages/Home";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Global keyboard shortcuts (non-input specific)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName.toLowerCase() === 'input') return;
      
      // Theme toggle with T key
      if (e.key === 't' || e.key === 'T') {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return <Home theme={theme} setTheme={setTheme} />;
}
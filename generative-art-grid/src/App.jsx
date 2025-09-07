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

  return <Home theme={theme} setTheme={setTheme} />;
}

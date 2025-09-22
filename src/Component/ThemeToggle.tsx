"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
<button
  onClick={toggleTheme}
  className={`theme-toggle relative w-16 h-8 rounded-full transition-colors duration-500 focus:outline-none border ${
    theme === "light"
      ? "border-gray-300 bg-[#E5C8FF]"
      : "border-gray-700 bg-black"
  }`}
>
  <span
    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 flex items-center justify-center ${
      theme === "dark" ? "translate-x-8 text-yellow-300" : "text-yellow-400"
    }`}
  >
    {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
  </span>
</button>

  );
}

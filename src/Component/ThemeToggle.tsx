"use client";

import { useAuth } from "@/app/context/authcontext";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  // Read initial theme from localStorage or system preference. This runs on the client
  // because this is a client component ("use client").
  const getInitialTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  };

  const [mountedTheme, setMountedTheme] = useState<"light" | "dark">(() => getInitialTheme());
  const { setTheme} = useAuth();
  // const [theme, setTheme] = useState<"light" | "dark">(() => getInitialTheme());

  // Apply or remove the `dark` class whenever theme changes.
  useEffect(() => {
    if (mountedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mountedTheme);
    if (mountedTheme){
       setTheme(mountedTheme as "light" | "dark");
    }
  }, [mountedTheme]);

  const toggleTheme = () => {
    setMountedTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
<button
  onClick={toggleTheme}
  className={`theme-toggle relative w-16 h-8 rounded-full transition-colors duration-500 focus:outline-none border ${
    mountedTheme === "light"
      ? "border-gray-300 bg-[#E5C8FF]"
      : "border-gray-700 bg-black"
  }`}
>
  <span
    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 flex items-center justify-center ${
      mountedTheme === "dark" ? "translate-x-8 text-yellow-300" : "text-yellow-400"
    }`}
  >
    {mountedTheme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
  </span>
</button>

  );
}

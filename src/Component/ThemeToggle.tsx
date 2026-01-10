"use client";

import { useAuth } from "@/app/context/authcontext";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [mountedTheme, setMountedTheme] = useState<"light" | "dark">("light");
  const { setTheme } = useAuth();

  // Initialize theme after mounting to avoid hydration mismatch
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    let initialTheme: "light" | "dark" = "light";
    if (stored === "light" || stored === "dark") {
      initialTheme = stored;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark";
    }
    setMountedTheme(initialTheme);
    setMounted(true);
  }, []);

  // Apply or remove the `dark` class whenever theme changes.
  useEffect(() => {
    if (!mounted) return;
    if (mountedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mountedTheme);
    setTheme(mountedTheme as "light" | "dark");
  }, [mountedTheme, mounted, setTheme]);

  const toggleTheme = () => {
    setMountedTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // Render a placeholder with the same dimensions during SSR to avoid layout shift
  if (!mounted) {
    return (
      <button
        className="theme-toggle relative w-16 h-8 rounded-full transition-colors duration-500 focus:outline-none border border-gray-300 bg-[#E5C8FF]"
        aria-label="Toggle theme"
      >
        <span className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md" />
      </button>
    );
  }

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

"use client";
import { useAuth } from "@/app/context/authcontext";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string; // optional extra classes
  gradient?: string; // optional custom gradient
}

export default function Card({
  children,
  className = "",
}: // gradient = "linear-gradient(to right, #FF2670, #724B99)",
CardProps) {
  const { theme } = useAuth();

  let gradient = "linear-gradient(to right, #FF2670, #724B99)";
  if (theme === "dark") {
    gradient = "linear-gradient(to right, #261933, #724B99)";
  }
  return (
    <div
      className={`
        rounded-2xl shadow-md p-6  text-white 
        ${className}
      `}
      style={{ background: gradient }}
    >
      {children}
    </div>
  );
}

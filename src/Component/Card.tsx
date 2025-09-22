"use client";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string; // optional extra classes
  gradient?: string;  // optional custom gradient
}

export default function Card({
  children,
  className = "",
  gradient = "linear-gradient(to right, #FF2670, #724B99)",
}: CardProps) {
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

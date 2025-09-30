"use client";

import { motion } from "framer-motion";

export default function Spinner({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  const letters = ["D", "O", "T", "J", "O", "B", "S"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex space-x-1 text-3xl font-bold text-white tracking-wider">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ y: [-6, 0, -6], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

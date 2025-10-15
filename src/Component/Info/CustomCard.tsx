"use client";
import { motion } from "framer-motion";

export function CustomCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg p-6 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}

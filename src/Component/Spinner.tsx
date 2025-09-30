"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Spinner({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [-20, 20, -20] }} // 👈 moves left → right → left
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-20 h-20"
      >
        <Image
          src="/Images/logo.png" // 👈 replace with your logo path
          alt="DOTJOBS Logo"
          width={80}
          height={80}
          priority
        />
      </motion.div>
    </div>
  );
}

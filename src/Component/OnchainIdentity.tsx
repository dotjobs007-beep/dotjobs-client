"use client";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OnchainIdentity() {
  const { theme } = useAuth();

  const bgColor =
    theme === "dark" ? "bg-[#261933] text-white" : "bg-[#DD0075] text-black";
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        key="step4"
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className={`p-6 ${bgColor} rounded-lg shadow-md max-w-md w-full text-center`}
      >
        <h2 className="text-xl font-semibold mb-4">Verification</h2>
        <p className="text-xs mb-6">
          To maintain quality, we require identity verification through Polka
          Identity or Polkassembly.
        </p>
        <div className="space-y-4">
          <Link
            href="/jobs/verify_identity"
            className="block w-full text-center bg-white text-[#7A2E7A] font-semibold rounded-lg py-2 hover:bg-gray-100 transition"
          >
            Verify Identity
          </Link>


          <Link
            href="/learn_more"
            className="block w-full text-center bg-white text-[#7A2E7A] font-semibold rounded-lg py-2 hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

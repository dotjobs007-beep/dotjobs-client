"use client";

import { useAuth } from "@/app/context/authcontext";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Card from "../Card";

export default function PolkadotInfo() {
  const { theme } = useAuth();

  const steps = [
    {
      title: "Step 1. Report UX issues",
      description:
        "Find something broken, inconsistent, or unclear? Let the UX bounty know!",
    },
    {
      title: "Step 2. Curators review",
      description:
        "UX Bounty curators will evaluate and assign a value for your identified issue.",
    },
    {
      title: "Step 3. Earn DOT rewards",
      description:
        "Get rewarded for improving Polkadot UX when reported issues are approved.",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-b from-white to-pink-50 text-gray-800"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Help shape <span className={theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}>Polkadot</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Report UX issues, improve communication across the network, and earn
          <span className={`font-semibold ${theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}`}> DOT</span> for your
          contributions!
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 max-w-3xl w-full">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card>
              <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}`}>
                {step.title}
              </h2>
              <p className="text-sm opacity-90">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors w-full sm:w-auto"
          onClick={() => window.open("https://report.uxbounty.xyz/", "_blank")}
        >
          Check Here <ExternalLink className="inline-block h-4 w-4 ml-1" />
        </button>
        <button
          className="px-6 py-3 flex justify-between items-center border border-pink-500 text-pink-500 rounded-lg shadow-md hover:bg-pink-500 hover:text-white transition-colors w-full sm:w-auto"
          onClick={() =>
            window.open(
              "https://x.com/polkadotux/status/1976623448459026941?s=46",
              "_blank"
            )
          }
        >
          Official Announcement <ExternalLink className="h-4 w-4 ml-3" />
        </button>
      </motion.div>
    </div>
  );
}

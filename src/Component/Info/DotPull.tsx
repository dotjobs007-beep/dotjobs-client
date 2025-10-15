"use client";

import { useAuth } from "@/app/context/authcontext";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Card from "../Card";

export default function DotBullsInfo() {
  const { theme } = useAuth();

  const ranks = [
    {
      title: "🥇 Rank 1",
      tasks: [
        "Be active and add value (no spam or random chats)",
        "Share useful Polkadot updates from diverse, trusted sources",
      ],
      perks:
        "Private channel access, verified badge, and recognition + Monthly Dot rewards",
    },
    {
      title: "🥈 Rank 2",
      tasks: [
        "Do all Rank 1 tasks",
        "Create original, engaging content",
        "Help others by answering questions on the Help Desk",
        "Drive healthy discussions and fight FUD across platforms",
      ],
      perks: "All Rank 1 perks + more visibility and Dot rewards",
    },
    {
      title: "🥉 Rank 3 (2 slots)",
      tasks: [
        "Do all Rank 2 tasks",
        "Champion Reddit engagement, onboard newcomers, and promote events",
      ],
      perks:
        "Strategic input, mod-level recognition, and top-tier Dot rewards",
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
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          🐂 DotBulls <span className={theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}>Program</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          A community-driven movement powered by believers who bring energy,
          positivity, and helpfulness to the Polkadot ecosystem.
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400">
          It all happens inside the{" "}
          <span className={`font-semibold ${theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}`}>
            Polkadot Telegram
          </span>{" "}
          — no forms, no gatekeeping. Just good energy and real impact.
        </p>
        <p className="italic text-sm text-gray-500 dark:text-gray-400">
          The DotBulls Program celebrates and rewards members who add genuine
          value and spread authentic Polkadot updates.
        </p>
      </motion.div>

      {/* Ranks Section */}
      <div className="mt-12 grid gap-6 max-w-3xl w-full">
        {ranks.map((rank, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card>
              <h2
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
                }`}
              >
                {rank.title}
              </h2>
              <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                {rank.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-medium italic opacity-90">
                Perks: {rank.perks}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-3xl mt-10"
      >
        <Card className="border border-red-400/40 bg-red-50 dark:bg-red-950/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ Spamming or chit-chatting outside context leads to disqualification.
          </p>
        </Card>
      </motion.div>

      {/* Join Button */}
      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors w-full sm:w-auto"
          onClick={() =>
            window.open("https://t.me/PolkadotOfficial/1", "_blank")
          }
        >
          Join Here <ExternalLink className="inline-block h-4 w-4 ml-1" />
        </button>
      </motion.div>
    </div>
  );
}

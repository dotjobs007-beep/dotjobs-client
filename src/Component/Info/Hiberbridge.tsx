"use client";

import { useAuth } from "@/app/context/authcontext";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Card from "../Card";

export default function HiberbridgeInfo() {
  const { theme } = useAuth();

  const tasks = [
    {
      title: "🎯 Basic Participation",
      description: "Complete all tasks to qualify for the raffle draw",
      tasks: [
        "Join the Sovereign Journey on Airlyft",
        "Complete all assigned tasks",
        "Stand among the lucky winners for $50",
      ],
      reward: "Enter the $50 raffle (10 active participants will win)",
    },
    {
      title: "🚀 Enhanced Participation",
      description: "Want a better shot at winning $50? Go beyond basic quests",
      tasks: [
        "Write a short thread about your experience",
        "Create a meme related to Hyperbridge",
        "Record a clip sharing your journey",
        "Share your experience across platforms",
        "Tag Hyperbridge in your content - creativity counts!",
      ],
      reward: "Higher chances of winning + community recognition",
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
          🌉 Hyperbridge <span className={theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}>Sovereign Journey</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          The Sovereign Journey starts now.
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Over the next few weeks, we'll explore the meaning of{" "}
          <span className={`font-semibold ${theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"}`}>
            Sovereignty
          </span>{" "}
          , beginning with the heart of it all: Hyperbridge.
        </p>
        <p className="italic text-sm text-gray-500 dark:text-gray-400">
          Be part of the movement. The first step to sovereignty starts here.
        </p>
      </motion.div>

      {/* Tasks Section */}
      <div className="mt-12 grid gap-6 max-w-3xl w-full">
        {tasks.map((task, i) => (
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
                {task.title}
              </h2>
              <p className="text-sm opacity-80 mb-3">{task.description}</p>
              <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                {task.tasks.map((taskItem, index) => (
                  <li key={index}>{taskItem}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-medium italic opacity-90">
                Reward: {task.reward}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reward Highlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mt-8"
      >
        <Card className="border border-green-400/40 bg-green-50 dark:bg-green-950/20">
          <p className="text-sm text-green-600 dark:text-green-400 text-center">
            💰 10 active participants will win $50 each in a raffle
          </p>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors w-full sm:w-auto"
          onClick={() =>
            window.open("https://airlyft.one/hyperbridge/sovereign-journey-genesis", "_blank")
          }
        >
          Start Sovereign Journey <ExternalLink className="inline-block h-4 w-4 ml-1" />
        </button>
        <button
          className="px-6 py-3 border border-pink-500 text-pink-500 rounded-lg shadow-md hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors w-full sm:w-auto"
          onClick={() =>
            window.open("https://x.com/hyperbridge/status/1983606625203081595?s=46", "_blank")
          }
        >
          Official Announcement <ExternalLink className="inline-block h-4 w-4 ml-1" />
        </button>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-3xl mt-8"
      >
        <Card className="text-center">
          <p className="text-lg font-medium mb-2">
            Join the Sovereign Journey, complete your quests, and make your intent known.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            There's much more coming. 🚀
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useAuth } from "@/app/context/authcontext";
import { CheckCircle, Users, Shield, BookOpen } from "lucide-react";

export default function About() {
  const { theme } = useAuth();
  return (
    <section
      className={`w-full py-16 px-6 lg:px-24  ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2
          className={`text-3xl lg:text-4xl font-bold mb-4 ${
            theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
          }`}
        >
          About DotJobs
        </h2>
        <p className="text-lg ">
          Dotjobs is an open-source job and talent platform built for the
          <span
            className={`font-semibold ${
              theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
            }`}
          >
            {" "}
            Polkadot and Kusama ecosystem
          </span>
          . Our mission is simple: to connect projects, teams, and initiatives
          across the ecosystem with the right talent, while amplifying careers,
          opportunities, and the future of work in Web3.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-12">
        <p className="text-lg leading-relaxed text-center">
          We believe the future of work is decentralized, collaborative, and
          borderless. Dot Jobs is more than a job board it is a{" "}
          <span
            className={`font-semibold ${
              theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
            }`}
          >
            career hub for the ecosystem
          </span>
          , unifying opportunities and talent under one open platform.
        </p>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ecosystem-Wide Opportunities */}
          <div className="flex flex-col items-start bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <Users
              className={`h-10 w-10 ${
                theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
              } mb-4`}
            />
            <h3 className="text-xl font-semibold mb-2">
              Ecosystem-Wide Opportunities
            </h3>
            <p className="text-gray-600 text-sm">
              Aggregate and showcase roles from Rollups, DAOs, Projects and
              ecosystem teams connecting talent with meaningful opportunities
              across Polkadot and Kusama.
            </p>
          </div>

          {/* On-Chain Identity */}
          <div className="flex flex-col items-start bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <Shield
              className={`h-10 w-10 ${
                theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
              } mb-4`}
            />
            <h3 className="text-xl font-semibold mb-2">On-Chain Identity</h3>
            <p className="text-gray-600 text-sm">
              Users verify their identity through Polka Identity and
              Polkassembly, with their verification status displayed directly on
              their DotJobs profile.
            </p>
          </div>

          {/* Awareness & Education */}
          <div className="flex flex-col items-start bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <BookOpen
              className={`h-10 w-10 ${
                theme === "dark" ? "text-[#7F13EC]" : "text-[#AE1E67]"
              } mb-4`}
            />
            <h3 className="text-xl font-semibold mb-2">
              Awareness & Education
            </h3>
            <p className="text-gray-600 text-sm">
              Grow the talent base with education campaigns, AMAs with founders,
              and initiatives spotlighting career growth in Web3.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

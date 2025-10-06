"use client";

import { useAuth } from "@/app/context/authcontext";

export default function Roadmap() {
    const { theme } = useAuth();
  return (
    <div className="min-h-screen py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            DotJobs Roadmap
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: 1st October, 2025
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Q1 2025 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q1 2025 — Idea Generation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Laying the foundation</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Defined the vision and mission for DotJobs.</li>
              <li>Researched the Polkadot & Kusama job landscape.</li>
              <li>Identified key challenges and ecosystem needs.</li>
              <li>Outlined the open-source direction and long-term goals.</li>
            </ul>
          </section>

          {/* Q2 2025 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q2 2025 — Team Formation & Refinement
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Building structure and clarity</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Assembled the core founding, design, and development team.</li>
              <li>Refined product goals and roadmap based on early feedback.</li>
              <li>Designed user experience flow and platform architecture.</li>
              <li>Prepared documentation and open-source framework.</li>
            </ul>
          </section>

          {/* Q3 2025 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q3 2025 — Core Platform Development
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Bringing the vision to life</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>First phase of DotJobs development begins.</li>
              <li>Built and integrated core features:</li>
              <ul className="list-circle pl-8 space-y-1">
                <li>Find Jobs</li>
                <li>My Jobs</li>
                <li>My Applications</li>
                <li>Onchain Identity Verification</li>
              </ul>
              <li>Enabled wallet connections (Nova Wallet, SubWallet, etc.).</li>
              <li>Developed the initial UI/UX design for both employers and job seekers.</li>
            </ul>
          </section>

          {/* Q4 2025 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q4 2025 — Testing & Public Launch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Going live and listening</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Conducted internal and community testing.</li>
              <li>Launched DotJobs Beta publicly.</li>
              <li>Collected user and community feedback.</li>
              <li>Released updates and improvements based on feedback.</li>
              <li>Onboarded ecosystem partners and initial employers.</li>
            </ul>
          </section>

          {/* Q1 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q1 2026 — Governance & Growth
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Empowering the community</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Introduced community governance and voting system.</li>
              <li>Strengthened community building through campaigns and programs.</li>
              <li>Formed major collaborations across the Polkadot ecosystem.</li>
              <li>Expanded brand awareness and contributor participation.</li>
            </ul>
          </section>

          {/* Q2 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q2 2026 — Freelance & Expansion Phase
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Evolving from jobs to full-scale talent economy</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Began development of the Freelance Marketplace.</li>
              <li>Introduced categories for remote work, tasks, and bounties.</li>
              <li>Hosted workshops, educational sessions, and career events.</li>
              <li>Enhanced platform integrations and ecosystem reach.</li>
            </ul>
          </section>

          {/* Q3 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q3 2026 — Freelance Marketplace Launch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Delivering the next frontier</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Completed development and testing of the Freelance Marketplace.</li>
              <li>Officially launched freelance and bounty modules.</li>
              <li>Introduced new payment options and on-chain contract workflows.</li>
              <li>Strengthened user profiles with skill verification and reputation scoring.</li>
              <li>Collaborated with ecosystem teams to pilot freelance projects.</li>
            </ul>
          </section>

          {/* Q4 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q4 2026 — Optimization & Ecosystem Expansion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Scaling and improving</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Gathered post-launch data and performance feedback.</li>
              <li>Rolled out major UX/UI improvements and scalability updates.</li>
              <li>Expanded multi-chain and cross-ecosystem integrations.</li>
              <li>Introduced incentive programs and community-driven initiatives.</li>
              <li>Continued ecosystem partnerships and long-term sustainability planning.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

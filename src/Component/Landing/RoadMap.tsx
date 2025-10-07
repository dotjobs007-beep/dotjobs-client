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
              <li>Defined the vision and mission for DotJobs (formerly Freelance Web3)</li>
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
              <li>Develop and integrate DAO-style governance, allowing the community to vote on featured job listings as well as key platform and feature update decisions, all powered by Polkadot technology.</li>
              <li>Launch the community governance and voting system.</li>
              <li>Strengthen community building through targeted campaigns and contributor programs.</li>
              <li>Form strategic collaborations across the Polkadot ecosystem.</li>
              <li>Expand brand visibility and community participation.</li>
              <li>Integrate Notifications for “New jobs matching your profile” alerts.</li>
            </ul>
          </section>

          {/* Q2 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q2 2026 — Freelance & Expansion Phase
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Evolving from jobs to a full-scale talent economy
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Begin development of the Freelance Marketplace.</li>
              <li>Integrate In-Platform Chat for real-time communication between potential employees and employers.</li>
              <li>Host workshops, educational sessions, and career development events.</li>
              <li>Enhance platform integrations and expand ecosystem partnerships.</li>
            </ul>
          </section>

          {/* Q3 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q3 2026 — Freelance Marketplace Launch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Delivering the next frontier</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Complete development and testing of the Freelance Marketplace.</li>
              <li>Officially launch the Freelance Marketplace.</li>
              <li>Integrate Escrow payments for the freelance marketplace via Asset Hub pallets, enabling gigs and bounties to be paid directly through users’ wallets.</li>
              <li>Introduce new payment options and on-chain contract workflows.</li>
              <li>Strengthen user profiles with skill verification and reputation scoring.</li>
              <li>Collaborate with ecosystem teams to pilot freelance projects and bounties.</li>
            </ul>
          </section>

          {/* Q4 2026 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q4 2026 — Optimization & Ecosystem Expansion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Scaling and improving</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Collect post-launch performance data and community feedback.</li>
              <li>Implement major UX/UI improvements and scalability updates.</li>
              <li>Introduce job boosting/promotion fees, posting fees, and multiple application fees to support platform sustainability.</li>
              <li>Continue expanding partnerships and community-led initiatives for long-term growth.</li>
            </ul>
          </section>

          {/* Q1 2027 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Q1 2027 — Intelligence & Experience Phase
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Automating and enhancing opportunities</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Integrate AI-powered job posting and matching, enabling smarter connections between talent and projects.</li>
              <li>Introduce Simulated Job Experience modules for learners and new contributors.</li>
              <li>Launch Volunteering Job Offers to support community growth and ecosystem participation.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

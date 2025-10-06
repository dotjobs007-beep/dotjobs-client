"use client";
import { useAuth } from "@/app/context/authcontext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";

export default function OnchainIdentityVerification() {
  const { theme } = useAuth();
  const color = theme === "dark" ? "text-[#7F13EC]" : "text-[#DD0075]";
  const router = useRouter();
  return (
    <div className="min-h-screen flex justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8"
      >
      <div className="flex items-center justify-between mb-6">
          {/* Page Title */}
        <h1 className={`text-3xl font-bold text-center ${color}`}>
          Onchain Identity Verification
        </h1>

        <MdCancel className={`text-2xl ${color} cursor-pointer`} onClick={() => router.back()} />
      </div>

        {/* Intro */}
        <p className="text-gray-700 mb-8 text-sm leading-relaxed">
          Onchain identity verification on{" "}
          <span className="font-semibold">Polkadot</span>
          allows users to associate personal information (such as display name,
          legal name, website, and social handles) with their blockchain account
          and have this information verified by trusted entities called{" "}
          <span className="font-semibold">registrars</span>.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          <Section
            title="How Onchain Identity Verification Works"
            content={[
              {
                heading: "1. Setting an Identity",
                text: "Users add their personal information (display name, legal name, website, and social handles) to their on-chain account. A small amount of DOT is reserved as a bond to store this information (locked, not spent, and returned if cleared).",
              },
              {
                heading: "2. Requesting Judgement",
                text: "After setting an identity, users request a judgement from a registrar. Registrars verify the details, and users specify the maximum fee they’re willing to pay. The transaction is submitted on the People system chain (dedicated for identity management).",
              },
              {
                heading: "3. Verification by Registrar",
                text: "Registrars may ask for additional proof (like social handle authorization or documents). Once satisfied, they assign a judgement level — e.g., 'Reasonable' or 'Known Good'.",
              },
              {
                heading: "4. Judgement Status",
                text: "Once verified, a green checkmark appears next to the account name. If identity fields change later, the process must be repeated.",
              },
            ]}
          />

          {/* Key Points */}
          <Section
            title="Key Points"
            content={[
              {
                text: "The process is public and transparent; all data and judgements are visible on-chain.",
              },
              {
                text: "Only registrars can provide official verification (judgement).",
              },
              {
                text: "It increases trust and accountability in the Polkadot ecosystem.",
              },
              {
                text: "Identities are managed on the People system parachain, not the Polkadot relay chain.",
              },
            ]}
          />

          {/* Steps */}
          <Section
            title="Steps to Verify Your Identity (via Polkassembly)"
            content={[
              {
                heading: "Step 1",
                text: "Choose the address you would like to set your identity for.",
              },
              {
                heading: "Step 2",
                text: "Ensure you have the minimum balance, then add display name, legal name & social identities. Sign the transaction to add identity data, then request judgement.",
              },
              {
                heading: "Step 3",
                text: "Authorize / prove access to your social handles via basic web2 authorization flows.",
              },
              {
                heading: "Step 4",
                text: "Once you receive judgement, a green checkmark appears next to your name across the site.",
              },
            ]}
          />
        </div>
      </motion.div>
    </div>
  );
}

function Section({
  title,
  content,
}: {
  title: string;
  content: { heading?: string; text: string }[];
}) {
  const { theme } = useAuth();
  const color = theme === "dark" ? "text-[#7F13EC]" : "text-[#DD0075]";

  return (
    <div>
      <h2 className={`text-xl font-semibold ${color} mb-4`}>{title}</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {content.map((item, idx) => (
          <li key={idx}>
            {item.heading && (
              <p className="font-semibold text-gray-900">{item.heading}</p>
            )}
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useAuth } from "@/app/context/authcontext";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Megaphone,
  Award,
  Rocket,
  Heart,
  Star,
  Zap,
  Target,
  Gift,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

export default function Ambassador() {
  const { theme } = useAuth();

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";
  const bgCard = theme === "dark" ? "bg-[#1A0330]/80" : "bg-white/90";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const borderColor = theme === "dark" ? "border-[#7F13EC]/30" : "border-[#AE1E67]/20";

  const benefits = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Exclusive Rewards",
      description:
        "Earn DOT tokens, exclusive NFTs, and special merchandise for your contributions to the ecosystem.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Access",
      description:
        "Join a private network of passionate community leaders and get direct access to the DotJobs team.",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Early Access",
      description:
        "Be the first to test new features, provide feedback, and shape the future of DotJobs.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Recognition",
      description:
        "Get featured on our website, social media, and earn a verified Ambassador badge on your profile.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description:
        "Connect with Web3 professionals, projects, and opportunities from around the world.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Skill Development",
      description:
        "Enhance your skills in community management, marketing, and blockchain through hands-on experience.",
    },
  ];

  const responsibilities = [
    "Promote DotJobs across social media platforms and Web3 communities",
    "Create educational content about the Polkadot ecosystem and job opportunities",
    "Host or participate in community events, AMAs, and workshops",
    "Onboard new users and help them navigate the platform",
    "Provide feedback and suggestions to improve DotJobs",
    "Represent DotJobs at blockchain conferences and meetups",
    "Translate content to reach global audiences (optional)",
    "Mentor newcomers to the Polkadot ecosystem",
  ];

  const requirements = [
    {
      icon: <Heart className="w-6 h-6" />,
      text: "Passionate about the Polkadot ecosystem and Web3",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      text: "Active presence on social media (Twitter, Discord, Telegram)",
    },
    {
      icon: <Star className="w-6 h-6" />,
      text: "Excellent communication and interpersonal skills",
    },
    {
      icon: <Target className="w-6 h-6" />,
      text: "Self-motivated with a proactive approach",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      text: "Ability to commit at least 5-10 hours per week",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Verified on-chain identity (preferred but not required)",
    },
  ];

  const tiers = [
    {
      name: "Rising Star",
      level: "Tier 1",
      color: "from-blue-500 to-cyan-400",
      perks: ["Ambassador Badge", "Discord Role", "Monthly Swag Raffle"],
      requirement: "Complete onboarding & first task",
    },
    {
      name: "Community Champion",
      level: "Tier 2",
      color: "from-purple-500 to-pink-400",
      perks: [
        "All Tier 1 Perks",
        "Quarterly DOT Rewards",
        "Exclusive NFT",
        "Feature on Website",
      ],
      requirement: "3+ months active participation",
    },
    {
      name: "Ecosystem Leader",
      level: "Tier 3",
      color: "from-amber-500 to-orange-400",
      perks: [
        "All Tier 2 Perks",
        "Monthly DOT Stipend",
        "Conference Sponsorship",
        "Direct Team Access",
        "Leadership Role",
      ],
      requirement: "6+ months, exceptional impact",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        {/* Background Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #1A0330 0%, #7F13EC 50%, #1A0330 100%)"
                : "linear-gradient(135deg, #FFF5F8 0%, #AE1E67 50%, #724B99 100%)",
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, ${theme === "dark" ? "#EC13A8" : "#724B99"} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 lg:px-24 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: theme === "dark" ? "rgba(127, 19, 236, 0.3)" : "rgba(174, 30, 103, 0.2)",
                    border: `1px solid ${theme === "dark" ? "#7F13EC" : "#AE1E67"}`,
                  }}
                >
                  <Star className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold text-white">
                    Join Our Ambassador Program
                  </span>
                </motion.div>

                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Become a{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        theme === "dark"
                          ? "linear-gradient(135deg, #EC13A8, #7F13EC)"
                          : "linear-gradient(135deg, #FF6B9D, #AE1E67)",
                    }}
                  >
                    DotJobs
                  </span>{" "}
                  Ambassador
                </h1>

                <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-xl">
                  Join an elite community of passionate advocates helping to shape
                  the future of work in the Polkadot ecosystem. Earn rewards, build
                  your network, and make a lasting impact.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
                    style={{
                      background: "white",
                      color: primaryColor,
                    }}
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/50 text-white bg-transparent hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </motion.button>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex gap-8 mt-12 justify-center lg:justify-start"
                >
                  {[
                    { value: "50+", label: "Ambassadors" },
                    { value: "25+", label: "Countries" },
                    { value: "10K+", label: "Community" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-3xl lg:text-4xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex-1 flex justify-center"
              >
                <div className="relative">
                  {/* Floating Cards Animation */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-72 h-72 lg:w-96 lg:h-96 rounded-3xl flex items-center justify-center relative"
                    style={{
                      background: theme === "dark"
                        ? "linear-gradient(145deg, rgba(127, 19, 236, 0.4), rgba(26, 3, 48, 0.8))"
                        : "linear-gradient(145deg, rgba(174, 30, 103, 0.3), rgba(255, 255, 255, 0.5))",
                      backdropFilter: "blur(20px)",
                      border: `2px solid ${theme === "dark" ? "rgba(127, 19, 236, 0.5)" : "rgba(174, 30, 103, 0.3)"}`,
                    }}
                  >
                    <div className="text-center p-8">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Users className="w-24 h-24 mx-auto mb-4 text-white" />
                      </motion.div>
                      <p className="text-2xl font-bold text-white mb-2">
                        Ambassador
                      </p>
                      <p className="text-white/70">
                        Empowering the Polkadot Ecosystem
                      </p>
                    </div>

                    {/* Floating Badge Elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, #EC13A8)`,
                      }}
                    >
                      <Award className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-3 -left-3 w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, #00D4FF, ${primaryColor})`,
                      }}
                    >
                      <Zap className="w-7 h-7 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute top-1/2 -right-6 w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, #FFD700, #FF6B35)`,
                      }}
                    >
                      <Star className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={theme === "dark" ? "#261933" : "#d7b4fb"}
            />
          </svg>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="px-6 lg:px-24 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Ambassador Benefits
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>
              As a DotJobs Ambassador, you&apos;ll unlock exclusive perks and
              opportunities that recognize your valuable contributions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${bgCard} rounded-2xl p-6 border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}40)`,
                    color: primaryColor,
                  }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className={`${textSecondary} text-sm`}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ambassador Tiers Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="px-6 lg:px-24 py-20"
        style={{
          background: theme === "dark"
            ? "linear-gradient(180deg, #261933 0%, #1A0330 100%)"
            : "linear-gradient(180deg, #d7b4fb 0%, #f3e8ff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Ambassador Tiers
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>
              Progress through our ambassador tiers and unlock greater rewards and
              responsibilities as you grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className={`${bgCard} rounded-3xl overflow-hidden border ${borderColor} shadow-xl relative`}
              >
                {/* Tier Header */}
                <div
                  className={`bg-gradient-to-r ${tier.color} p-6 text-center text-white`}
                >
                  <p className="text-sm font-medium opacity-80 mb-1">
                    {tier.level}
                  </p>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>

                {/* Tier Content */}
                <div className="p-6">
                  <p className={`text-sm ${textSecondary} mb-4`}>
                    <span className="font-semibold">Requirement:</span>{" "}
                    {tier.requirement}
                  </p>

                  <ul className="space-y-3">
                    {tier.perks.map((perk, perkIdx) => (
                      <li key={perkIdx} className="flex items-center gap-3">
                        <CheckCircle
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: primaryColor }}
                        />
                        <span className="text-sm">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Responsibilities Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="px-6 lg:px-24 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={fadeInUp}>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                What Ambassadors Do
              </h2>
              <p className={`${textSecondary} mb-8`}>
                As a DotJobs Ambassador, you&apos;ll play a vital role in growing our
                community and spreading awareness about opportunities in the
                Polkadot ecosystem.
              </p>

              <ul className="space-y-4">
                {responsibilities.map((item, idx) => (
                  <motion.li
                    key={idx}
                    variants={fadeInUp}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${primaryColor}20` }}
                    >
                      <CheckCircle
                        className="w-4 h-4"
                        style={{ color: primaryColor }}
                      />
                    </div>
                    <span className={textSecondary}>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={scaleIn}
              className="relative flex justify-center"
            >
              <div
                className={`${bgCard} rounded-3xl p-8 border ${borderColor} shadow-xl`}
              >
                <h3
                  className="text-xl font-bold mb-6"
                  style={{ color: primaryColor }}
                >
                  Requirements
                </h3>
                <div className="space-y-4">
                  {requirements.map((req, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}50)`,
                          color: primaryColor,
                        }}
                      >
                        {req.icon}
                      </div>
                      <span className={`text-sm ${textSecondary}`}>{req.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-6 lg:px-24 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden relative"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #7F13EC 0%, #1A0330 50%, #EC13A8 100%)"
                  : "linear-gradient(135deg, #AE1E67 0%, #724B99 50%, #AE1E67 100%)",
            }}
          >
            <div className="relative z-10 p-8 lg:p-16 text-center text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold mb-4"
              >
                Ready to Make an Impact?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
              >
                Join our growing community of ambassadors and help shape the
                future of work in the Polkadot ecosystem. Applications are now
                open!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
                  style={{ color: primaryColor }}
                >
                  Apply to Become an Ambassador
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <p className="mt-6 text-sm text-white/70">
                Applications are reviewed weekly. We&apos;ll get back to you within 7
                business days.
              </p>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-white" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl bg-white" />
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="px-6 lg:px-24 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How long does the application process take?",
                a: "We review applications weekly and typically respond within 7 business days. If accepted, you'll go through a brief onboarding process.",
              },
              {
                q: "Is there a minimum time commitment?",
                a: "We recommend dedicating 5-10 hours per week to ambassador activities. However, we understand that availability varies and appreciate any contribution.",
              },
              {
                q: "Can I be an ambassador from any country?",
                a: "Absolutely! We have ambassadors from over 25 countries and welcome applications from anywhere in the world.",
              },
              {
                q: "Do I need technical knowledge about Polkadot?",
                a: "Basic understanding is helpful, but not required. We provide resources and training to help you learn about the ecosystem.",
              },
              {
                q: "What if I can't continue as an ambassador?",
                a: "Life happens! You can take breaks or step down at any time. We value quality over quantity in contributions.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className={`${bgCard} rounded-xl p-6 border ${borderColor}`}
              >
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className={`text-sm ${textSecondary}`}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

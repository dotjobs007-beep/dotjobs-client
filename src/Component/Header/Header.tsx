"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import Image from "next/image";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { usePolkadotWallet } from "../../hooks/usePolkadotWallet";
import WalletModal from "../WalletModal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Verification Image Component
function Verification() {
  return (
    <div className="relative w-10 h-10 lg:w-15 lg:h-15 flex-shrink-0">
      <Image
        src="/images/not_verified.png"
        alt="verification signal"
        width={80}
        height={80}
        className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

// Avatar Component
function Avatar() {
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700">
      <FiUser size={20} />
    </div>
  );
}

// Action Buttons Component
function ActionButtons({
  isLoggedIn,
  walletAddress,
  handleConnectClick,
  router,
}: {
  isLoggedIn: boolean;
  walletAddress: string | null;
  handleConnectClick: () => void;
  router: AppRouterInstance;
}) {
  if (isLoggedIn) {
    return (
      <div className="flex justify-between gap-3">
        <div className="px-4 py-2 rounded-lg bg-red-600 cursor-pointer text-white text-[12px] font-medium hover:bg-red-700 transition-colors">
          Post Job
        </div>
        <button
          onClick={handleConnectClick}
          className="px-4 py-2 rounded-lg bg-purple-600 text-[12px] text-white font-medium hover:bg-purple-700 transition-colors"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between gap-3">
        <button
          onClick={() => router.replace("/auth/signup")}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.replace("/auth/signin")}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }
}

// Dropdown menu component for medium/small screens
function DropdownMenu({
  isLoggedIn,
  walletAddress,
  handleConnectClick,
  router,
}: {
  isLoggedIn: boolean;
  walletAddress: string | null;
  handleConnectClick: () => void;
  router: AppRouterInstance;
}) {
  return (
    <div className="absolute top-full right-0 w-full md:w-[50vw] bg-background dark:bg-gray-900 shadow-md py-4 z-50 animate-slideDown">
      {/* Buttons on top */}

      {/* Navigation links */}
      <ul className="flex flex-col gap-3 px-4">
        <li className="cursor-pointer hover:underline">Find Jobs</li>
        <li className="cursor-pointer hover:underline">Find Talents</li>
        <li className="cursor-pointer hover:underline">Abouts</li>
      </ul>

      <div className="flex flex-wrap gap-3 px-4 mt-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          walletAddress={walletAddress}
          handleConnectClick={handleConnectClick}
          router={router}
        />
      </div>
    </div>
  );
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { walletAddress, connectWallet, walletMissing } = usePolkadotWallet();

  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(stored === "true");
  }, []);

  const handleConnectClick = () => {
    connectWallet();
    if (!walletAddress && walletMissing) setShowModal(true);
  };

  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 lg:px-15 bg-background text-foreground h-16">
      {/* Logo */}
      <div className="flex justify-between">
        <div className="text-2xl cursor-pointer font-bold" onClick={() => router.replace("/")}>Logo</div>

        {/* Large screen navigation */}
        <ul className="hidden lg:flex gap-6 ml-8 mt-2">
          <li className="cursor-pointer hover:underline" onClick={()=> router.replace("/jobs")}>Find Jobs</li>
          <li className="cursor-pointer hover:underline">Find Talents</li>
          <li className="cursor-pointer hover:underline">Abouts</li>
        </ul>
      </div>

      {/* Large screen right section */}
      <div className="hidden lg:flex items-center gap-4">
        <Verification />
        <Avatar />
        <ActionButtons
          isLoggedIn={isLoggedIn}
          walletAddress={walletAddress}
          handleConnectClick={handleConnectClick}
          router={router}
        />
        <ThemeToggle />
      </div>

      {/* Medium & small screens */}
      <div className="flex lg:hidden">
        <Verification />
        {isLoggedIn && <Avatar />}
        <ThemeToggle />
        <button
          className="py-2 ml-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <DropdownMenu
            isLoggedIn={isLoggedIn}
            walletAddress={walletAddress}
            handleConnectClick={handleConnectClick}
            router={router}
          />
        )}
      </div>

      {/* Wallet modal */}
      <WalletModal
        show={showModal && walletMissing}
        onClose={() => setShowModal(false)}
      />

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}

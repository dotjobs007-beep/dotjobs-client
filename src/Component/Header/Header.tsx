"use client";

import { use, useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import Image from "next/image";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { usePolkadotWallet } from "../../hooks/usePolkadotWallet";
import WalletModal from "../WalletModal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAuth } from "@/app/context/authcontext";
import toast from "react-hot-toast";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import service from "@/helper/service.helper";
import Spinner from "../Spinner";
// import { openInNovaWallet } from "../OpenNovaWallet";
import { signOut } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import { s } from "framer-motion/client";
import { openWallet } from "../OpenNovaWallet";
// import { openInNovaWallet } from "../../helper/openInNovaWallet";

/* ===========================
   Action Buttons
=========================== */
function ActionButtons({
  isLoggedIn,
  router,
  closeMenu,
}: {
  isLoggedIn: boolean;
  router: AppRouterInstance;
  closeMenu: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, setUserDetails, ctxWalletAddress, disconnectWallet, showMobileWalletConnect, polkadotWalletConnect } = useAuth();
  const handleLogout = async () => {
    setIsLoading(true);
    await signOut(auth);
    await disconnectWallet();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("dottoken");
    toast.success("Logged out successfully");
    router.push("/auth/signin");
    setUserDetails(null);
    setIsLoggedIn(false);
    setIsLoading(false);

    closeMenu(); // Close menu on action
  };

  useEffect(() => {
    console.log("Wallet Address in ActionButtons in useEffect:", ctxWalletAddress);
  }, [ctxWalletAddress]);

  const handleNavigate = (path: string) => {
    router.push(path);
    closeMenu(); // Close menu on navigation
  };

  if (isLoggedIn) {
    return (
      <div className="flex justify-between gap-3">
        <div
          className="px-4 py-2 rounded-lg bg-red-600 cursor-pointer text-white text-[12px] font-medium hover:bg-red-700 transition-colors"
          onClick={() => handleNavigate("/jobs/post_job")}
        >
          Post Job
        </div>

{showMobileWalletConnect ? (
  <div className="flex flex-col gap-2">
    <button
      onClick={() => openWallet("nova")}
      className="px-4 py-2 rounded-lg bg-purple-600 text-[12px] text-white font-medium hover:bg-purple-700 transition-colors"
    >
      Open in Nova Wallet
    </button>

    <button
      onClick={() => openWallet("subwallet")}
      className="px-4 py-2 rounded-lg bg-blue-600 text-[12px] text-white font-medium hover:bg-blue-700 transition-colors"
    >
      Open in SubWallet
    </button>

    <button
      onClick={() => openWallet("polkadot")}
      className="px-4 py-2 rounded-lg bg-gray-600 text-[12px] text-white font-medium hover:bg-gray-700 transition-colors"
    >
      Polkadot.js Wallet
    </button>
  </div>
) : (
  <button
    onClick={polkadotWalletConnect}
    className="px-4 py-2 rounded-lg bg-purple-600 text-[12px] text-white font-medium hover:bg-purple-700 transition-colors"
  >
    {ctxWalletAddress
      ? `${ctxWalletAddress.slice(0, 6)}...${ctxWalletAddress.slice(-4)}`
      : "Connect Wallet"}
  </button>
)}


        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-gray-600 text-[12px] text-white font-medium hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
        <Spinner isLoading={isLoading} />
      </div>
    );
  } else {
    return (
      <div className="flex justify-between gap-3">
        <button
          onClick={() => handleNavigate("/auth/signup")}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={() => handleNavigate("/auth/signin")}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }
}

/* ===========================
   Dropdown Menu (Mobile)
=========================== */
function DropdownMenu({
  isLoggedIn,
  router,
  closeMenu,
}: {
  isLoggedIn: boolean;
  router: AppRouterInstance;
  closeMenu: () => void;
}) {
  const handleNavigate = (path: string) => {
    router.push(path);
    closeMenu(); // Close menu on navigation
  };

  return (
    <div className="absolute top-full right-0 w-full md:w-[50vw] bg-background text-white dark:bg-gray-900 shadow-md py-4 z-50 animate-slideDown">
      <ul className="flex flex-col gap-3 px-4">
        <li
          onClick={() => handleNavigate("/jobs")}
          className="cursor-pointer hover:underline"
        >
          Find Jobs
        </li>
        <li
          onClick={() => handleNavigate("/jobs/my_jobs")}
          className="cursor-pointer hover:underline"
        >
          My Jobs
        </li>
        <li
          onClick={() => handleNavigate("/dashboard/my-applications")}
          className="cursor-pointer hover:underline"
        >
          My Applications
        </li>
        <li className="cursor-pointer hover:underline">Find Talents</li>
        <li className="cursor-pointer hover:underline">About</li>
      </ul>

      {/* 🔆 Dark Mode Toggle for Mobile */}
      <div className="flex justify-start px-4 mt-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-wrap gap-3 px-4 mt-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          router={router}
          closeMenu={closeMenu}
        />
      </div>
    </div>
  );
}

/* ===========================
   Header Component
=========================== */
export default function Header() {
  // const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    isLoggedIn,
    userDetails,
    connectingWallet,
    showMobileWalletConnect,
    setShowMobileWalletConnect,
  } = useAuth();
  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const closeMenu = () => setMenuOpen(false); // ✅ new helper

  useEffect(() => {
    setMenuOpen(false);
    // setShowModal(false);
  }, [router]);

  const handleNavigate = (path: string) => {
    router.push(path);
    closeMenu(); // Close menu on navigation
  };

  return (
    <header className="fixed top-0 bg-white left-0 w-full z-50 flex items-center justify-between p-6 lg:px-15 bg-background text-foreground h-16">
      <div className="flex justify-between">
        <div
          className="text-2xl cursor-pointer font-bold"
          onClick={() => handleNavigate("/")}
        >
          <Image
            src="https://res.cloudinary.com/dk06cndku/image/upload/v1758747694/logo_tp996y.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>

        <ul className="hidden lg:flex gap-6 ml-8 mt-2">
          <li
            onClick={() => handleNavigate("/jobs")}
            className="cursor-pointer hover:underline"
          >
            Find Jobs
          </li>
          <li
            onClick={() => handleNavigate("/jobs/my_jobs")}
            className="cursor-pointer hover:underline"
          >
            My Jobs
          </li>
          <li
            onClick={() => handleNavigate("/dashboard/my-applications")}
            className="cursor-pointer hover:underline"
          >
            My Applications
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => handleNavigate("/jobs/find_talents")}
          >
            Find Talents
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => handleNavigate("/about")}
          >
            About
          </li>
        </ul>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden lg:flex items-center gap-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          router={router}
          closeMenu={closeMenu}
        />
        <ThemeToggle />

        {/* Profile Button (Image or Default Icon) */}
        <div
          onClick={() => handleNavigate("/dashboard/profile")}
          className="p-1 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="My Profile"
        >
          {userDetails?.avatar ? (
            <Image
              src={userDetails.avatar}
              alt="User Profile"
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
          ) : (
            <FiUser size={28} className="text-gray-600 dark:text-gray-300" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="flex lg:hidden">
        <div
          onClick={() => handleNavigate("/dashboard/profile")}
          className="p-1 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="My Profile"
        >
          {userDetails?.avatar ? (
            <Image
              src={userDetails.avatar}
              alt="User Profile"
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
          ) : (
            <FiUser size={28} className="text-gray-600 dark:text-gray-300" />
          )}
        </div>

        <button
          className="py-2 ml-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {menuOpen && (
          <DropdownMenu
            isLoggedIn={isLoggedIn}
            router={router}
            closeMenu={closeMenu}
          />
        )}
      </div>

      <WalletModal
        show={showMobileWalletConnect}
        onClose={() => setShowMobileWalletConnect(false)}
      />
      <Spinner isLoading={connectingWallet} />
    </header>
  );
}

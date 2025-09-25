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
import { log } from "console";

// Action Buttons Componet
function ActionButtons({
  isLoggedIn,
  walletAddress,
  handleConnectClick,
  // handleLogout,
  router,
}: {
  isLoggedIn: boolean;
  walletAddress: string | null;
  handleConnectClick: () => void;
  // handleLogout: () => void;
  router: AppRouterInstance;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const handleLogout = async () => {
    setIsLoading(true);

    const registerUser: IApiResponse<null> = await service.fetcher(
      "/user/logout",
      "POST"
    );
    if (registerUser.code == 201 || registerUser.code == 200) {
      setIsLoading(false);
      router.push("/auth/signin");
      logout();
      return;
    } else {
      toast.error(registerUser.message);
      setIsLoading(false);
      return;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex justify-between gap-3">
        <div
          className="px-4 py-2 rounded-lg bg-red-600 cursor-pointer text-white text-[12px] font-medium hover:bg-red-700 transition-colors"
          onClick={() => router.replace("/jobs/post_job")}
        >
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

        {/* ✅ Logout Button */}
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
        <li
          className="cursor-pointer hover:underline"
          onClick={() => router.push("/jobs")}
        >
          Find Jobs
        </li>
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
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { walletAddress, connectWallet, walletMissing } = usePolkadotWallet();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnectClick = async () => {
    await connectWallet();
    if (!walletAddress && walletMissing) {
      setShowModal(true);
      return;
    }
  };

  const handleWalletConnected = async () => {
    setIsLoading(true);
    const response: IApiResponse<IUserDetails> = await service.fetcher(
      `/user/connect-wallet/${walletAddress}`,
      "PATCH",
      { withCredentials: true }
    );

    if (response.code === 401) {
      setIsLoading(false);
      router.push("/auth/signin");
      return;
    }

    if (response.status === "error") {
      toast.error(response.message);
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (walletAddress) {
      handleWalletConnected();
    }
  }, [walletAddress]);

  useEffect(() => {
    setMenuOpen(false);
    setShowModal(false);
  }, [router]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 lg:px-15 bg-background text-foreground h-16">
      {/* Logo */}
      <div className="flex justify-between">
        <div
          className="text-2xl cursor-pointer font-bold"
          onClick={() => router.replace("/")}
        >
          <Image
            src="https://res.cloudinary.com/dk06cndku/image/upload/v1758747694/logo_tp996y.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>

        {/* Large screen navigation */}
        <ul className="hidden lg:flex gap-6 ml-8 mt-2">
          <li
            className="cursor-pointer hover:underline"
            onClick={() => router.replace("/jobs")}
          >
            Find Jobs
          </li>
          <li className="cursor-pointer hover:underline">Find Talents</li>
          <li className="cursor-pointer hover:underline">Abouts</li>
        </ul>
      </div>

      {/* ✅ Large screen right section */}
      <div className="hidden lg:flex items-center gap-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          walletAddress={walletAddress}
          handleConnectClick={handleConnectClick}
          router={router}
        />
        <ThemeToggle />

        {/* ✅ Avatar Icon */}
        {isLoggedIn && (
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="My Profile"
          >
            <FiUser size={22} />
          </button>
        )}
      </div>

      {/* Medium & small screens */}
      <div className="flex lg:hidden">
        <ThemeToggle />

        {/* ✅ Mobile avatar button (optional) */}
        {isLoggedIn && (
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="p-2 rounded-full ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="My Profile"
          >
            <FiUser size={22} />
          </button>
        )}

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

      <Spinner isLoading={isLoading} />
    </header>
  );
}

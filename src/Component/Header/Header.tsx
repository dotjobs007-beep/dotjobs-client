"use client";

import { useEffect, useState } from "react";
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
import { openInNovaWallet } from "../OpenNovaWallet";
import { signOut } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
// import { openInNovaWallet } from "../../helper/openInNovaWallet";

/* ===========================
   Action Buttons
=========================== */
function ActionButtons({
  isLoggedIn,
  walletAddress,
  handleConnectClick,
  router,
  isMobile,
  walletMissing,
}: {
  isLoggedIn: boolean;
  walletAddress: string | null;
  handleConnectClick: () => void;
  router: AppRouterInstance;
  isMobile: boolean;
  walletMissing: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut(auth);
    logout();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("dottoken");
    toast.success("Logged out successfully");
    router.push("/auth/signin");
    setIsLoading(false);
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

        {/* ✅ If mobile + no injected wallet, show Nova Wallet button */}
        {isMobile && walletMissing ? (
          <button
            onClick={openInNovaWallet}
            className="px-4 py-2 rounded-lg bg-purple-600 text-[12px] text-white font-medium hover:bg-purple-700 transition-colors"
          >
            Open in Nova Wallet
          </button>
        ) : (
          <button
            onClick={handleConnectClick}
            className="px-4 py-2 rounded-lg bg-purple-600 text-[12px] text-white font-medium hover:bg-purple-700 transition-colors"
          >
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
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

/* ===========================
   Dropdown Menu (Mobile)
=========================== */
function DropdownMenu({
  isLoggedIn,
  walletAddress,
  handleConnectClick,
  router,
  isMobile,
  walletMissing,
}: {
  isLoggedIn: boolean;
  walletAddress: string | null;
  handleConnectClick: () => void;
  router: AppRouterInstance;
  isMobile: boolean;
  walletMissing: boolean;
}) {
  return (
    <div className="absolute top-full right-0 w-full md:w-[50vw] bg-background dark:bg-gray-900 shadow-md py-4 z-50 animate-slideDown">
      <ul className="flex flex-col gap-3 px-4">
        <li onClick={() => router.push("/jobs")} className="cursor-pointer hover:underline">Find Jobs</li>
        <li onClick={() => router.push("/jobs/my_jobs")} className="cursor-pointer hover:underline">My Jobs</li>
        <li onClick={() => router.push("/dashboard/my-applications")} className="cursor-pointer hover:underline">My Applications</li>
        <li className="cursor-pointer hover:underline">Find Talents</li>
        <li className="cursor-pointer hover:underline">About</li>
      </ul>

      <div className="flex flex-wrap gap-3 px-4 mt-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          walletAddress={walletAddress}
          handleConnectClick={handleConnectClick}
          router={router}
          isMobile={isMobile}
          walletMissing={walletMissing}
        />
      </div>
    </div>
  );
}

/* ===========================
   Header Component
=========================== */
export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { walletAddress, connectWallet, walletMissing, isMobile } = usePolkadotWallet();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConnectClick = async () => {
    await connectWallet();
    if (!walletAddress && walletMissing && !isMobile) {
      // Desktop without extension
      setShowModal(true);
    }
  };

  const handleWalletConnected = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    const response: IApiResponse<IUserDetails> = await service.fetcher(
      `/user/connect-wallet/${walletAddress}`,
      "PATCH",
      { withCredentials: true }
    );

    if (response.code === 401) {
      router.push("/auth/signin");
    } else if (response.status === "error") {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (walletAddress) handleWalletConnected();
  }, [walletAddress]);

  useEffect(() => {
    setMenuOpen(false);
    setShowModal(false);
  }, [router]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 lg:px-15 bg-background text-foreground h-16">
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

        <ul className="hidden lg:flex gap-6 ml-8 mt-2">
          <li onClick={() => router.replace("/jobs")} className="cursor-pointer hover:underline">Find Jobs</li>
          <li onClick={() => router.replace("/jobs/my_jobs")} className="cursor-pointer hover:underline">My Jobs</li>
          <li onClick={() => router.replace("/dashboard/my-applications")} className="cursor-pointer hover:underline">My Applications</li>
          <li className="cursor-pointer hover:underline">Find Talents</li>
          <li className="cursor-pointer hover:underline">About</li>
        </ul>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden lg:flex items-center gap-4">
        <ActionButtons
          isLoggedIn={isLoggedIn}
          walletAddress={walletAddress}
          handleConnectClick={handleConnectClick}
          router={router}
          isMobile={isMobile}
          walletMissing={walletMissing}
        />
        <ThemeToggle />

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

      {/* Mobile Menu */}
      <div className="flex lg:hidden">
        <ThemeToggle />

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

        {menuOpen && (
          <DropdownMenu
            isLoggedIn={isLoggedIn}
            walletAddress={walletAddress}
            handleConnectClick={handleConnectClick}
            router={router}
            isMobile={isMobile}
            walletMissing={walletMissing}
          />
        )}
      </div>

      <WalletModal
        show={showModal && walletMissing && !isMobile}
        onClose={() => setShowModal(false)}
      />
      <Spinner isLoading={isLoading} />
    </header>
  );
}

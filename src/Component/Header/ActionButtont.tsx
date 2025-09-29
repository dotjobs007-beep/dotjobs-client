import { auth } from "@/Firebase/firebase";
import { openWallet } from "../OpenNovaWallet";
import Spinner from "../Spinner";
import { useAuth } from "@/app/context/authcontext";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

export default function ActionButtons({
  isLoggedIn,
  router,
  closeMenu,
}: {
  isLoggedIn: boolean;
  router: AppRouterInstance;
  closeMenu: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    setIsLoggedIn,
    setUserDetails,
    ctxWalletAddress,
    disconnectWallet,
    showMobileWalletConnect,
    polkadotWalletConnect,
  } = useAuth();
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
    console.log(
      "Wallet Address in ActionButtons in useEffect:",
      ctxWalletAddress
    );
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
          <div className="absolute flex flex-col justify-start bg-[#A83182] p-10 gap-2 shadow-lg rounded-lg mt-16">
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
              ? `${ctxWalletAddress.slice(0, 6)}...${ctxWalletAddress.slice(
                  -4
                )}`
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
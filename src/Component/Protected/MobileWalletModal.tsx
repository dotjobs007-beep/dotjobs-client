"use client";

import { useAuth } from "@/app/context/authcontext";
import { openWallet } from "../OpenNovaWallet";
import { useEffect } from "react";
import Card from "../Card";
import { div } from "framer-motion/m";

export default function MobileWalletModal({ closeMenu }: { closeMenu: () => void }) {
  const { setShowMobileWalletConnect } = useAuth();

  const close = () => {
    setShowMobileWalletConnect(false);
    closeMenu();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-hidden
      />

      {/* Modal */}
      <Card className="relative rounded-lg shadow-lg w-11/12 max-w-md p-6 z-10">
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-900 dark:text-gray-300"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Open using mobile wallet</h3>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              openWallet("nova");
              close();
            }}
            className="px-4 py-2 rounded-lg bg-purple-600 text-[14px] text-white font-medium hover:bg-purple-700 transition-colors"
          >
            Open in Nova Wallet
          </button>

          <button
            onClick={() => {
              openWallet("subwallet");
              close();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-[14px] text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Open in SubWallet
          </button>

          <button
            onClick={() => {
              openWallet("polkadot");
              close();
            }}
            className="px-4 py-2 rounded-lg bg-gray-600 text-[14px] text-white font-medium hover:bg-gray-700 transition-colors"
          >
            Polkadot.js Wallet
          </button>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useAuth } from "@/app/context/authcontext";
import { usePolkadotWallet } from "@/hooks/usePolkadotWallet";
import React, { useState } from "react";

type WalletModalProps = {
  onClose: () => void;
};

export default function WalletModal({ onClose }: WalletModalProps) {
  const { showMobileWalletConnect, isWalletMissing } = useAuth();
  const { isMobile } = usePolkadotWallet();
  const [showModal, setShowModal] = useState(true);

  // Only show this desktop modal when:
  // - the device is not mobile, and
  // - the wallet is missing, and
  // - the mobile wallet modal is NOT showing
  if (isMobile) return null;
  if (!isWalletMissing) return null;
  if (showMobileWalletConnect) return null;
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background dark:bg-gray-900 p-6 rounded-xl shadow-xl w-80 max-w-sm animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-white">
          No Polkadot Wallet Detected
        </h2>
        <p className="mb-4 text-sm text-foreground dark:text-gray-300">
          To use this feature, please install one of the following wallets:
        </p>
        <ul className="flex flex-col gap-3">
          <li>
            <a
              href="https://polkadot.js.org/extension/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-purple-200 dark:bg-purple-700 rounded-lg text-center font-medium text-purple-900 dark:text-white hover:bg-purple-300 dark:hover:bg-purple-600 transition-colors"
            >
              Polkadot.js Extension
            </a>
          </li>
          <li>
            <a
              href="https://talisman.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-purple-200 dark:bg-purple-700 rounded-lg text-center font-medium text-purple-900 dark:text-white hover:bg-purple-300 dark:hover:bg-purple-600 transition-colors"
            >
              Talisman Wallet
            </a>
          </li>
          <li>
            <a
              href="https://subwallet.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-purple-200 dark:bg-purple-700 rounded-lg text-center font-medium text-purple-900 dark:text-white hover:bg-purple-300 dark:hover:bg-purple-600 transition-colors"
            >
              SubWallet
            </a>
          </li>
        </ul>
        <button
          onClick={() => {
             setShowModal(false);
             onClose();
          }}
          className="mt-4 w-full py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

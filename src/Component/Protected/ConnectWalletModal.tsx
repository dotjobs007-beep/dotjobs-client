"use client";

import { useAuth } from "@/app/context/authcontext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import WalletModal from "../WalletModal";

interface ConnectWalletModalProps {
  open: boolean;
}

export default function ConnectWalletModal({ open }: ConnectWalletModalProps) {
  const { connectingWallet, polkadotWalletConnect, showMobileWalletConnect, setShowMobileWalletConnect } = useAuth();

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="relative w-[90%] max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl text-center"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                To continue, please connect your crypto wallet securely.
              </p>

              {/* Connect Button */}
              <button
                onClick={polkadotWalletConnect}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
              >
                {connectingWallet ? "Connecting..." : "Connect Wallet"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <WalletModal
        show={showMobileWalletConnect}
        onClose={() => setShowMobileWalletConnect(false)}
      />
    </>
  );
}

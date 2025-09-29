"use client";
import { useState, useEffect } from "react";

export function usePolkadotWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletMissing, setWalletMissing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const connectWallet = async (): Promise<{ walletAddress: string | null; walletMissing: boolean; isMobile: boolean }> => {
    if (walletAddress) {
      // Already connected – optionally auto-disconnect first
      await disconnectWallet();
      return { walletAddress: null, walletMissing: false, isMobile };
    }

    try {
      const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");
      const extensions = await web3Enable("My DApp");
      console.log("Detected extensions:", extensions.length);

      if (extensions.length === 0) {
        setWalletMissing(true);
        return { walletAddress: null, walletMissing: true, isMobile };
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        setInitialized(true);
        return { walletAddress: null, walletMissing: false, isMobile };
      }

      setWalletAddress(accounts[0].address);
      setWalletMissing(false);

      // Optionally persist in localStorage
      localStorage.setItem("polkadotWalletAddress", accounts[0].address);
      return { walletAddress: accounts[0].address, walletMissing: false, isMobile };
    } catch (err) {
      console.error("Wallet connection error:", err);
      setWalletMissing(true);
      return { walletAddress: null, walletMissing: true, isMobile };
    }
  };

  const disconnectWallet = async () => {
    // Simply clear state & any storage
    setWalletAddress(null);
    setWalletMissing(false);
    setInitialized(false);
    localStorage.removeItem("polkadotWalletAddress");
  };

  // Restore previous session if needed
  // useEffect(() => {
  //   const saved = localStorage.getItem("polkadotWalletAddress");
  //   if (saved) setWalletAddress(saved);
  // }, []);

  return { walletAddress, connectWallet, disconnectWallet, walletMissing, isMobile, initialized };
}

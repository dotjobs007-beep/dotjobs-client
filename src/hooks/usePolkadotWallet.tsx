"use client";
import { useState, useEffect } from "react";

export function usePolkadotWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletMissing, setWalletMissing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const connectWallet = async () => {
    if (walletAddress) {
      setWalletAddress(null);
      return;
    }

    try {
      const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");
      const extensions = await web3Enable("My DApp");

      if (extensions.length === 0) {
        // No wallet injection
        setWalletMissing(true);
        return;
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        alert("No accounts found in the wallet!");
        return;
      }

      setWalletAddress(accounts[0].address);
      setWalletMissing(false);
    } catch (err) {
      console.error("Wallet connection error:", err);
      setWalletMissing(true);
    }
  };

  return { walletAddress, connectWallet, walletMissing, isMobile };
}

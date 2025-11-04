"use client";
import { useState, useEffect } from "react";

export function usePolkadotWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletMissing, setWalletMissing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  const connectWallet = async (): Promise<{ walletAddress: string | null; walletMissing: boolean; isMobile: boolean }> => {
    if (walletAddress) {
      // Already connected – disconnect first to allow fresh selection
      await disconnectWallet();
      return { walletAddress: null, walletMissing: false, isMobile };
    }

    try {      
      const { web3Enable, web3Accounts, web3AccountsSubscribe } = await import("@polkadot/extension-dapp");
      
      // Clear any existing cache by enabling with a fresh request
      const extensions = await web3Enable("DotJobs Platform");
      
      if (extensions.length === 0) {
        setWalletMissing(true);
        return { walletAddress: null, walletMissing: true, isMobile };
      }
      

      // Get fresh accounts list - this should prompt user to select accounts if needed
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        setInitialized(true);
        return { walletAddress: null, walletMissing: false, isMobile };
      }
      
      // For now, use the first account, but this will prompt user to authorize if not cached
      const selectedAddress = accounts[0].address;
      setWalletAddress(selectedAddress);
      setWalletMissing(false);

      // Store only after successful connection
      localStorage.setItem("polkadotWalletAddress", selectedAddress);      
      return { walletAddress: selectedAddress, walletMissing: false, isMobile };
    } catch (err) {
      setWalletMissing(true);
      return { walletAddress: null, walletMissing: true, isMobile };
    }
  };

  const disconnectWallet = async () => {
    
    // Clear all local state first (most important)
    setWalletAddress(null);
    setWalletMissing(false);
    setInitialized(false);
    
    // Remove ALL wallet-related items from storage
    try {
      localStorage.removeItem("polkadotWalletAddress");
      localStorage.removeItem("walletjs:connected");
      localStorage.removeItem("walletconnect");
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }
    
    // Clear session storage thoroughly
    try {
      sessionStorage.removeItem("polkadotWalletAddress");
      sessionStorage.removeItem("walletConnection");
      sessionStorage.removeItem("walletjs:connected");
      sessionStorage.removeItem("extensionAccess");
    } catch (error) {
      console.warn("Error clearing session storage:", error);
    }

    // Force clear extension connection cache
    try {
      const { web3Enable } = await import("@polkadot/extension-dapp");
      
      // Try to reset the extension connection by re-enabling with different params
      await web3Enable("DotJobs-Disconnect");
      
      // Clear any global window cache if exists
      if (typeof window !== 'undefined') {
        // Clear any polkadot extension caches
        if ((window as any).polkadotExtension) {
          delete (window as any).polkadotExtension;
        }
        if ((window as any).injectedWeb3) {
          // Reset injected web3 cache
          Object.keys((window as any).injectedWeb3).forEach(key => {
            if (key.includes('polkadot')) {
              delete (window as any).injectedWeb3[key];
            }
          });
        }
      }
      
    } catch (error) {
      console.warn("Error clearing extension cache (this is optional):", error);
      // Don't throw, this is optional cleanup
    }
    
  };

  // Note: Removed automatic restoration to allow fresh wallet selection after logout

  return { walletAddress, connectWallet, disconnectWallet, walletMissing, isMobile, initialized };
}

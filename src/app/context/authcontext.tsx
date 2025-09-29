"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import service from "@/helper/service.helper";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import clientLogger from "@/utils/clientLogger";
import { useRouter } from "next/navigation";
import router from "next/dist/shared/lib/router/router";
import { toast } from "react-hot-toast/headless";
import { usePolkadotWallet } from "@/hooks/usePolkadotWallet";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserDetails: (details: IUserDetails | null) => void;
  userDetails?: IUserDetails | null;
  ctxWalletAddress?: string | null;
  setWalletAddress?: (address: string | null) => void;
  disconnectWallet: () => Promise<void> | (() => void);
  connectingWallet: boolean;
  isWalletConnected?: boolean;
  showMobileWalletConnect: boolean;
  setShowMobileWalletConnect: (value: boolean) => void;
  polkadotWalletConnect: () => Promise<void>;
  isWalletMissing: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ctxWalletAddress, setCtxWalletAddress] = useState<string | null>(null);
  const [isWalletMissing, setIsWalletMissing] = useState(false);
  const {
    connectWallet,
    walletAddress,
    walletMissing,
    isMobile,
    disconnectWallet,
  } = usePolkadotWallet();
  const [showMobileWalletConnect, setShowMobileWalletConnect] = useState(false);
  const router = useRouter();
  // Load login state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn, userDetails]);

  const polkadotWalletConnect = async () => {
    console.log("Polkadot wallet connect clicked");
    // Use the result returned by connectWallet to avoid stale state
    const result = await connectWallet();
    console.log("connectWallet result:", result);

    if (result.walletAddress) {
      // Handled by effect that watches walletAddress in the hook; we still update context state here
      setCtxWalletAddress(result.walletAddress);
      setIsWalletConnected(true);
      setShowMobileWalletConnect(false);
      return;
    }

    // If no wallet address and mobile with wallet missing — show mobile deep link options
    if (!result.walletAddress && result.walletMissing && result.isMobile) {
      console.log("Mobile with no wallet - show mobile connect options");
      setShowMobileWalletConnect(true);
    }

    if (result.walletMissing && !result.isMobile) {
      setIsWalletMissing(true);
    }
  };

  useEffect(() => {
    // When walletAddress becomes available, handle post-connection steps
    if (walletAddress) {
      handleWalletConnected();
    } else {
      // If the hook reports no wallet, clear context state so UI updates
      setCtxWalletAddress(null);
      setIsWalletConnected(false);
    }
    console.log("Wallet address changed:", walletAddress);
  }, [walletAddress]);

  const handleWalletConnected = async () => {
    if (!walletAddress) return;
    setConnectingWallet(true);
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

    console.log("Wallet connected response:", response);
    setConnectingWallet(false);
    setIsWalletConnected(true);
    setCtxWalletAddress(walletAddress);
    
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userDetails,
        setUserDetails,
        ctxWalletAddress,
        disconnectWallet,
        connectingWallet,
        isWalletConnected,
        showMobileWalletConnect,
        setShowMobileWalletConnect,
        polkadotWalletConnect,
        isWalletMissing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import service from "@/helper/service.helper";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import clientLogger from "@/utils/clientLogger";
import { useRouter } from "next/navigation";
import router from "next/dist/shared/lib/router/router";
import { usePolkadotWallet } from "@/hooks/usePolkadotWallet";
import toast from "react-hot-toast";

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
  setIsWalletConnected: (value: boolean) => void;
  showMobileWalletConnect: boolean;
  setShowMobileWalletConnect: (value: boolean) => void;
  polkadotWalletConnect: () => Promise<void>;
  isWalletMissing: boolean;
  theme?: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ctxWalletAddress, setCtxWalletAddress] = useState<string | null>(null);
  const [isWalletMissing, setIsWalletMissing] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, [isLoggedIn, userDetails]);

  const polkadotWalletConnect = async () => {
    // Use the result returned by connectWallet to avoid stale state
    const result = await connectWallet();

    if (result.walletAddress) {
      setShowMobileWalletConnect(false);
      return;
    }

    // If no wallet address and mobile with wallet missing — show mobile deep link options
    if (!result.walletAddress && result.walletMissing && result.isMobile) {
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
      setConnectingWallet(false);
      setIsWalletConnected(false);
      return;
    }
    setCtxWalletAddress(walletAddress);
    setIsWalletConnected(true);

    setConnectingWallet(false);
    setIsWalletConnected(true);
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
        setIsWalletConnected,
        showMobileWalletConnect,
        setShowMobileWalletConnect,
        polkadotWalletConnect,
        isWalletMissing,
        theme,
        setTheme,
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

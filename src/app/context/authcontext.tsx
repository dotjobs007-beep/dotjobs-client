"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import service from "@/helper/service.helper";
import { IApiResponse } from "@/interface/interface";
import clientLogger from "@/utils/clientLogger";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children}: { children: React.ReactNode}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Load login state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(stored === "true");
  }, []);

  // If the user was redirected back from an OAuth provider (mobile), process the result
  // useEffect(() => {
  //   async function handleRedirect() {
  //     clientLogger.sendLog("info", "handleRedirect start");
  //     try {
  //       const result = await getRedirectResult(auth);
  //       clientLogger.sendLog("info", "getRedirectResult returned", { resultPresent: !!result });
  //       if (result && result.user) {
  //         // We have a logged in user from redirect flow
  //         const token = await result.user.getIdToken();
  //         clientLogger.sendLog("info", "got token from redirect result", { hasToken: !!token });
  //         if (token) {
  //           // Send token to backend to register/login user
  //           try {
  //             const headers = { authorization: `Bearer ${token}` };
  //             const res: IApiResponse<null> = await service.fetcher("/user/auth", "POST", { headers });
  //             clientLogger.sendLog("info", "backend /user/auth response", { code: res?.code, message: res?.message });
  //             if (res && (res.code === 200 || res.code === 201)) {
  //               setIsLoggedIn(true);
  //               localStorage.setItem("isLoggedIn", "true");
  //               // redirect mobile user to dashboard after successful backend auth
  //               try {
  //                 router.replace("/dashboard/profile");
  //               } catch (e) {
  //                 console.debug("router.replace failed:", e);
  //               }
  //             }
  //           } catch (e) {
  //             clientLogger.sendLog("error", "backend call after redirect failed", { error: String(e) });
  //             console.debug("Failed to call backend after redirect", e);
  //           }
  //         }
  //       } else {
  //         clientLogger.sendLog("info", "getRedirectResult returned null, attaching onAuthStateChanged");
  //         // Sometimes getRedirectResult returns null but the user is signed in.
  //         // Listen once for auth state change and handle token exchange.
  //         const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //           clientLogger.sendLog("info", "onAuthStateChanged fired", { userPresent: !!user });
  //           if (user) {
  //             try {
  //               const token = await user.getIdToken();
  //               clientLogger.sendLog("info", "onAuthStateChanged got token", { hasToken: !!token });
  //               const headers = { authorization: `Bearer ${token}` };
  //               const res: IApiResponse<null> = await service.fetcher("/user/auth", "POST", { headers });
  //               clientLogger.sendLog("info", "backend /user/auth response (onAuth)", { code: res?.code, message: res?.message });
  //               if (res && (res.code === 200 || res.code === 201)) {
  //                 setIsLoggedIn(true);
  //                 localStorage.setItem("isLoggedIn", "true");
  //                 try {
  //                   router.replace("/dashboard/profile");
  //                 } catch (e) {
  //                   console.debug("router.replace failed:", e);
  //                 }
  //               }
  //             } catch (e) {
  //               clientLogger.sendLog("error", "onAuthStateChanged handler failed", { error: String(e) });
  //               console.debug("onAuthStateChanged handler failed:", e);
  //             }
  //           }
  //           unsubscribe();
  //         });
  //       }
  //     } catch (err) {
  //       clientLogger.sendLog("error", "getRedirectResult threw", { error: String(err) });
  //       // ignore - redirect may have been cancelled
  //       console.debug("Redirect result not available:", err);
  //     }
  //   }
  //   handleRedirect();
  // }, []);

  // Sync login state to localStorage
  
  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

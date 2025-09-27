"use client";

import { useEffect, useState } from "react";
import {
  setPersistence,
  browserLocalPersistence,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { isMobile } from "@/utils/isMobile";
import { isInAppBrowser } from "@/utils/inAppBrowser";
import service from "@/helper/service.helper";
import { IApiResponse } from "@/interface/interface";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import toast from "react-hot-toast";

export default function useSignupLogic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inApp, setInApp] = useState(false);

  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  /** ---------------- Helpers ---------------- **/
  const handleAuthentication = async (token: string) => {
    console.log("[Auth] handleAuthentication called. Token:", token);
    if (!token) return toast.error("No token received");

    setIsLoading(true);
    try {
      const res: IApiResponse<null> = await service.fetcher("/user/auth", "POST", {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log("[Auth] Server response:", res);

      if (res.code === 200 || res.code === 201) {
        setIsLoggedIn(true);
        router.push("/dashboard/profile");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("[Auth] API error:", err);
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  /** ---------------- Email Signup ---------------- **/
  const handleEmailSignup = async () => {
    console.log("[Email] Signup start:", email);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      console.log("[Email] Token:", token);
      await handleAuthentication(token);
    } catch (err: any) {
      console.error("[Email] Error:", err);
      toast.error(err.message || "Signup failed");
    }
  };

  /** ---------------- Google Signup ---------------- **/
  const handleGoogleSignup = async () => {
    console.log("[Google] Signup start");

    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign up.");
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log("[Google] Persistence set");

      if (isMobile()) {
        console.log("[Google] Mobile → popup");
        // Popup works on normal mobile Safari/Chrome
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        console.log("[Google] Token:", token);
        await handleAuthentication(token);
      } else {
        console.log("[Google] Desktop → popup");
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        console.log("[Google] Token:", token);
        await handleAuthentication(token);
      }
    } catch (err: any) {
      console.error("[Google] Error:", err);
      toast.error(err.message || "Google signup failed");
    }
  };

  /** ---------------- Twitter Signup ---------------- **/
  const handleTwitterSignup = async () => {
    console.log("[Twitter] Signup start");

    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign up.");
    }

    try {
      if (isMobile()) {
        console.log("[Twitter] Mobile → popup");
        const result = await signInWithPopup(auth, twitterProvider);
        const token = await result.user.getIdToken();
        console.log("[Twitter] Token:", token);
        await handleAuthentication(token);
      } else {
        console.log("[Twitter] Desktop → popup");
        const result = await signInWithPopup(auth, twitterProvider);
        const token = await result.user.getIdToken();
        console.log("[Twitter] Token:", token);
        await handleAuthentication(token);
      }
    } catch (err: any) {
      console.error("[Twitter] Error:", err);
      toast.error(err.message || "Twitter signup failed");
    }
  };

  /** ---------------- Effects ---------------- **/
  useEffect(() => {
    console.log("[Init] useSignupLogic mounted");
    setInApp(typeof window !== "undefined" && isInAppBrowser());

    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthState] Fired. User:", user);
      if (user) {
        const token = await user.getIdToken();
        console.log("[AuthState] Token:", token);
        await handleAuthentication(token);
      }
    });

    return () => unsub();
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    inApp,
    handleEmailSignup,
    handleGoogleSignup,
    handleTwitterSignup,
  };
}

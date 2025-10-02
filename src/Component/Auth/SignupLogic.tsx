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
    if (!token) return toast.error("No token received");

    setIsLoading(true);
    try {
      const res: IApiResponse<any> = await service.fetcher("/user/auth", "POST", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.code === 200 || res.code === 201) {
        const { token } = res.data || {};
        localStorage.setItem("dottoken", token);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        router.push("/dashboard/profile");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  /** ---------------- Email Signup ---------------- **/
  const handleEmailSignup = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  };

  /** ---------------- Google Signup ---------------- **/
  const handleGoogleSignup = async () => {
    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign up.");
    }

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (isMobile()) {
        // Popup works on normal mobile Safari/Chrome
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        await handleAuthentication(token);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        await handleAuthentication(token);
      }
    } catch (err: any) {
      toast.error(err.message || "Google signup failed");
    }
  };

  /** ---------------- Twitter Signup ---------------- **/
  const handleTwitterSignup = async () => {
    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign up.");
    }

    try {
      if (isMobile()) {
        const result = await signInWithPopup(auth, twitterProvider);
        const token = await result.user.getIdToken();
        await handleAuthentication(token);
      } else {
        const result = await signInWithPopup(auth, twitterProvider);
        const token = await result.user.getIdToken();
        await handleAuthentication(token);
      }
    } catch (err: any) {
      toast.error(err.message || "Twitter signup failed");
    }
  };

  /** ---------------- Effects ---------------- **/
  useEffect(() => {
    setInApp(typeof window !== "undefined" && isInAppBrowser());

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
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

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
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { isMobile } from "@/utils/isMobile";
import { isInAppBrowser } from "@/utils/inAppBrowser";
import service from "@/helper/service.helper";
import { IApiResponse } from "@/interface/interface";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import toast from "react-hot-toast";

export default function useSignInLogic() {
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
      console.log("[Auth] Server response:", res);

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

  /** ---------------- Email Signin ---------------- **/
  const handleEmailSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    }
  };

  /** ---------------- Google Signin ---------------- **/
  const handleGoogleSignin = async () => {
    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign in.");
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
      toast.error(err.message || "Google signin failed");
    }
  };

  /** ---------------- Twitter Signin ---------------- **/
  const handleTwitterSignin = async () => {
    console.log("[Twitter] Signin start");

    if (inApp) {
      return toast.error("Please open this page in Safari/Chrome to sign in.");
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

  /** ---------------- Forgotten Password ---------------- **/
  const handleForgotPassword = async () => {
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (err: any) {
      toast.error(err.message || "Failed to send password reset email");
    } finally {
      setIsLoading(false);
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
    handleEmailSignIn,
    handleGoogleSignin,
    handleTwitterSignin,
    handleForgotPassword,
  };
}

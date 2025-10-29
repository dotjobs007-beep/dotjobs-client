// pages/auth/callback.js
"use client";

import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/Firebase/firebase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // Example: save user data or redirect
          router.push("/dashboard");
        } else {
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/auth/signin");
      }
    };

    handleAuth();
  }, [router]);

  return <p>Signing you in...</p>;
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent. Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email");
    }
  };

  return (
    <div className="flex lg:h-[89vh] overflow-hidden">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold mb-8">Reset Password</h1>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg p-4 shadow-sm
                       focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700
                       flex justify-center items-center gap-2 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-gray-500">
          Remember your password?{" "}
          <a href="/auth/signin" className="text-blue-500 font-medium">
            Back to Login
          </a>
        </p>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden lg:block relative h-full">
        <Image
          src="/images/auth_img.png"
          alt="Reset illustration"
          fill
          className="object-cover rounded-l-2xl"
        />
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignup = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleTwitterSignup = async () => {
    await signInWithPopup(auth, twitterProvider);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12 h-full">
        <h1 className="text-4xl font-bold mb-8">Sign Up</h1>

        <form onSubmit={handleEmailSignup} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-t" />
          <span className="px-2 text-gray-400">or</span>
          <hr className="flex-1 border-t" />
        </div>

        {/* OAuth Buttons - Row on medium/large, column on small */}
        <div className="flex flex-col md:flex-row gap-4">
          <div
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-3 gap-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <FcGoogle size={26} />
            <span className="text-gray-700 font-medium">Sign up with Google</span>
          </div>

          <div
            onClick={handleTwitterSignup}
            className="flex-1 flex items-center justify-center bg-[#1DA1F2] hover:bg-[#0d95e8] text-white rounded-lg py-3 gap-3 cursor-pointer transition"
          >
            <FaTwitter size={26} />
            <span className="font-medium">Sign up with Twitter</span>
          </div>
        </div>

        <p className="mt-6 text-gray-500">
          Already have an account? <a href="/auth/signin" className="text-blue-500 font-medium">Login</a>
        </p>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden md:block relative h-full">
        <Image
          src="/images/auth_img.png"
          alt="Signup illustration"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

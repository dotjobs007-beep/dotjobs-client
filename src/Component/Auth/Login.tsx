"use client";
import { useState } from "react";
import Image from "next/image";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleTwitterLogin = async () => {
    await signInWithPopup(auth, twitterProvider);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12">
        <h1 className="text-4xl font-bold mb-8">Login</h1>

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2 transition"
          >
            Login
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
            onClick={handleGoogleLogin}
            className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-3 gap-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <FcGoogle size={26} />
            <span className="text-gray-700 font-medium">Login with Google</span>
          </div>

          <div
            onClick={handleTwitterLogin}
            className="flex-1 flex items-center justify-center bg-[#1DA1F2] hover:bg-[#0d95e8] text-white rounded-lg py-3 gap-3 cursor-pointer transition"
          >
            <FaTwitter size={26} />
            <span className="font-medium">Login with Twitter</span>
          </div>
        </div>

        <p className="mt-6 text-gray-500">
          Don't have an account? <a href="/auth/signup" className="text-blue-500 font-medium">Sign Up</a>
        </p>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden lg:block relative h-full">
        <Image
          src="/images/auth_img.png"
          alt="Login illustration"
          fill
          className="object-cover rounded-l-2xl"
        />
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { SiX } from "react-icons/si";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Spinner from "../Spinner";
import useSignInLogic from "./SiginLogic";
import { useAuth } from "@/app/context/authcontext";
import { useState } from "react";

export default function SignIn() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    inApp,
    handleEmailSignIn,
    handleGoogleSignin,
    handleTwitterSignin,
  } = useSignInLogic();

  const { theme } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const img =
    theme === "dark"
      ? "/Images/auth_img_dark.png"
      : "/Images/auth_img_light.png";

  return (
    <div className="flex lg:h-[89vh] overflow-hidden mt-8">
      {inApp && (
        <div className="w-full bg-yellow-100 text-yellow-900 p-3 text-center">
          It looks like you are in an in-app browser. For sign-up please
          <button
            onClick={() => window.open(window.location.href, "_blank")}
            className="font-semibold underline ml-1"
          >
            open in your browser
          </button>
        </div>
      )}

      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12 h-full">
        <h1 className="text-3xl font-bold mb-8">Sign In</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailSignIn();
          }}
          className="flex flex-col gap-5"
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:ring-2 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-t" />
          <span className="px-2 text-gray-400">or</span>
          <hr className="flex-1 border-t" />
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <div
            onClick={handleGoogleSignin}
            className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-3 gap-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <FcGoogle size={26} />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </div>

          <div
            onClick={handleTwitterSignin}
            className="flex-1 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg py-3 gap-3 cursor-pointer transition"
          >
            <SiX size={26} />
            <span className="font-medium">Sign in with X</span>
          </div>
        </div>

        {/* Links */}
        <div className="lg:flex md:flex justify-between mt-1">
          <p className="mt-6 text-gray-500">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 font-medium">
              Sign Up
            </a>
          </p>

          <p className="text-blue-500 text-sm mt-2 hover:underline self-start">
            <a href="/auth/forgot-password">Forgot password?</a>
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden md:block relative h-full shadow-xl">
        <Image
          src={img}
          alt="Signin illustration"
          fill
          className="object-cover"
        />
      </div>

      <Spinner isLoading={isLoading} />
    </div>
  );
}

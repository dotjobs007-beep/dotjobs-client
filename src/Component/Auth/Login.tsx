"use client";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { SiX } from "react-icons/si"; // X icon
import { useRouter } from "next/navigation";
import { IApiResponse } from "@/interface/interface";
import service from "@/helper/service.helper";
import Spinner from "../Spinner";
import { useAuth } from "@/app/context/authcontext";
// import AuthImage from "../../../public/images/auth_img.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    }
  };

  // ✅ X (Twitter) Login
  const handleTwitterLogin = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "X login failed");
    }
  };

  // ✅ Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password");
    }
  };

  const handleAuthentication = async (token: string) => {
    if (!token) {
      toast.error("Authentication failed. Please try again.");
      return;
    }
    const headers = {
      authorization: `Bearer ${token}`,
    };

    setIsLoading(true);

    const registerUser: IApiResponse<null> = await service.fetcher(
      "/user/auth",
      "POST",
      { headers }
    );
    if (registerUser.code == 201 || registerUser.code == 200) {
      router.push("/dashboard/profile");
      setIsLoggedIn(true);
      setIsLoading(false);
      return;
    } else {
      toast.error(registerUser.message);
      setIsLoading(false);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="flex lg:h-[89vh] overflow-hidden">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12 h-full">
        <h1 className="text-3xl font-bold mb-8">Login</h1>

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

        {/* OAuth Buttons */}
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
            className="flex-1 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg py-3 gap-3 cursor-pointer transition"
          >
            <SiX size={26} />
            <span className="font-medium">Login with X</span>
          </div>
        </div>

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
      <div className="flex-1 hidden lg:block relative h-full">
        <Image
          src="https://res.cloudinary.com/dk06cndku/image/upload/v1758747694/auth_img_jkezhd.png"
          alt="Login illustration"
          fill
          className="object-cover rounded-l-2xl"
        />
      </div>
      <Spinner isLoading={isLoading} />
    </div>
  );
}

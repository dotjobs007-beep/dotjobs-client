"use client";
import { useState } from "react";
import Image from "next/image";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "@/Firebase/firebase";
import { isMobile } from "@/utils/isMobile";
import { FcGoogle } from "react-icons/fc";
import { SiX } from "react-icons/si"; // X logo
import service from "@/helper/service.helper";
import { IApiResponse } from "@/interface/interface";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Spinner from "../Spinner";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      let result;
      if (isMobile()) {
        // Use redirect on mobile
        await signInWithRedirect(auth, googleProvider);
        return;
      } else {
        result = await signInWithPopup(auth, googleProvider);
      }
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Google signup failed");
    }
  };

  const handleTwitterSignup = async () => {
    try {
      let result;
      if (isMobile()) {
        await signInWithRedirect(auth, twitterProvider);
        return;
      } else {
        result = await signInWithPopup(auth, twitterProvider);
      }
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "X signup failed");
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      await handleAuthentication(token);
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
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
      return;
    }
  };

  return (
    <div className="flex lg:h-[89vh] overflow-hidden">
      {/* Left Form */}
      <div className="flex-1 flex flex-col justify-center px-12 h-full">
        <h1 className="text-3xl font-bold mb-8">Sign Up</h1>

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

        {/* OAuth Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <div
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center border border-gray-300 rounded-lg py-3 gap-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <FcGoogle size={26} />
            <span className="text-gray-700 font-medium">
              Sign up with Google
            </span>
          </div>

          <div
            onClick={handleTwitterSignup}
            className="flex-1 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg py-3 gap-3 cursor-pointer transition"
          >
            <SiX size={26} />
            <span className="font-medium">Sign up with X</span>
          </div>
        </div>

        <p className="mt-6 text-gray-500">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-blue-500 font-medium">
            Login
          </a>
        </p>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden md:block relative h-full">
        <Image
          src="https://res.cloudinary.com/dk06cndku/image/upload/v1758747694/auth_img_jkezhd.png"
          alt="Signup illustration"
          fill
          className="object-cover"
        />
      </div>

      <Spinner isLoading={isLoading} />
    </div>
  );
}

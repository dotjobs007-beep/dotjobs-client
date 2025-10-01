"use client"
import { useAuth } from "@/app/context/authcontext";
import Image from "next/image";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
export default function Hero() {
  const [query, setQuery] = useState("");
  const {theme} = useAuth();
  const backgroundStyle = theme === "dark"
    ? "linear-gradient(to bottom, #dbdbdbff, #850335ff, #190330ff)"
    : "linear-gradient(to bottom, #FFFDFE, #EC1166, #724B99)";
  return (
    <div
      className="w-full relative overflow-hidden mt-[8rem]"
      style={{
        background: backgroundStyle,
      }}
    >
      {/* Banner Image */}
      <div>
        <Image
          src="https://res.cloudinary.com/dk06cndku/image/upload/v1758747694/banner_eokjjm.png"
          alt="banner image"
          height={50}
          width={1500}
          className="w-full h-[100px] object-cover"
        />
      </div>

      {/* Optional content */}
      <div className="flex items-center justify-center gap-4 px-10 py-[8rem] text-white flex-col lg:flex-row animate-fadeUp">
        {/* Text content */}
        <div className="flex-1 lg:w-4/5 text-center lg:text-left">
          <h1 className="lg:text-4xl text-[14px] font-bold mb-2 animate-fadeUp delay-100">
            Find your dream job in <br /> Polkadot Ecosystem
          </h1>
          <p className="mt-2 animate-fadeUp delay-200">
            Explore opportunities in the decentralised web, connecting talent
            with innovative projects building future.
          </p>
        </div>

      </div>

      {/* Modern Search Bar */}
      <div className="mx-6 p-4 animate-fadeUp lg:px-0">
        {/* <div className="relative w-full lg:w-1/2">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for jobs, talents, projects..."
            className="w-full pl-12 pr-4 py-3 rounded-md text-14 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg bg-white"
          />
        </div> */}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .animate-fadeUp.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fadeUp.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fadeUp.delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

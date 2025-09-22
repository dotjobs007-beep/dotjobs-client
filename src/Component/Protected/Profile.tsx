"use client";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function ProfilePage() {
  return (
    <div className="lg:h-[89vh] px-6 py-10 flex justify-center items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🟣 Card 1 – User Info */}
        <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99] flex flex-col items-center text-center">
          <Image
            src="/images/image1.png"
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-white/30 mb-4"
          />
          <h2 className="text-2xl font-bold">Jane Doe</h2>
          <p className="text-sm text-white/80 mt-1">Full Stack Developer</p>
          <p className="text-xs text-white/70 mt-3">
            Joined on: <span className="font-medium">March 12, 2023</span>
          </p>
        </div>

        {/* 🟣 Card 2 – About */}
        <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
          <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
            About
          </h3>
          <p className="leading-relaxed text-white/90">
            Passionate developer with 5+ years of experience building web
            applications using modern technologies like Next.js, React, and
            Firebase. I love creating beautiful and functional user experiences
            and mentoring upcoming developers.
          </p>
        </div>

        {/* 🟣 Card 3 – Skills */}
        <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
          <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-3 mt-2">
            {["Next.js", "React", "TypeScript", "Firebase", "Tailwind CSS", "Node.js"].map(
              (skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 font-medium transition"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {/* 🟣 Card 4 – Social Media */}
        <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
          <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
            Connect
          </h3>
          <div className="flex gap-6 mt-2">
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

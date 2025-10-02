"use client";
import { useAuth } from "@/app/context/authcontext";
import { FaXTwitter, FaFacebookF, FaTelegram, FaGithub } from "react-icons/fa6";

export default function Footer() {
  const { theme } = useAuth();

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(to bottom, #dbdbdbff, #850335ff, #190330ff)"
      : "linear-gradient(to bottom, #FFFDFE, #EC1166, #724B99)";
  return (
    <div
      className="text-white px-8 py-2 text-center lg:px-[10rem] md:px-[5rem] lg:text-left w-full bottom-0 left-0"
      style={{ background: backgroundStyle }}
    >
      {" "}
      {/* Top Section */}
      {/* Links */}
      <div className="flex justify-between gap-6 flex-wrap">
        <div className="flex flex-col">
          <a
            href="/about"
            className="text-sm text-white underline mt-4 inline-block"
          >
            About Us
          </a>
          <a
            href="/about"
            className="text-sm text-white underline mt-4 inline-block"
          >
            Support
          </a>
        </div>
        <div className="flex flex-col">
          <a
            href="/services"
            className="text-sm text-white underline mt-4 inline-block"
          >
            Services
          </a>

          <a
            href="/services"
            className="text-sm text-white underline mt-4 inline-block"
          >
            Privacy Policy
          </a>
        </div>
        <div className="flex flex-col">
          <a
            href="/contact"
            className="text-sm text-white underline mt-4 inline-block"
          >
            Contact
          </a>
          <a
            href="/faq"
            className="text-sm text-white underline mt-4 inline-block"
          >
            FAQ
          </a>
        </div>
      </div>
      {/* Bottom Section - FLEX */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-10">
        {/* Left Column */}
        <div className="flex flex-col items-start w-full md:w-auto">
          <h1 className="text-l font-semibold mb-2">Connect with Us</h1>

          {/* Social Icons */}
          <div className="flex gap-4 mb-2 text-black text-2xl">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-gray-700 text-[22px] text-white"
            >
              <FaXTwitter />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="hover:text-gray-700 text-[22px] text-white"
            >
              <FaTelegram />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-gray-700 text-[22px] text-white"
            >
              <FaGithub />
            </a>
          </div>

          <p className="text-sm">© 2025 Dotjobs. All rights reserved</p>
        </div>

        {/* Right Column */}
        <div className="text-left md:text-right">
          <p className="mb-1">www.dotjob.com</p>
          <p>Dotcom@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

import { FaXTwitter, FaFacebookF, FaTelegram, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <div
      className="text-white px-8 py-12 text-center mt-[6rem]"
      style={{
        background: "linear-gradient(to bottom, #FFFDFE, #EC1166, #724B99)",
      }}
    >
      {/* Top Section */}
      <h1 className="text-[30px] font-[600] text-[#4E009D] mb-3">About Us</h1>
      <p
        className="mb-2 font-[800] text-[30px]"
        style={{ letterSpacing: "-4%", lineHeight: "100%" }}
      >
        Find your dream job in Polkadot Ecosystem
      </p>
      <p className="mt-[40px] text-[15px]">
        Explore opportunities in the decentralised web, <br />
        connecting talent with innovative projects building future.
      </p>

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
              aria-label="Facebook"
              className="hover:text-gray-700 text-[22px] text-white"
            >
              <FaFacebookF />
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

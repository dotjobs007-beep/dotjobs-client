"use client";
import Image from "next/image";
import Card from "./Card";
import { useAuth } from "@/app/context/authcontext";

interface AmbassadorCardProps {
  logo: string;
  companyName?: string;
  title: string;
  description: string;
  programType: string;
  commitmentLevel: string;
  duration?: string;
  compensationType: string;
  applicantCount?: number;
  onClick?: () => void;
  buttonText?: string;
}

export default function AmbassadorCard({
  logo,
  companyName,
  title,
  description,
  programType,
  commitmentLevel,
  duration,
  compensationType,
  applicantCount,
  onClick = () => {},
  buttonText = "View Details",
}: AmbassadorCardProps) {
  const { theme } = useAuth();
  
  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";
  
  return (
    <Card
      className="
        grid grid-cols-1 md:grid-cols-[4fr_1fr]
        gap-4 px-4 py-3
        shadow-sm
        items-start
        w-full
      "
    >
      {/* Avatar + Details */}
      <div className="flex flex-col gap-2 text-[12px] leading-snug min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt={`${title} program logo`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
              >
                {companyName?.charAt(0) || "A"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <b className={`text-[13px] ${theme === "dark" ? "text-[#F02A74]" : "text-[#4A3063]"} block truncate`}>
              {companyName}
            </b>
            <b className="text-[13px] text-white block truncate">{title}</b>
          </div>
        </div>

        <p className="text-[12px] text-white break-words">
          {description.length > 80
            ? description.slice(0, 80) + "..."
            : description}
        </p>

        <div className="flex flex-wrap gap-4">
          {/* Program Type Badge */}
          <span 
            className="text-[11px] px-2 py-1 rounded-full font-medium"
            style={{ 
              background: `${primaryColor}20`,
              color: primaryColor
            }}
          >
            🎯 {programType}
          </span>

          {/* Commitment Level */}
          <p className="text-[12px] text-white font-medium">
            ⏱️ {commitmentLevel}
          </p>

          {/* Duration */}
          {duration && (
            <p className="text-[12px] text-white font-medium">
              📅 {duration}
            </p>
          )}

          {/* Compensation */}
          <p className="text-[12px] text-white font-medium">
            💰 {compensationType}
          </p>

          {/* Applicant Count */}
          {applicantCount !== undefined && (
            <p className="text-[12px] text-white font-medium">
              👥 {applicantCount} applicants
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
            Ambassador Program
          </span>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end items-start">
        <button
          onClick={onClick}
          style={{ background: primaryColor }}
          className="
            text-white px-3 py-1.5
            rounded-md text-[12px] font-medium
            hover:opacity-90 transition
            whitespace-nowrap
          "
        >
          {buttonText}
        </button>
      </div>
    </Card>
  );
}

"use client";
import Image from "next/image";
import Card from "./Card";
import { useAuth } from "@/app/context/authcontext";

interface JobCardProps {
  logo: string;
  companyName?: string;
  title: string;
  description: string;
  tags: string[];
  salaryRange?: { min?: number; max?: number };
  salaryType?: string;
  applicantCount?: number;
  onClick?: () => void;
  buttonText?: string;
}

export default function JobCard({
  logo,
  companyName,
  title,
  description,
  tags,
  salaryRange,
  salaryType,
  applicantCount,
  onClick = () => {},
  buttonText = "Apply Now",
}: JobCardProps) {

  const {theme} = useAuth();
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
      {/* ✅ Avatar + Details */}
      <div className="flex flex-col gap-2 text-[12px] leading-snug min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={logo}
              alt={`${title} company logo`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <b className={`text-[13px] ${theme === "dark" ? "text-[#F02A74]" : "text-[#4A3063]"} block truncate`}>{companyName}</b>
            <b className="text-[13px] text-white block truncate">{title}</b>
          </div>
        </div>

        <p className="text-[12px] text-white break-words">
          {description.length > 50
            ? description.slice(0, 50) + "..."
            : description}
        </p>

        <div className="flex flex-wrap gap-4">
          {/* Salary Range */}
          <p className="text-[12px] text-white font-medium">
            Salary:{" "}
            {salaryRange
              ? `${salaryRange.min} - ${salaryRange.max} ${salaryType?.toLocaleUpperCase()}`
              : "Not specified"}
          </p>

          {/* Applicant Count */}
          {applicantCount !== undefined && (
            <p className="text-[12px] text-white font-medium">
              Applicants: {applicantCount}
            </p>
          )}
        </div>

        {/* Job Tags */}
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ✅ Fixed-width Apply Button */}
      <div className="flex justify-end items-start">
        <button
          onClick={onClick}
          className="
            bg-purple-600 text-white px-3 py-1.5
            rounded-md text-[12px] font-medium
            hover:bg-purple-700 transition
            whitespace-nowrap
          "
        >
          {buttonText}
        </button>
      </div>
    </Card>
  );
}

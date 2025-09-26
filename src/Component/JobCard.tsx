"use client";
import Image from "next/image";
import Card from "./Card";

interface JobCardProps {
  logo: string;
  title: string;
  description: string;
  tags: string[];
  salaryRange?: { min?: number; max?: number };
  onClick?: () => void;
  buttonText?: string;
}

export default function JobCard({
  logo,
  title,
  description,
  tags,
  salaryRange,
  onClick = () => {},
  buttonText = "Apply Now",
}: JobCardProps) {
  const salaryText =
    salaryRange && (salaryRange.min || salaryRange.max)
      ? `${salaryRange.min ? `${salaryRange.min.toLocaleString()}` : ""}${
          salaryRange.min && salaryRange.max ? " - " : ""
        }${salaryRange.max ? `${salaryRange.max.toLocaleString()}` : ""}`
      : "Not specified";

  return (
    <Card
      className="
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-4 mt-6 px-4 py-3
        shadow-sm
      "
    >
      {/* Avatar Logo */}
      <div className="flex justify-center md:justify-start">
        <Image
          src={logo}
          alt={`${title} company logo`}
          width={48}
          height={48}
          className="rounded-full object-cover bg-gray-100"
        />
      </div>

      {/* Details + Button */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        {/* Job Details */}
        <div className="flex flex-col gap-2 text-center md:text-left text-[12px] leading-snug">
          <b className="text-[13px] block">{title}</b>

          <p className="text-[12px] max-w-xs mx-auto md:mx-0 text-gray-700 line-clamp-3">
            {description}
          </p>

          {/* Salary Range */}
          <p className="text-[12px] text-gray-600 font-medium">
            Salary: {salaryText}
          </p>

          {/* Job Tags */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[11px] font-medium">
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

        {/* Apply Button */}
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

"use client";
import Image from "next/image";
import Card from "./Card";

interface JobCardProps {
  logo: string;
  title: string;
  description: string;
  tags: string[];
}

//  flex flex-col md:flex-row
//         md:items-center md:justify-between
export default function JobCard({
  logo,
  title,
  description,
  tags,
}: JobCardProps) {
  return (
    <Card
      className="
        flex flex-col md:flex-row 
        md:items-center md:justify-between 
        gap-6 mt-10 
      shadow-md"
    >
      {/* Company Logo */}
      <div className="flex justify-center md:justify-start">
        <Image
          src={logo}
          alt={`${title} company logo`}
          width={150}
          height={150}
          className="rounded-lg bg-white/20 p-2"
        />
      </div>

      {/* Middle Section: Job Details + Button */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
        {/* Job Details */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div>
            <b className="text-xl block mb-1">{title}</b>
            <p className="text-[12px] max-w-md mx-auto md:mx-0">
              {description}
            </p>
          </div>

          {/* Job Info Tags */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium">
            {tags.map((tag, idx) => (
              <div key={idx} className="bg-white/20 px-3 py-1 rounded-full">
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          className="
          bg-white text-[#724B99] px-5 py-2 rounded-lg 
          font-semibold hover:bg-gray-100 transition 
          whitespace-nowrap
        "
        >
          Apply Now
        </button>
      </div>
    </Card>
  );
}

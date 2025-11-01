"use client";

import { useAuth } from "@/app/context/authcontext";
import { useJob } from "@/app/context/jobcontext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { IoMegaphoneSharp } from "react-icons/io5";
import { MdDesignServices, MdDeveloperMode } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { useRouter } from "next/navigation";

export type CategoryCardProps = {
  icon: React.ReactNode;
  alt: string;
  label: string;
  delay?: number; // Stagger delay
  value?: string;
};

export function CategoryCard({
  icon,
  alt,
  value,
  label,
  delay = 0,
}: CategoryCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useAuth();
  const { setCategory } = useJob();
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const navigateToCategory = (label: string) => {
    // Logic to navigate to category page
    setCategory({ icon, alt, label, value });
    router.push("/jobs");
  }

  return (
    <div
      ref={ref}
      className={`rounded-lg overflow-hidden flex flex-col pl-4 lg:pl-0 md:pl-0 lg:items-center items-start justify-between h-20 ${
        theme === "dark" ? "bg-[#1A0330]" : "bg-[#734A98]"
      }
        transform transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        hover:scale-105 hover:shadow-2xl shadow-lg cursor-pointer`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={() => navigateToCategory(label)}
    >
      {/* Label Section */}
      <div className="w-full lg:text-center py-5 flex lg:justify-center lg:items-center gap-2">
        {icon}
        <p className="text-[16px] font-bold text-white">{label}</p>
      </div>
    </div>
  );
}

// Main Category component
export default function Category() {
  const categories = [
    {
      icon: <MdDeveloperMode className="text-[30px] text-[#CB2174]" />,
      alt: "Category 1",
      label: "Development",
      value: "development",
    },
    {
      icon: <MdDesignServices className="text-[30px] text-[#CB2174]" />,
      alt: "Category 2",
      label: "Design",
      value: "design",
    },
    {
      icon: <GrUserManager className="text-[30px] text-[#CB2174]" />,
      alt: "Category 3",
      label: "Management",
      value: "management",
    },
    {
      icon: <IoMegaphoneSharp className="text-[30px] text-[#CB2174]" />,
      alt: "Category 4",
      label: "Marketing & Advertising",
      value: "marketing_advertising",
    },
    {
      icon: <TfiWrite className="text-[30px] text-[#CB2174]" />,
      alt: "Category 5",
      label: "Writing",
      value: "writing",
    },
  ];

  return (
    <div className="mt-20 px-4">
      <h1 className="font-bold lg:text-[35px] text-[25px] mb-8 text-center lg:text-left">
        Browse By Category
      </h1>

      <div
        className={`grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4`}
      >
        {categories.map((cat, idx) => (
          <CategoryCard
            key={idx}
            icon={cat.icon}
            alt={cat.alt}
            label={cat.label}
            delay={idx * 150} // stagger animation
            value={cat.value}
          />
        ))}
      </div>
    </div>
  );
}

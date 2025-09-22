"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import JobCard from "../JobCard";
import jobs from "../../mock/job.json"

type CategoryCardProps = {
  imageSrc: string;
  alt: string;
  label: string;
  delay?: number; // Stagger delay
};

export function CategoryCard({ imageSrc, alt, label, delay = 0 }: CategoryCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      ref={ref}
      className={`rounded-lg overflow-hidden flex flex-col items-center justify-between h-56 bg-[#724B99]
        transform transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        hover:scale-105 hover:shadow-2xl shadow-lg`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image Section */}
      <div className="flex items-center justify-center flex-1 p-4">
        <Image
          src={imageSrc}
          alt={alt}
          width={220}
          height={220}
          className="object-contain max-h-40"
        />
      </div>

      {/* Label Section */}
      <div className="w-full text-center py-2 bg-gray-50">
        <p className="text-[16px] font-bold text-gray-700">{label}</p>
      </div>
    </div>
  );
}



// Main Category component
export default function Category() {
  const categories = [
    { imageSrc: "/images/image1.png", alt: "Category 1", label: "Design" },
    { imageSrc: "/images/image2.png", alt: "Category 2", label: "Development" },
    { imageSrc: "/images/image3.png", alt: "Category 3", label: "Marketing" },
    { imageSrc: "/images/image4.png", alt: "Category 4", label: "Writing" },
  ];

  return (
    <div className="mt-20 px-4">
      <h1 className="font-bold lg:text-[35px] text-[25px] mb-8 text-center lg:text-left">
        Browse By Category
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={idx}
            imageSrc={cat.imageSrc}
            alt={cat.alt}
            label={cat.label}
            delay={idx * 150} // stagger animation
          />
        ))}
      </div>

      {jobs.map((el, i) => {
        return <JobCard key={i} logo={el.logo} title={el.title} description={el.description} tags={el.tags}  />
      })}

    </div>
  );
}

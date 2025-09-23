"use client";
import Card from "@/Component/Card";
import JobCard from "@/Component/JobCard";
import { useState } from "react";
import jobs from "../../../mock/job.json";
export default function MyJobs() {
  // const [query, setQuery] = useState("");
  // const [category, setCategory] = useState("All"); // default selected

  // const categories = ["All", "Full-time", "Remote", "Hybrid", "Gig"];

  // const handleSearch = () => {
  //   console.log("Searching for:", query, "Category:", category);
  //   // Integrate your search/filter logic here
  // };

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[10rem]">
     <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Jobs</h1>
      <p className="text-gray-600 mb-6">Manage your job applications and track your progress.</p>
      {/* Job Cards */}
      <div className="w-full mt-10 flex flex-col gap-6">
        {jobs.map((el, i) => (
          <JobCard
            key={i}
            logo={el.logo}
            title={el.title}
            description={el.description}
            tags={el.tags}
            buttonText="View Application"
          />
        ))}
      </div>
    </div>
  );
}

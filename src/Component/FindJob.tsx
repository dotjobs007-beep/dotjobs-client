"use client";
import Card from "./Card";
import { useState } from "react";
import JobCard from "./JobCard";
import jobs from "../mock/job.json";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All"); // default selected

  const categories = ["All", "Full-time", "Remote", "Hybrid", "Gig"];

  const handleSearch = () => {
    console.log("Searching for:", query, "Category:", category);
    // Integrate your search/filter logic here
  };

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[10rem]">
      {/* Header */}
      <div className="mb-6 text-center max-w-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Find your dream job
        </h1>
        <p className="text-gray-600">
          Discover opportunities in the decentralised web, connecting talent
          with innovative projects building the future.
        </p>
      </div>

      {/* Sticky Card */}
      <div className="w-full lg:mt-6 md:mt-6 sticky top-15 z-50">
        <Card className="p-10 lg:p-12 flex flex-col items-center gap-4 w-full bg-white transition-all duration-300">
          {/* Search Input + Button */}
          <div className="w-full flex flex-col lg:flex-row items-center gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, companies, skills..."
              className="
                w-full lg:flex-1 px-4 text-[#00000080] py-3 rounded-lg border border-gray-300
                focus:outline-none
                bg-[#FDD7FD]
              "
            />
            <button
              onClick={handleSearch}
              className="
                mt-3 lg:mt-0 w-full lg:w-48 bg-purple-600 hover:bg-purple-700
                text-white px-6 py-3 rounded-lg font-semibold transition-colors
                whitespace-nowrap
              "
            >
              Search
            </button>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  backgroundColor: category === cat ? "#764A98" : undefined,
                }}
                className={`
                  px-4 py-2 rounded-full font-medium transition-colors
                  ${category === cat ? "text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Job Cards */}
      <div className="w-full mt-10 flex flex-col gap-6">
        {jobs.map((el, i) => (
          <JobCard
            key={i}
            logo={el.logo}
            title={el.title}
            description={el.description}
            tags={el.tags}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import Card from "./Card";
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import {
  IApiResponse,
  IJob,
  IJobResponse,
  IPagination,
} from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import { useJob } from "@/app/context/jobcontext";

export default function Jobs() {
  const { companyName, category, jobQuery, setCategory } = useJob();

  const [query, setQuery] = useState(jobQuery);
  const [employmentType, setEmploymentType] = useState("");
  const [workArrangement, setWorkArrangement] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const employmentTypes = ["", "full-time", "part-time", "contract"];
  const workArrangements = ["", "remote", "hybrid", "on-site"];
  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "-createdAt", label: "Oldest" },
    { value: "-salary", label: "Salary High → Low" },
    { value: "salary", label: "Salary Low → High" },
  ];

  const fetchJobs = async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        sortBy,
      });

      if (query) params.append("title", query);
      if (employmentType) params.append("employmentType", employmentType);
      if (workArrangement) params.append("workArrangement", workArrangement);
      if (minSalary) params.append("minSalary", minSalary);
      if (maxSalary) params.append("maxSalary", maxSalary);
      if (companyName) params.append("companyName", companyName);
      if (category) params.append("category", category.toLocaleLowerCase());
      const res: IApiResponse<IJobResponse> = await service.fetcher(
        `/job/fetch-jobs?${params.toString()}`,
        "GET",
        { withCredentials: true }
      );

      if (res.code === 401) {
        router.replace("/auth/signin");
        return;
      }

      if (!res.data || res.status === "error") {
        setJobs([]);
        setPagination(null);
        return;
      }

      setJobs(res.data.data);
      setPagination(res.data.pagination);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, companyName]);

  const handleApplyFilters = () => fetchJobs(1);
  const nextPage = () =>
    pagination && page < pagination.totalPages && fetchJobs(page + 1);
  const prevPage = () => page > 1 && fetchJobs(page - 1);
  const { setJobDetails } = useJob();

  const handleDisplayJobDetails = (job: IJob) => {
    setJobDetails(job);
    router.push(`/jobs/${job._id}`);
  };

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[8rem]">
      {/* HEADER */}
      <div className="mb-6 text-center max-w-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Browse Available Jobs
        </h1>
        <p className="text-gray-600">Filter, sort and find your next role.</p>
      </div>

      {/* FILTER CARD */}
      <Card className="p-6 w-full bg-white shadow-md rounded-xl space-y-6 lg:sticky top-16 z-40">
        {/* SEARCH */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 lg:w-[90%] w-full text-gray-600 py-3 border border-gray-300 rounded-lg bg-[#FDD7FD]"
          />
          <button
            onClick={handleApplyFilters}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Apply Filters
          </button>
        </div>

        {/* INLINE DROPDOWNS */}
        {/* INLINE DROPDOWNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* CATEGORY DROPDOWN */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Category</label>
            <select
              name="category"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
            >
              <option value="">{category || "Select category"}</option>
              <optgroup label="Business & Marketing">
                <option value="marketing_advertising">
                  Marketing & Advertising
                </option>
                <option value="digital marketing">Digital Marketing</option>
                <option value="social media">Social Media Management</option>
                <option value="brand management">Brand Management</option>
                <option value="sales">Sales & Business Development</option>
                <option value="product management">Product Management</option>
                <option value="community management">
                  Community Management & Moderation
                </option>
              </optgroup>
              <optgroup label="Technology & Development">
                <option value="web development">Web Development</option>
                <option value="mobile app">Mobile App Development</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="it support">IT Support & Networking</option>
                <option value="blockchain">Blockchain Development</option>
                <option value="blockchain">Smart Contract Development</option>
                <option value="blockchain">Rust Development</option>
              </optgroup>
              <optgroup label="Creative & Design">
                <option value="graphic design">Graphic Design</option>
                <option value="uiux">UI/UX Design</option>
                <option value="video editing">
                  Video Production & Editing Design
                </option>
                <option value="animation">
                  Animation & Motion Graphics Design
                </option>
                <option value="game design">
                  Game Design & Development Design
                </option>

                <option value="writing">Writing & Content</option>
              </optgroup>
              <optgroup label="Human Resources & Management">
                <option value="hr recruitment">
                  HR & Recruitment Management
                </option>
                <option value="operations">Operations Management</option>
              </optgroup>
            </select>
          </div>
          {/* Employment Type */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-gray-600 text-sm"
            >
              <option value="">All</option>
              {employmentTypes.map(
                (type) =>
                  type && (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
              )}
            </select>
          </div>

          {/* Work Arrangement */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Work Arrangement</label>
            <select
              value={workArrangement}
              onChange={(e) => setWorkArrangement(e.target.value)}
              className="border border-gray-300 text-gray-600 rounded-md px-2 py-1 text-sm"
            >
              <option value="">All</option>
              {workArrangements.map(
                (arr) =>
                  arr && (
                    <option key={arr} value={arr}>
                      {arr}
                    </option>
                  )
              )}
            </select>
          </div>

          {/* Salary Min */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Min Salary</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Salary Max */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Max Salary</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Sort By */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border text-gray-600 border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* JOB LIST */}
      <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length ? (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              logo={job.logo || ""}
              companyName={job.company_name || ""}
              title={job.title}
              description={job.description}
              tags={[
                job.employment_type,
                job.salary_type,
                job.work_arrangement,
              ]}
              applicantCount={job.applicantCount}
              salaryType={job.salary_token}
              salaryRange={job.salary_range}
              onClick={() => handleDisplayJobDetails(job)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={prevPage}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-2 text-gray-700">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={nextPage}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

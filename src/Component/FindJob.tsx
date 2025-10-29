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
import { Search, MapPin, Users, Filter, ChevronLeft, ChevronRight, Sparkles, Briefcase, DollarSign } from "lucide-react";
import { useAuth } from "@/app/context/authcontext";

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
  const { theme } = useAuth();

  const employmentTypes = ["", "full-time", "part-time", "contract"];
  const workArrangements = ["", "remote", "hybrid", "on-site"];
  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "-createdAt", label: "Oldest" },
    { value: "-salary", label: "Salary High → Low" },
    { value: "salary", label: "Salary Low → High" },
  ];
  const color = theme === "dark" ? "text-[#fff]" : "text-[#734A98]";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Briefcase className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className={`text-4xl lg:text-5xl font-bold ${color} `}>
                Browse Jobs
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing opportunities in the Polkadot ecosystem
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Briefcase className="h-4 w-4 mr-2" />
              {pagination && <span>{pagination.totalJobs} available positions</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Main Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="relative md:col-span-5">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs by title or company..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
              
              <div className="md:col-span-3">
                <select
                  name="category"
                  value={category || ""}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="">All Categories</option>
                  <optgroup label="Business & Marketing">
                    <option value="marketing_advertising">Marketing & Advertising</option>
                    <option value="digital marketing">Digital Marketing</option>
                    <option value="social media">Social Media Management</option>
                    <option value="brand management">Brand Management</option>
                    <option value="sales">Sales & Business Development</option>
                    <option value="product management">Product Management</option>
                    <option value="community management">Community Management & Moderation</option>
                  </optgroup>
                  <optgroup label="Technology & Development">
                    <option value="web development">Web Development</option>
                    <option value="mobile app">Mobile App Development</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="it support">IT Support & Networking</option>
                    <option value="blockchain">Blockchain Development</option>
                  </optgroup>
                  <optgroup label="Creative & Design">
                    <option value="graphic design">Graphic Design</option>
                    <option value="uiux">UI/UX Design</option>
                    <option value="video editing">Video Production & Editing</option>
                    <option value="animation">Animation & Motion Graphics</option>
                    <option value="writing">Writing & Content</option>
                  </optgroup>
                </select>
              </div>
              
              <div className="md:col-span-4">
                <button
                  onClick={handleApplyFilters}
                  className="w-full h-[80%] bg-blue-600 hover:bg-blue-700 text-white px-1 py-6 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-lg text-sm flex items-center justify-center"
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="Min salary"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="Max salary"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
              
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="">All Types</option>
                {employmentTypes.map(
                  (type) =>
                    type && (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    )
                )}
              </select>
              
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="">All Arrangements</option>
                {workArrangements.map(
                  (arr) =>
                    arr && (
                      <option key={arr} value={arr}>
                        {arr.charAt(0).toUpperCase() + arr.slice(1)}
                      </option>
                    )
                )}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Filters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria or browse all available positions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
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
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex justify-center items-center">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-2 flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={prevPage}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </button>
              
              <div className="flex items-center space-x-2 px-4">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchJobs(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-gray-400 px-2">...</span>
                    <button
                      onClick={() => fetchJobs(pagination.totalPages)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                        pagination.totalPages === page
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                disabled={page === pagination.totalPages}
                onClick={nextPage}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </button>
            </div>
          </div>
          
          <div className="text-center mt-6 text-gray-500">
            Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, pagination.totalJobs || 0)} of {pagination.totalJobs || 0} jobs
          </div>
        </div>
      )}
    </div>
  );
}

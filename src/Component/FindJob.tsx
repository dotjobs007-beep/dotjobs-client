"use client";

import Card from "./Card";
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import AmbassadorCard from "./AmbassadorCard";
import {
  IApiResponse,
  IJob,
  IJobResponse,
  IPagination,
  IPublicService,
  IAmbassador,
  IAmbassadorPagination,
  IAmbassadorPublicService,
} from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import { useJob } from "@/app/context/jobcontext";
import { CategoryOptions } from "@/constants/categories";
import { useAuth } from "@/app/context/authcontext";
import { Briefcase, Users } from "lucide-react";

type OpportunityType = "jobs" | "ambassadors";

export default function Jobs() {
  const { companyName, category, jobQuery, setCategory } = useJob();
  const { theme } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<OpportunityType>("jobs");

  // Job state
  const [query, setQuery] = useState(jobQuery);
  const [employmentType, setEmploymentType] = useState("");
  const [workArrangement, setWorkArrangement] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Ambassador state
  const [ambassadors, setAmbassadors] = useState<IAmbassador[]>([]);
  const [ambassadorPagination, setAmbassadorPagination] = useState<IAmbassadorPagination | null>(null);
  const [ambassadorPage, setAmbassadorPage] = useState(1);
  const [ambassadorLoading, setAmbassadorLoading] = useState(false);
  const [ambassadorQuery, setAmbassadorQuery] = useState("");
  const [programType, setProgramType] = useState("");
  const [commitmentLevel, setCommitmentLevel] = useState("");
  const [ambassadorSortBy, setAmbassadorSortBy] = useState("createdAt");

  const programTypes = ["", "community", "content", "technical", "regional", "brand"];
  const commitmentLevels = ["", "full-time", "part-time", "flexible"];

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  const employmentTypes = ["", "full-time", "part-time", "contract"];
  const workArrangements = ["", "remote", "hybrid", "on-site"];
  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "-createdAt", label: "Oldest" },
    { value: "-salary", label: "Salary High → Low" },
    { value: "salary", label: "Salary Low → High" },
  ];

  // Parse salary range input
  const parseSalaryRange = (input: string) => {
    if (!input.trim()) return { minSalary: "", maxSalary: "", error: "" };
    
    // Check if it's a range (contains hyphen)
    if (input.includes('-')) {
      const parts = input.split('-').map(part => part.trim());
      if (parts.length === 2) {
        const min = parseFloat(parts[0]);
        const max = parseFloat(parts[1]);
        
        if (isNaN(min) || isNaN(max)) {
          return { minSalary: "", maxSalary: "", error: "Please enter valid numbers" };
        }
        
        if (max < min) {
          return { minSalary: "", maxSalary: "", error: "Maximum salary cannot be less than minimum" };
        }
        
        return { minSalary: min.toString(), maxSalary: max.toString(), error: "" };
      }
    } else {
      // Single value - use as minimum
      const value = parseFloat(input);
      if (isNaN(value)) {
        return { minSalary: "", maxSalary: "", error: "Please enter a valid number" };
      }
      return { minSalary: value.toString(), maxSalary: "", error: "" };
    }
    
    return { minSalary: "", maxSalary: "", error: "Invalid format. Use single number or range like 100-200" };
  };

  // Handle salary range input change
  const handleSalaryRangeChange = (value: string) => {
    setSalaryRange(value);
    const { error } = parseSalaryRange(value);
    setSalaryError(error);
  };

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
      if (companyName) params.append("companyName", companyName);
      if (category && category.value) params.append("category", category.value.toLocaleLowerCase());
      
      // Parse and append salary range
      const { minSalary, maxSalary } = parseSalaryRange(salaryRange);
      if (minSalary) params.append("minSalary", minSalary);
      if (maxSalary) params.append("maxSalary", maxSalary);
      
      // Debug: log the parameters being sent
      
      const res: IApiResponse<IPublicService> = await service.fetcher(
        `/public/jobs?${params.toString()}`,
        "GET"
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

      // Handle the public service response structure
      const jobsData = res.data.job?.data || [];
      const paginationData = res.data.job?.pagination;
      
      // Build pagination object with the additional fields from the top level
      const pagination: IPagination | null = paginationData ? {
        totalJobs: res.data.totalJobs || paginationData.totalJobs,
        totalPages: res.data.totalPages || paginationData.totalPages,
        currentPage: paginationData.currentPage,
        pageSize: paginationData.pageSize,
      } : null;

      setJobs(jobsData);
      setPagination(pagination);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchJobs(1);
    }, 500); // 500ms delay for search input

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Immediate filtering for dropdowns and other inputs
  useEffect(() => {
    if (!salaryError) { // Only fetch if there's no salary error
      fetchJobs(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, companyName, employmentType, workArrangement, salaryRange, sortBy]);

  // Fetch ambassadors
  const fetchAmbassadors = async (pageNum: number) => {
    setAmbassadorLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        sortBy: ambassadorSortBy,
      });

      if (ambassadorQuery) params.append("title", ambassadorQuery);
      if (programType) params.append("programType", programType);
      if (commitmentLevel) params.append("commitmentLevel", commitmentLevel);

      const res: IApiResponse<IAmbassadorPublicService> = await service.fetcher(
        `/public/ambassadors?${params.toString()}`,
        "GET"
      );

      if (res.code === 401) {
        router.replace("/auth/signin");
        return;
      }

      if (!res.data || res.status === "error") {
        setAmbassadors([]);
        setAmbassadorPagination(null);
        return;
      }

      const ambassadorsData = res.data.ambassador?.data || [];
      const paginationData = res.data.ambassador?.pagination;

      const pagination: IAmbassadorPagination | null = paginationData ? {
        totalAmbassadors: res.data.totalAmbassadors || paginationData.totalAmbassadors,
        totalPages: res.data.totalPages || paginationData.totalPages,
        currentPage: paginationData.currentPage,
        pageSize: paginationData.pageSize,
      } : null;

      setAmbassadors(ambassadorsData);
      setAmbassadorPagination(pagination);
      setAmbassadorPage(pageNum);
    } finally {
      setAmbassadorLoading(false);
    }
  };

  // Debounce search for ambassadors
  useEffect(() => {
    if (activeTab === "ambassadors") {
      const debounceTimer = setTimeout(() => {
        fetchAmbassadors(1);
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambassadorQuery, activeTab]);

  // Immediate filtering for ambassador dropdowns
  useEffect(() => {
    if (activeTab === "ambassadors") {
      fetchAmbassadors(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programType, commitmentLevel, ambassadorSortBy, activeTab]);

  const nextPage = () =>
    pagination && page < pagination.totalPages && fetchJobs(page + 1);
  const prevPage = () => page > 1 && fetchJobs(page - 1);
  
  const nextAmbassadorPage = () =>
    ambassadorPagination && ambassadorPage < ambassadorPagination.totalPages && fetchAmbassadors(ambassadorPage + 1);
  const prevAmbassadorPage = () => ambassadorPage > 1 && fetchAmbassadors(ambassadorPage - 1);
  
  const { setJobDetails } = useJob();

  const handleDisplayJobDetails = (job: IJob) => {
    setJobDetails(job);
    router.push(`/jobs/${job._id}`);
  };

  const handleDisplayAmbassadorDetails = (ambassador: IAmbassador) => {
    router.push(`/ambassador/${ambassador._id}`);
  };

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[8rem]">
      {/* HEADER */}
      <div className="mb-6 text-center max-w-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Find Opportunities
        </h1>
        <p className="text-gray-600">Discover jobs and ambassador programs in the Polkadot ecosystem.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "jobs"
              ? "text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400"
          }`}
          style={{
            background: activeTab === "jobs" ? primaryColor : "transparent",
          }}
        >
          <Briefcase className="w-4 h-4" />
          Jobs
        </button>
        <button
          onClick={() => setActiveTab("ambassadors")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "ambassadors"
              ? "text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 dark:text-gray-400"
          }`}
          style={{
            background: activeTab === "ambassadors" ? primaryColor : "transparent",
          }}
        >
          <Users className="w-4 h-4" />
          Ambassador Programs
        </button>
      </div>

      {/* JOBS CONTENT */}
      {activeTab === "jobs" && (
        <>
          {/* FILTER CARD */}
          <Card className="p-2 w-full bg-white shadow-md rounded-xl space-y-6 lg:sticky top-16 z-40">
            {/* MAIN ROW - SEARCH + PRIMARY FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {/* SEARCH FILTER */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search by title or company..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-4 w-full text-black py-3 border border-gray-300 rounded-lg bg-[#FDD7FD] focus:outline-none"
                />
              </div>

              {/* CATEGORY DROPDOWN */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Category</label>
                <select
                  name="category"
                  value={category?.value || ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue) {
                      const selectedCategory = CategoryOptions().props.children.find(
                        (option: any) => option.props.value === selectedValue
                      );
                      if (selectedCategory) {
                        setCategory({
                          value: selectedValue, label: selectedCategory.props.children,
                          icon: undefined,
                          alt: ""
                        });
                      }
                    } else {
                      setCategory({
                        value: "",
                        label: "",
                        icon: undefined,
                        alt: ""
                      });
                    }
                  }}
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                >
                  <CategoryOptions />
                </select>
              </div>

              {/* Employment Type - Hidden on medium, shown on large */}
              <div className="flex flex-col text-sm hidden lg:flex">
                <label className="mb-1 font-medium">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-gray-600 focus:outline-none"
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

              {/* Work Arrangement - Hidden on medium, shown on large */}
              <div className="flex flex-col text-sm hidden lg:flex">
                <label className="mb-1 font-medium">Work Arrangement</label>
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className="border border-gray-300 text-gray-600 rounded-lg px-3 py-3 focus:outline-none"
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
            </div>

            {/* SECONDARY ROW - ADDITIONAL FILTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {/* Employment Type - Shown on medium screens */}
              <div className="flex flex-col text-sm lg:hidden">
                <label className="mb-1 font-medium">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-gray-600 focus:outline-none"
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

              {/* Work Arrangement - Shown on medium screens */}
              <div className="flex flex-col text-sm lg:hidden">
                <label className="mb-1 font-medium">Work Arrangement</label>
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value)}
                  className="border border-gray-300 text-gray-600 rounded-lg px-3 py-3 focus:outline-none"
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

              {/* Salary Range */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. 1000 (min only) or 1000-5000 (range)"
                  value={salaryRange}
                  onChange={(e) => handleSalaryRangeChange(e.target.value)}
                  className={`border rounded-lg px-3 py-3 focus:outline-none ${
                    salaryError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {salaryError ? (
                  <span className="text-red-500 text-xs mt-1">{salaryError}</span>
                ) : (
                  <span className="text-gray-400 text-xs mt-1">
                    Enter minimum only or range (min-max)
                  </span>
                )}
              </div>

              {/* Sort By */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border text-gray-600 border-gray-300 rounded-lg px-3 py-3 focus:outline-none"
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
              <p className="text-center text-gray-500 col-span-2">No jobs found.</p>
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
        </>
      )}

      {/* AMBASSADORS CONTENT */}
      {activeTab === "ambassadors" && (
        <>
          {/* FILTER CARD */}
          <Card className="p-2 w-full bg-white shadow-md rounded-xl space-y-6 lg:sticky top-16 z-40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {/* SEARCH FILTER */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search ambassador programs..."
                  value={ambassadorQuery}
                  onChange={(e) => setAmbassadorQuery(e.target.value)}
                  className="px-4 w-full text-black py-3 border border-gray-300 rounded-lg bg-[#FDD7FD] focus:outline-none"
                />
              </div>

              {/* Program Type */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Program Type</label>
                <select
                  value={programType}
                  onChange={(e) => setProgramType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-gray-600 focus:outline-none"
                >
                  <option value="">All Types</option>
                  {programTypes.map(
                    (type) =>
                      type && (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      )
                  )}
                </select>
              </div>

              {/* Commitment Level */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Commitment Level</label>
                <select
                  value={commitmentLevel}
                  onChange={(e) => setCommitmentLevel(e.target.value)}
                  className="border border-gray-300 text-gray-600 rounded-lg px-3 py-3 focus:outline-none"
                >
                  <option value="">All Levels</option>
                  {commitmentLevels.map(
                    (level) =>
                      level && (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      )
                  )}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-medium">Sort By</label>
                <select
                  value={ambassadorSortBy}
                  onChange={(e) => setAmbassadorSortBy(e.target.value)}
                  className="border text-gray-600 border-gray-300 rounded-lg px-3 py-3 focus:outline-none"
                >
                  <option value="createdAt">Newest</option>
                  <option value="-createdAt">Oldest</option>
                </select>
              </div>
            </div>
          </Card>

          {/* AMBASSADOR LIST */}
          <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ambassadorLoading ? (
              <p className="text-center text-gray-500">Loading ambassador programs...</p>
            ) : ambassadors.length ? (
              ambassadors.map((ambassador) => (
                <AmbassadorCard
                  key={ambassador._id}
                  logo={ambassador.logo || ""}
                  companyName={ambassador.company_name || ""}
                  title={ambassador.title}
                  description={ambassador.description}
                  programType={ambassador.program_type}
                  commitmentLevel={ambassador.commitment_level}
                  duration={ambassador.duration}
                  compensationType={ambassador.compensation_type}
                  applicantCount={ambassador.applicantCount}
                  onClick={() => handleDisplayAmbassadorDetails(ambassador)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No ambassador programs found.</p>
            )}
          </div>

          {/* PAGINATION */}
          {ambassadorPagination && ambassadorPagination.totalPages > 1 && (
            <div className="flex gap-4 mt-8">
              <button
                disabled={ambassadorPage === 1}
                onClick={prevAmbassadorPage}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 py-2 text-gray-700">
                Page {ambassadorPage} of {ambassadorPagination.totalPages}
              </span>
              <button
                disabled={ambassadorPage === ambassadorPagination.totalPages}
                onClick={nextAmbassadorPage}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import JobCard from "@/Component/JobCard";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import {
  IApiResponse,
  IJob,
  IJobResponse,
  IPagination,
} from "@/interface/interface";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/app/context/authcontext";

export default function MyJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { theme } = useAuth();
  
  const fetchMyJobs = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum !== 1)) return;

    setLoading(true);
    const res: IApiResponse<IJobResponse> = await service.fetcher(
      `/job/fetch-job-by-user?page=${pageNum}&limit=10`,
      "GET",
      { withCredentials: true }
    );
    if (res.code === 401) {
      router.replace("/auth/signin");
      setLoading(false);
      return;
    }

    if (!res.data || res.status === "error") {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const newJobs: IJob[] = res.data.data;
    const pagination: IPagination = res.data.pagination;

    // ✅ If it's the first page, REPLACE instead of append
    setJobs((prev) => (pageNum === 1 ? newJobs : [...prev, ...newJobs]));

    setHasMore(pageNum < pagination.totalPages);
    setPage(pageNum);
    setLoading(false);
  };

  // ✅ Initial fetch
  useEffect(() => {
    // window.location.reload();
    fetchMyJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    const color = theme === "dark" ? "text-[#fff]" : "text-[#734A98]";


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
                My Jobs
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage your job postings and track their performance
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{jobs.length} active job postings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((el) => (
          <JobCard
            key={el._id}
            logo={el.logo || "/default-logo.png"}
            title={el.title}
            description={el.description}
            tags={[
              el.employment_type,
              el.salary_type,
              el.work_arrangement,
              el.company_location,
            ]}
            salaryType={el.salary_token}
            salaryRange={el.salary_range}
            buttonText="View Details"
            onClick={() => router.push(`/jobs/my_jobs/${el._id}`)}
          />
        ))}
      </div>

      {/* ✅ View More Button */}
      {hasMore && !loading && (
        <button
          onClick={() => fetchMyJobs(page + 1)}
          className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-md hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          View More
        </button>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-6">
          <Spinner isLoading={true} />
        </div>
      )}

      {/* End Message */}
      {!hasMore && !loading && jobs.length > 0 && (
        <p className="mt-6 text-gray-500">🎉 You’ve reached the end.</p>
      )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start by creating your first job posting to attract talented candidates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

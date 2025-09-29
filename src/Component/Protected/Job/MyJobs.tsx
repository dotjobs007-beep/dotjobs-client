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

export default function MyJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[10rem]">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Jobs</h1>
      <p className="text-gray-600 mb-6 text-center">
        Manage your job postings and track their performance.
      </p>

      {/* Job List */}
      <div className="w-full mt-10 flex flex-col gap-6">
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
        <p className="mt-6 text-gray-500">No jobs found.</p>
      )}
    </div>
  );
}

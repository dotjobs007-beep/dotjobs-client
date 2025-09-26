"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import toast from "react-hot-toast";
import {
  IJobDetails,
  IApiResponse,
  IJobApplicant,
  IApplicantListResponse,
} from "@/interface/interface";

export default function MyJobDetails() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<IJobDetails | null>(null);

  // ✅ Applicants modal & drawer states
  const [showModal, setShowModal] = useState(false);
  const [applicants, setApplicants] = useState<IJobApplicant[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingApplicants, setFetchingApplicants] = useState(false);
  const [selected, setSelected] = useState<IJobApplicant | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Fetch Job
  const fetchJobDetails = async () => {
    const id = params?.id as string;
    if (!id) return;
    setLoading(true);
    try {
      const res: IApiResponse<IJobDetails> = await service.fetcher(
        `/job/fetch-job/${id}`
      );
      if (res.code === 401) {
        router.replace("/auth/signin");
        return;
      }
      if (!res.data || res.status === "error") {
        router.replace("/jobs/my_jobs");
        return;
      }
      setJob(res.data);
    } catch {
      router.replace("/jobs/my_jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [params?.id]);

  // ✅ Fetch Applicants with pagination
  const fetchApplicants = async (pg = 1, limit = 5) => {
    if (!job || fetchingApplicants || (!hasMore && pg !== 1)) return;
    setFetchingApplicants(true);
    try {
      const res: IApiResponse<IApplicantListResponse> = await service.fetcher(
        `/job/applications/${job._id}?page=${pg}&limit=${limit}`
      );

      if (!res.data) {
        toast.error("Failed to fetch applicants");
        return;
      }

      const { data, pagination } = res.data;
      setApplicants((prev) => (pg === 1 ? data : [...prev, ...data]));
      setHasMore(pg < pagination.totalPages);
      setPage(pg);
    } catch {
      toast.error("Failed to fetch applicants");
    } finally {
      setFetchingApplicants(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    if (applicants.length === 0) fetchApplicants(1);
  };

  // ✅ Accept / Reject Applicant
  const updateStatus = async (
    applicantId: string,
    status: "accepted" | "rejected"
  ) => {
      setIsUpdating(true);
      const res = await service.fetcher(
        `/job/update-job-application/${applicantId}/${status}`,
        "PATCH",
        { withCredentials: true }
      );
      if (res.code === 200) {
        toast.success(res.message || "Status updated");
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicantId ? { ...a, status } : a))
        );
        if (selected?._id === applicantId) {
          setSelected({ ...selected, status });
        }
        setIsUpdating(false);
        setSelected(null);
      } else {
        toast.error("Failed to update status");
        setIsUpdating(false);
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner isLoading />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Job not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-3">
      {/* ✅ Job Header */}
      <div className="bg-white shadow-md rounded-md p-4 flex flex-col md:flex-row gap-4">
        <img
          src={job.logo || "/default-logo.png"}
          alt={job.company_name}
          className="w-20 h-20 object-cover rounded-md border"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 text-sm">
              {job.company_name} • {job.company_location}
            </p>
            <span
              className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
                job.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {job.is_active ? "Active" : "Closed"}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <a
              href={job.company_website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded text-xs font-medium shadow hover:from-purple-700 hover:to-pink-700 transition"
            >
              Visit Website
            </a>
            <button
              onClick={openModal}
              className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-medium shadow hover:bg-gray-900 transition"
            >
              View Applicants
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Job Details */}
      <div className="bg-white shadow-sm rounded-md p-4 mt-4">
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          Job Description
        </h2>
        <p className="text-gray-700 text-sm">{job.description}</p>

        <h2 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Company Description
        </h2>
        <p className="text-gray-700 text-sm">{job.company_description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
          <div className="p-2 bg-gray-50 rounded">
            <h3 className="text-gray-500 text-xs">Salary Range</h3>
            <p className="text-gray-900 font-medium">
              ${job.salary_range.min.toLocaleString()} – $
              {job.salary_range.max.toLocaleString()} / {job.salary_type}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <h3 className="text-gray-500 text-xs">Employment Type</h3>
            <p className="text-gray-900 font-medium">{job.employment_type}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <h3 className="text-gray-500 text-xs">Work Arrangement</h3>
            <p className="text-gray-900 font-medium">{job.work_arrangement}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <h3 className="text-gray-500 text-xs">Posted On</h3>
            <p className="text-gray-900 font-medium">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Applicants Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-4 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Applicants ({applicants.length})
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {applicants.map((a) => (
                <div
                  key={a._id}
                  onClick={() => setSelected(a)}
                  className="flex items-center gap-3 border-b pb-3 last:border-none cursor-pointer hover:bg-gray-50 rounded-md p-2 transition"
                >
                  <img
                    src={a.applicantId.avatar || "/default-avatar.png"}
                    alt={a.applicantId.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {a.applicantId.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {a.applicantId.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Applied: {new Date(a.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      a.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : a.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => fetchApplicants(page + 1)}
                  disabled={fetchingApplicants}
                  className="w-full bg-gray-200 hover:bg-gray-300 py-1.5 rounded text-xs font-medium"
                >
                  {fetchingApplicants ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Applicant Details Drawer */}
      {selected && (
        <div className="fixed inset-0 flex justify-end bg-black/40 z-50">
          <div className="bg-white w-full sm:w-[400px] p-5 relative shadow-lg overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selected.applicantId.avatar || "/default-avatar.png"}
                alt={selected.applicantId.name}
                className="w-24 h-24 rounded-full border mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {selected.applicantId.name}
              </h3>
              <p className="text-sm text-gray-600">
                {selected.applicantId.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Applied: {new Date(selected.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-gray-500 text-sm">
              {selected.applicantId.about && (
                <p>
                  <strong>About:</strong> {selected.applicantId.about}
                </p>
              )}
              {Array.isArray(selected.applicantId.skill) && selected.applicantId.skill.length > 0 && (
                <p className="text-gray-500">
                  <strong>Skills:</strong>{" "}
                  {selected.applicantId.skill.join(", ")}
                </p>
              )}
              {selected.linkedInProfile && (
                <a
                  href={selected.linkedInProfile}
                  target="_blank"
                  className="block text-blue-600 underline"
                >
                  LinkedIn Profile
                </a>
              )}
              {selected.xProfile && (
                <a
                  href={selected.xProfile}
                  target="_blank"
                  className="block text-blue-500 underline"
                >
                  X/Twitter
                </a>
              )}
              {selected.resume && (
                <a
                  href={selected.resume}
                  target="_blank"
                  className="block text-green-600 underline"
                >
                  Download Resume
                </a>
              )}
            </div>

            {/* Accept / Reject Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => updateStatus(selected._id, "accepted")}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                {isUpdating ? "Updating..." : "Accept"}
              </button>
              <button
                onClick={() => updateStatus(selected._id, "rejected")}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                {isUpdating ? "Updating..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

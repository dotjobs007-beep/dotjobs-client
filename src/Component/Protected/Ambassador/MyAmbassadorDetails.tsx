"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authcontext";
import {
  IApiResponse,
  IAmbassador,
  IAmbassadorApplicant,
} from "@/interface/interface";
import Card from "@/Component/Card";
import { Users, Clock, Calendar, DollarSign, MapPin, ExternalLink, X, Check, XCircle, Eye, Linkedin, Github } from "lucide-react";

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface IApplicantListResponse {
  data: IAmbassadorApplicant[];
  pagination: {
    totalApplicants: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export default function MyAmbassadorDetails() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useAuth();

  const [loading, setLoading] = useState(false);
  const [ambassador, setAmbassador] = useState<IAmbassador | null>(null);

  // Applicants modal & drawer states
  const [showModal, setShowModal] = useState(false);
  const [applicants, setApplicants] = useState<IAmbassadorApplicant[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingApplicants, setFetchingApplicants] = useState(false);
  const [selected, setSelected] = useState<IAmbassadorApplicant | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  // Fetch Ambassador
  const fetchAmbassadorDetails = async () => {
    const id = params?.id as string;
    if (!id) return;
    setLoading(true);
    try {
      const res: IApiResponse<{ ambassador: IAmbassador }> = await service.fetcher(
        `/ambassador/fetch-ambassador/${id}`,
        "GET",
        { withCredentials: true }
      );
      if (res.code === 401) {
        toast.error("Please sign in to view your ambassador programs");
        router.replace("/auth/signin");
        return;
      }
      if (res.code === 404) {
        toast.error(res.message || "Ambassador program not found");
        router.replace("/jobs/my_ambassadors");
        return;
      }
      if (!res.data || res.status === "error") {
        toast.error(res.message || "Failed to load ambassador program");
        router.replace("/jobs/my_ambassadors");
        return;
      }
      setAmbassador(res.data.ambassador);
    } catch {
      toast.error("Failed to load ambassador program");
      router.replace("/jobs/my_ambassadors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  // Fetch Applicants with pagination
  const fetchApplicants = async (pg = 1, limit = 5) => {
    if (!ambassador || fetchingApplicants || (!hasMore && pg !== 1)) return;
    setFetchingApplicants(true);
    try {
      const res: IApiResponse<IApplicantListResponse> = await service.fetcher(
        `/ambassador/applications/${ambassador._id}?page=${pg}&limit=${limit}`,
        "GET",
        { withCredentials: true }
      );

      if (!res.data || !res.data.data) {
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

  // Accept / Reject / Review Applicant
  const updateStatus = async (
    applicantId: string,
    status: "accepted" | "rejected" | "reviewing"
  ) => {
    setIsUpdating(true);
    try {
      const res = await service.fetcher(
        `/ambassador/update-ambassador-application/${applicantId}/${status}`,
        "PATCH",
        { withCredentials: true }
      );
      console.log("Update status response:", res);
      if (res.status === "success" || res.code === 200) {
        toast.success(res.message || "Status updated");
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicantId ? { ...a, status } : a))
        );
        if (selected?._id === applicantId) {
          setSelected({ ...selected, status });
        }
        setSelected(null);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    } finally {
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

  if (!ambassador) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Ambassador program not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-3 lg:mt-[8rem]">
      {/* Ambassador Header */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {ambassador.logo ? (
            <img
              src={ambassador.logo}
              alt={ambassador.company_name}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-md flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
            >
              {ambassador.company_name?.charAt(0) || "A"}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 text-xs rounded-full font-medium"
                style={{ background: `${primaryColor}20`, color: primaryColor }}
              >
                Ambassador Program
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  ambassador.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {ambassador.is_active ? "Active" : "Closed"}
              </span>
            </div>
            <h1 className="text-xl font-semibold">{ambassador.title}</h1>
            <p className="text-gray-600 text-sm">
              {ambassador.company_name}
              {ambassador.company_location && ` • ${ambassador.company_location}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ambassador.company_website && (
                <a
                  href={ambassador.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition border"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <ExternalLink size={12} /> Visit Website
                </a>
              )}
              <button
                onClick={openModal}
                className="flex items-center gap-1 text-white px-3 py-1.5 rounded text-xs font-medium shadow transition"
                style={{ background: primaryColor }}
              >
                <Users size={12} /> View Applicants ({ambassador.applicantCount || 0})
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Program Details */}
      <Card className="p-4 mb-6">
        <h2 className="font-bold text-lg mb-4">Program Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Users className="w-5 h-5" style={{ color: primaryColor }} />
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-medium capitalize text-sm">{ambassador.program_type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Clock className="w-5 h-5" style={{ color: primaryColor }} />
            <div>
              <p className="text-xs text-gray-500">Commitment</p>
              <p className="font-medium capitalize text-sm">{ambassador.commitment_level}</p>
            </div>
          </div>
          {ambassador.duration && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium text-sm">{ambassador.duration}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
            <DollarSign className="w-5 h-5" style={{ color: primaryColor }} />
            <div>
              <p className="text-xs text-gray-500">Compensation</p>
              <p className="font-medium capitalize text-sm">{ambassador.compensation_type}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{ambassador.description}</p>
          </div>
          {ambassador.requirements && (
            <div>
              <h3 className="font-semibold mb-1">Requirements</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{ambassador.requirements}</p>
            </div>
          )}
          {ambassador.responsibilities && (
            <div>
              <h3 className="font-semibold mb-1">Responsibilities</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{ambassador.responsibilities}</p>
            </div>
          )}
          {ambassador.benefits && (
            <div>
              <h3 className="font-semibold mb-1">Benefits</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{ambassador.benefits}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Applicants Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border dark:border-gray-800">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Applicants</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {applicants.length === 0 && !fetchingApplicants && (
                <p className="text-center text-gray-500 dark:text-gray-400">No applicants yet.</p>
              )}

              <div className="space-y-3">
                {applicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: primaryColor }}
                      >
                        {applicant.applicantId?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{applicant.applicantId?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{applicant.applicantId?.email}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            applicant.status === "accepted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : applicant.status === "reviewing"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(applicant)}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(applicant._id, "accepted")}
                        disabled={isUpdating || applicant.status === "accepted"}
                        className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 disabled:opacity-50"
                        title="Accept"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(applicant._id, "rejected")}
                        disabled={isUpdating || applicant.status === "rejected"}
                        className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 disabled:opacity-50"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {fetchingApplicants && (
                <div className="flex justify-center py-4">
                  <Spinner isLoading />
                </div>
              )}

              {hasMore && !fetchingApplicants && applicants.length > 0 && (
                <button
                  onClick={() => fetchApplicants(page + 1)}
                  className="w-full mt-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicant Details Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-xl w-full max-w-md p-6 border dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Applicant Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center gap-3 pb-3 border-b dark:border-gray-700">
                {selected.applicantId?.avatar ? (
                  <img
                    src={selected.applicantId.avatar}
                    alt={selected.applicantId.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md bg-gray-100 dark:bg-gray-800"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: primaryColor }}
                  >
                    {selected.applicantId?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg">{selected.applicantId?.name || "Unknown"}</p>
                  {selected.applicantId?.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selected.applicantId.title}</p>
                  )}
                  {selected.applicantId?.verified_onchain && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      ✓ Verified On-chain
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium dark:text-white">{selected.applicantId?.email || "N/A"}</p>
              </div>

              {selected.applicantId?.address && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wallet Address</p>
                  <p className="font-medium text-sm break-all dark:text-white">{selected.applicantId.address}</p>
                </div>
              )}

              {/* About */}
              {selected.applicantId?.about && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">About</p>
                  <p className="text-sm dark:text-gray-300">{selected.applicantId.about}</p>
                </div>
              )}

              {/* Skills */}
              {selected.applicantId?.skill && selected.applicantId.skill.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.applicantId.skill.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media Handles */}
              {(selected.applicantId?.linkedInProfile || selected.applicantId?.xProfile || selected.applicantId?.githubProfile) && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Social Profiles</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.applicantId?.linkedInProfile && (
                      <a
                        href={selected.applicantId.linkedInProfile.startsWith("http") ? selected.applicantId.linkedInProfile : `https://linkedin.com/in/${selected.applicantId.linkedInProfile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                      >
                        <Linkedin size={14} />
                        LinkedIn
                      </a>
                    )}
                    {selected.applicantId?.xProfile && (
                      <a
                        href={selected.applicantId.xProfile.startsWith("http") ? selected.applicantId.xProfile : `https://x.com/${selected.applicantId.xProfile.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                        X / Twitter
                      </a>
                    )}
                    {selected.applicantId?.githubProfile && (
                      <a
                        href={selected.applicantId.githubProfile.startsWith("http") ? selected.applicantId.githubProfile : `https://github.com/${selected.applicantId.githubProfile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500 transition"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Application-specific fields */}
              {selected.motivation && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Motivation</p>
                  <p className="text-sm dark:text-gray-300">{selected.motivation}</p>
                </div>
              )}

              {selected.relevantExperience && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Relevant Experience</p>
                  <p className="text-sm dark:text-gray-300">{selected.relevantExperience}</p>
                </div>
              )}

              {selected.portfolioLink && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio</p>
                  <a
                    href={selected.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    {selected.portfolioLink}
                  </a>
                </div>
              )}

              {selected.resume && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resume</p>
                  <a
                    href={selected.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    View Resume
                  </a>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    selected.status === "accepted"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : selected.status === "rejected"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : selected.status === "reviewing"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Applied At</p>
                <p className="font-medium dark:text-white">{new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => updateStatus(selected._id, "accepted")}
                disabled={isUpdating || selected.status === "accepted"}
                className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(selected._id, "reviewing")}
                disabled={isUpdating || selected.status === "reviewing"}
                className="flex-1 py-2 rounded-lg bg-yellow-500 text-white font-medium disabled:opacity-50"
              >
                Review
              </button>
              <button
                onClick={() => updateStatus(selected._id, "rejected")}
                disabled={isUpdating || selected.status === "rejected"}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

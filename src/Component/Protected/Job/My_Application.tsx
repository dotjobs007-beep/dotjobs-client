"use client";
import { useJob } from "@/app/context/jobcontext";
import Card from "@/Component/Card";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import { IJobsAppliedResponse, IMyJobApplication } from "@/interface/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FileText, Send, Eye } from "lucide-react";
import { useAuth } from "@/app/context/authcontext";

export default function MyApplication() {
  const router = useRouter();
  const [applications, setApplications] = useState<IMyJobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<IMyJobApplication | null>(null);
  const { setJobDetails } = useJob();
  const { theme } = useAuth();
  
  const fetchMyApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await service.fetcher("/job/jobs-applied-by-user");
      const data = res as IJobsAppliedResponse;
      if (data.code === 401) return router.push("/login");
      if (data.code !== 200) return;
      setApplications(data.data.data || []);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

      const color = theme === "dark" ? "text-[#fff]" : "text-[#734A98]";


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Send className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className={`text-4xl lg:text-5xl font-bold ${color} `}>
                My Applications
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your job applications and their current status
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-2" />
              <span>{applications.length} applications submitted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Send className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven&apos;t applied to any jobs yet. Start exploring opportunities and submit your first application.
            </p>
            <button
              onClick={() => router.push("/jobs")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg border border-gray-200/50 p-5 transition-all duration-200 hover:scale-[1.01]"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === "accepted"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : app.status === "rejected"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                      : app.status === "reviewing"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              <div className="flex items-start space-x-4 mb-4">
                {/* Company Logo Placeholder */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                  {app.jobId?.logo ? (
                    <img
                      src={app.jobId.logo}
                      alt="Company logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FileText className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                
                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {app.jobId?.title || "Untitled Role"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">{app.jobId?.company_name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Send className="w-3 h-3 mr-1" />
                    <span>Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Polkadot Experience */}
              {app.polkadotExperience && (
                <div className="mb-4 p-2 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 font-medium">
                    ✨ Polkadot Experience: {app.polkadotDescription || "Yes"}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {app.resume && (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Resume
                    </a>
                  )}
                  
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedApplication(null)}
          ></div>

          <Card className="relative w-full max-w-md sm:max-w-lg md:max-w-4xl p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-auto max-h-[90vh]">
            {/* Header with close */}
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Application Details
              </h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Job Logo + Title */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              {selectedApplication.jobId?.logo ? (
                <img
                  src={selectedApplication.jobId.logo}
                  alt={`${
                    selectedApplication.jobId?.company_name || "company"
                  } logo`}
                  className="w-24 h-24 object-contain rounded-md bg-white dark:bg-gray-800 p-1"
                />
              ) : (
                <div className="w-24 h-24 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                  No logo
                </div>
              )}

              <div className="flex-1">
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedApplication.jobId?.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedApplication.jobId?.company_name}
                </p>
                {selectedApplication.jobId?.company_website && (
                  <p className="text-sm mt-1">
                    <a
                      className="text-blue-600 dark:text-blue-300 break-words"
                      href={selectedApplication.jobId.company_website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selectedApplication.jobId.company_website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Table of Application Details */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[400px]">
                <tbody>
                  <tr>
                    <td className="font-semibold text-gray-900 dark:text-white w-48">
                      Full name
                    </td>
                    <td className="text-gray-400">
                      {selectedApplication.fullName}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td className="text-gray-400">
                      {selectedApplication.contactMethod} —{" "}
                      {selectedApplication.contactHandle}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">LinkedIn</td>
                    <td className="text-gray-400">
                      {selectedApplication.linkedInProfile ? (
                        <a
                          className="text-blue-600 dark:text-blue-300 break-words"
                          href={selectedApplication.linkedInProfile}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Profile
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Portfolio</td>
                    <td className="text-gray-400">
                      {selectedApplication.portfolioLink ? (
                        <a
                          className="text-blue-600 dark:text-blue-300 break-words"
                          href={selectedApplication.portfolioLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">X Profile</td>
                    <td className="text-gray-400">
                      {selectedApplication.xProfile ? (
                        <a
                          className="text-blue-600 dark:text-blue-300 break-words"
                          href={selectedApplication.xProfile}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Polkadot experience</td>
                    <td className="text-gray-400">
                      {selectedApplication.polkadotExperience ? "Yes" : "No"}
                    </td>
                  </tr>
                  {selectedApplication.polkadotExperience && (
                    <tr>
                      <td className="font-semibold">Polkadot description</td>
                      <td className="text-gray-400">
                        {selectedApplication.polkadotDescription || "—"}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="font-semibold">Resume</td>
                    <td className="text-gray-400">
                      {selectedApplication.resume ? (
                        <a
                          className="text-blue-600 dark:text-blue-300 break-words"
                          href={selectedApplication.resume}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td className="text-gray-400">
                      {selectedApplication.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Applied at</td>
                    <td className="text-gray-400">
                      {new Date(
                        selectedApplication.appliedAt ||
                          selectedApplication.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr className="my-4" />

            {/* Job Details */}
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Job details
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[400px]">
                <tbody>
                  <tr>
                    <td className="font-semibold w-48">Title</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Company</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.company_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Location</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.company_location}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Employment type</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.employment_type}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Work arrangement</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.work_arrangement}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Salary type</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.salary_type}
                    </td>
                  </tr>
                  {selectedApplication.jobId?.salary_range && (
                    <tr>
                      <td className="font-semibold">Salary range</td>
                      <td className="text-gray-400">
                        {selectedApplication.jobId.salary_range.min ?? "—"} —{" "}
                        {selectedApplication.jobId.salary_range.max ?? "—"}{" "}
                        {selectedApplication.jobId?.salary_token.toLocaleUpperCase()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="font-semibold">Category</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.category}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Requirements</td>
                    <td className="text-gray-400 whitespace-pre-line">
                      {selectedApplication.jobId?.requirements}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Company description</td>
                    <td className="text-gray-400 whitespace-pre-line">
                      {selectedApplication.jobId?.company_description}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Created</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.createdAt
                        ? new Date(
                            selectedApplication.jobId.createdAt
                          ).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Updated</td>
                    <td className="text-gray-400">
                      {selectedApplication.jobId?.updatedAt
                        ? new Date(
                            selectedApplication.jobId.updatedAt
                          ).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}

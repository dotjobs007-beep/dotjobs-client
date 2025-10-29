"use client";
import { useJob } from "@/app/context/jobcontext";
import Card from "@/Component/Card";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import { IJobsAppliedResponse, IMyJobApplication } from "@/interface/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyApplication() {
  const router = useRouter();
  const [applications, setApplications] = useState<IMyJobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<IMyJobApplication | null>(null);
  const { setJobDetails } = useJob();

  const fetchMyApplications = async () => {
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
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div className="mx-auto p-6 lg:p-20">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-6">
        My Applications
      </h1>

      {loading ? (
        <Spinner isLoading={loading} />
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            You have not applied to any jobs yet.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="mt-4 px-4 py-2 rounded-md bg-button-bg text-button-text"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {applications.map((app:any) => (
            <Card
              key={app._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm"
            >
              <div className="flex-1">
                <h2 className="text-lg text-white font-semibold">
                  {app.jobId?.title || "Untitled Role"}
                </h2>
                <p className="text-sm text-white">{app.jobId?.company_name}</p>
                <p className="mt-2 text-sm text-white">
                  Applied on:{" "}
                  {new Date(
                    app.appliedAt || app.createdAt
                  ).toLocaleDateString()}
                </p>
                {app.polkadotExperience && (
                  <p className="mt-2 text-xs text-white">
                    Polkadot experience: {app.polkadotDescription || "Yes"}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {app.status}
                </span>

                <div className="flex gap-2">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-md text-sm bg-button-bg text-button-text"
                  >
                    View Resume
                  </a>

                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800"
                  >
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
  );
}

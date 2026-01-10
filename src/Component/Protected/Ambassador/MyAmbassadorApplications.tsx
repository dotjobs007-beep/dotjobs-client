"use client";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import { IAmbassadorsAppliedResponse, IMyAmbassadorApplication } from "@/interface/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyAmbassadorApplications() {
  const router = useRouter();
  const { theme } = useAuth();
  const [applications, setApplications] = useState<IMyAmbassadorApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<IMyAmbassadorApplication | null>(null);

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  const fetchMyAmbassadorApplications = async () => {
    try {
      setLoading(true);
      const res = await service.fetcher("/ambassador/ambassadors-applied-by-user", "GET", { withCredentials: true });
      const data = res as IAmbassadorsAppliedResponse;
      if (data.code === 401) return router.push("/auth/signin");
      if (data.code !== 200) return;
      setApplications(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAmbassadorApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <div className="mx-auto p-6 lg:p-20">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-6">
        My Ambassador Applications
      </h1>

      {loading ? (
        <Spinner isLoading={loading} />
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            You have not applied to any ambassador programs yet.
          </p>
          <button
            onClick={() => router.push("/ambassador")}
            className="mt-4 px-4 py-2 rounded-md text-white font-medium"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
          >
            Browse Ambassador Programs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm"
            >
              <div className="flex items-start gap-4 flex-1">
                {app.ambassadorId?.logo ? (
                  <img
                    src={app.ambassadorId.logo}
                    alt={app.ambassadorId?.company_name || "company"}
                    className="w-16 h-16 object-contain rounded-md bg-white dark:bg-gray-800 p-1"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-md flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
                  >
                    {app.ambassadorId?.company_name?.charAt(0) || "A"}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg text-white font-semibold">
                    {app.ambassadorId?.title || "Untitled Program"}
                  </h2>
                  <p className="text-sm text-gray-400">{app.ambassadorId?.company_name}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {app.ambassadorId?.program_type?.replace(/_/g, " ")}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Applied on:{" "}
                    {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(app.status)}`}
                >
                  {app.status}
                </span>

                <div className="flex gap-2">
                  {app.resume && (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-md text-sm bg-button-bg text-button-text"
                    >
                      View Resume
                    </a>
                  )}
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

            {/* Ambassador Logo + Title */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              {selectedApplication.ambassadorId?.logo ? (
                <img
                  src={selectedApplication.ambassadorId.logo}
                  alt={`${selectedApplication.ambassadorId?.company_name || "company"} logo`}
                  className="w-24 h-24 object-contain rounded-md bg-white dark:bg-gray-800 p-1"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-md flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
                >
                  {selectedApplication.ambassadorId?.company_name?.charAt(0) || "A"}
                </div>
              )}

              <div className="flex-1">
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedApplication.ambassadorId?.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedApplication.ambassadorId?.company_name}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {selectedApplication.ambassadorId?.program_type?.replace(/_/g, " ")}
                </p>
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
                      {selectedApplication.fullName || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td className="text-gray-400">
                      {selectedApplication.contactMethod
                        ? `${selectedApplication.contactMethod} — ${selectedApplication.contactHandle || "N/A"}`
                        : "—"}
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
                    <td className="font-semibold">Social Media Links</td>
                    <td className="text-gray-400">
                      {selectedApplication.socialMediaLinks || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Motivation</td>
                    <td className="text-gray-400 whitespace-pre-line">
                      {selectedApplication.motivation || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Relevant Experience</td>
                    <td className="text-gray-400 whitespace-pre-line">
                      {selectedApplication.relevantExperience || "—"}
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
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
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
          </Card>
        </div>
      )}
    </div>
  );
}

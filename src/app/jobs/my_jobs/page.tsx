"use client";

import { useState } from "react";
import MyJobs from "@/Component/Protected/Job/MyJobs";
import MyAmbassadors from "@/Component/Protected/Ambassador/MyAmbassadors";
import { useAuth } from "@/app/context/authcontext";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "ambassadors">("jobs");
  const { theme } = useAuth();

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  return (
    <div>
      {/* Toggle Tabs */}
      <div className="flex justify-center mt-24 px-4">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "jobs"
                ? "text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            style={activeTab === "jobs" ? { background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` } : {}}
          >
            My Jobs
          </button>
          <button
            onClick={() => setActiveTab("ambassadors")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "ambassadors"
                ? "text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            style={activeTab === "ambassadors" ? { background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` } : {}}
          >
            My Ambassadors
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-16">
        {activeTab === "jobs" ? <MyJobs /> : <MyAmbassadors />}
      </div>
    </div>
  );
}

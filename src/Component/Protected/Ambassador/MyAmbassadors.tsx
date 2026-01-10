"use client";

import { useEffect, useState } from "react";
import AmbassadorCard from "@/Component/AmbassadorCard";
import Spinner from "@/Component/Spinner";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import {
  IApiResponse,
  IAmbassador,
} from "@/interface/interface";

export default function MyAmbassadors() {
  const [ambassadors, setAmbassadors] = useState<IAmbassador[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { theme } = useAuth();

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  const fetchMyAmbassadors = async () => {
    if (loading) return;

    setLoading(true);
    const res: IApiResponse<IAmbassador[]> = await service.fetcher(
      `/ambassador/fetch-ambassador-by-user`,
      "GET",
      { withCredentials: true }
    );

    if (res.code === 401) {
      router.replace("/auth/signin");
      setLoading(false);
      return;
    }

    if (!res.data || res.status === "error") {
      setLoading(false);
      return;
    }

    setAmbassadors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyAmbassadors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-24 px-4 flex flex-col items-center lg:px-[10rem]">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent">
        My Ambassador Programs
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Manage your ambassador programs and view applicants.
      </p>

      {/* Ambassador List */}
      <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ambassadors.map((ambassador) => (
          <AmbassadorCard
            key={ambassador._id}
            logo={ambassador.logo || ""}
            companyName={ambassador.company_name}
            title={ambassador.title}
            description={ambassador.description}
            programType={ambassador.program_type}
            commitmentLevel={ambassador.commitment_level}
            duration={ambassador.duration}
            compensationType={ambassador.compensation_type}
            applicantCount={ambassador.applicantCount}
            buttonText="View Details"
            onClick={() => router.push(`/jobs/my_ambassadors/${ambassador._id}`)}
          />
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-6">
          <Spinner isLoading={true} />
        </div>
      )}

      {/* Empty State */}
      {!loading && ambassadors.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t created any ambassador programs yet.</p>
          <button
            onClick={() => router.push("/jobs/post_job")}
            className="px-6 py-3 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition-colors"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
          >
            Create Ambassador Program
          </button>
        </div>
      )}
    </div>
  );
}

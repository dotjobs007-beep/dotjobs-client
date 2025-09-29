"use client";
// import jobs from "@/mock/job.json";
import Card from "../../Card";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowRight, Bookmark } from "lucide-react"; // ✅ Add icons
import { useRouter } from "next/navigation";
import { useJob } from "@/app/context/jobcontext";
import Link from "next/link";
import { getRelativeTime } from "@/utils/relativeTime";

export default function ViewJobDetails() {
  const params = useParams(); // ✅ Get params on client
  // const job = jobs.find((j) => String(j.id) === params?.id);
  const router = useRouter();

  const { jobDetails } = useJob();

  const tags = [
    jobDetails?.employment_type,
    jobDetails?.salary_type,
    jobDetails?.work_arrangement,
    jobDetails?.salary_range
      ? `${jobDetails.salary_range.min} - ${jobDetails.salary_range.max} USD`
      : null,
  ].filter(Boolean);



  return (
    <main className="px-6 py-8 lg:px-[10rem]">
      <p className="mb-6 text-gray-500 text-sm">
        Jobs / {jobDetails?.category} / {jobDetails?.title}
      </p>

      {/* Title + Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-3xl font-bold mb-2">{jobDetails?.title}</h1>
          <p className="text-gray-600">Posted {getRelativeTime(jobDetails?.createdAt)} {jobDetails?.work_arrangement ? `• ${jobDetails.work_arrangement}` : ""}</p>
        </div>

        <div className="flex gap-3">
          {/* ✅ Apply Button with Icon */}
          <button
            onClick={() => router.push("/jobs/apply")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            Apply Now <ArrowRight size={18} />
          </button>

          {/* ✅ Save Button with Icon */}
          <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition flex items-center gap-2">
            <Bookmark size={18} /> Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
        {/* Left Content */}
        <div className="w-full md:w-[60%]">
          <h2 className="font-bold text-xl my-2">About the job</h2>
          <p className="mb-5 leading-relaxed">
            {jobDetails?.company_description}
          </p>

          <h2 className="font-bold text-xl my-4">Requirements</h2>
          <p className="leading-relaxed">{jobDetails?.requirements}</p>
        </div>

        {/* Right Card */}
        <div className="w-full md:w-[40%] mt-10 md:mt-0">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={jobDetails?.logo || ""}
                alt="company logo"
                width={80}
                height={80}
                className="rounded-md"
              />
              <h3 className="font-bold text-lg">{jobDetails?.company_name}</h3>
            </div>

            <p className="text-sm mb-3 leading-relaxed">
              {jobDetails?.company_description}
            </p>

            <h4 className="font-semibold mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) =>
                tag ? (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ) : null
              )}
            </div>
            {jobDetails?.company_website ? (
              <a
                href={jobDetails.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full"
              >
                <div className="w-full bg-purple-600 text-center text-white py-2 rounded-lg hover:bg-purple-700 transition">
                  <b> Visit Company Site</b>
                </div>
              </a>
            ) : (
              <button
                onClick={() => router.push('/jobs')}
                className="mt-6 w-full bg-gray-300 text-center text-gray-700 py-2 rounded-lg transition"
              >
                <b> Visit Company</b>
              </button>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

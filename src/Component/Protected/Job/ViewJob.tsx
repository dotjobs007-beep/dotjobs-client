"use client";
import jobs from "@/mock/job.json";
import Card from "../../Card";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowRight, Bookmark } from "lucide-react"; // ✅ Add icons
import { useRouter } from "next/navigation";

export default function ViewJobDetails() {
  const params = useParams(); // ✅ Get params on client
  const job = jobs.find((j) => String(j.id) === params?.id);
  const router = useRouter()

  return (
    <main className="px-6 py-8 lg:px-[10rem]">
      <p className="mb-6 text-gray-500 text-sm">
        Jobs / Web development / Senior Blockchain Engineer
      </p>

      {/* Title + Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job?.title}</h1>
          <p className="text-gray-600">Posted 5 days ago • Remote</p>
        </div>

        <div className="flex gap-3">
          {/* ✅ Apply Button with Icon */}
          <button onClick={() => router.push("/jobs/apply")} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
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
            We are seeking a highly skilled Senior Software Developer to join
            our team. In this role, you will lead the design, development, and
            maintenance of software applications, ensuring high performance,
            scalability, and reliability. You will mentor junior developers,
          </p>

          <h2 className="font-bold text-xl my-4">Requirements</h2>
          <p className="leading-relaxed">
            Bachelor’s degree in Computer Science, Engineering, or a related
            field (or equivalent practical experience). 5+ years of professional
            software development experience with proven expertise in [specific
            stack: e.g., JavaScript/Node.js, Python, Java, etc.]. Strong
            knowledge of software design patterns, algorithms, and data
            structures. Hands-on experience with modern frameworks, cloud
            services (AWS, Azure, GCP), and CI/CD pipelines. Solid understanding
            of database design (SQL and NoSQL). Strong problem-solving skills
            and attention to detail. Excellent communication, teamwork, and
            leadership skills.
          </p>
        </div>

        {/* Right Card */}
        <div className="w-full md:w-[40%] mt-10 md:mt-0">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="company logo"
                width={80}
                height={80}
                className="rounded-md"
              />
              <h3 className="font-bold text-lg">Blockchain Solutions Inc.</h3>
            </div>

            <p className="text-sm mb-3 leading-relaxed">
              About the company here. We are seeking a highly skilled Senior
              Software Developer to join our team. In this role, you will lead
              the design, development, and maintenance of software applications,
              ensuring high performance.
            </p>

            <h4 className="font-semibold mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {job?.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

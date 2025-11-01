"use client";
import Image from "next/image";
import { useEffect} from "react";
import { FaLinkedin, FaGithub} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDate } from "@/helper/date_formatter";
import { useAuth } from "@/app/context/authcontext";
import { Verified } from "lucide-react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useUser } from "@/app/context/usercontext";


export default function TalentDetails() {

  const {theme } = useAuth();
  const {userDetails} = useUser();


  useEffect(() => {
    if (!userDetails) {
    router.back();
    toast.error("User not found");
    return;
    }
  }, [userDetails]);

  const router = useRouter();

  return (
    <div className="mt-20">
      {userDetails && (
        <div className="px-6 lg:px-0 flex justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* 🟣 Card 1 – User Info */}
            <div className={`${theme === "dark" ? "bg-gradient-to-r from-[#261933] to-[#724B99]" : "bg-gradient-to-r from-[#DB2F7B] to-[#724B99]"} rounded-2xl p-6 shadow-xxl text-white `}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Profile</h3>
              </div>
              {/* Avatar + Edit */}
              <div className="flex flex-col items-center text-center mb-6">
                <div
                  className="cursor-pointer"
                >
                  <div className="relative w-22 h-22 rounded-full overflow-hidden border-4 border-white/30 mb-4 shadow-md">
                    <Image
                      src={userDetails.avatar}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 ring-2 ring-white/20 rounded-full pointer-events-none" />
                  </div>
                </div>

                <Image
                  src={
                    userDetails.verified_onchain
                      ? "https://res.cloudinary.com/dk06cndku/image/upload/v1758747697/verified_p2oyti.png"
                      : "https://res.cloudinary.com/dk06cndku/image/upload/v1758747695/not_verified_k1ybbw.png"
                  }
                  alt="Verification Status"
                  width={90}
                  height={90}
                  className="rounded-full -mt-4 border-4 border-white/30 bg-gray-500"
                />

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3 text-left mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Full name</span>
                    <span className="text-sm">{userDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gender</span>
                    <span className="text-sm">{userDetails.gender || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ethnicity</span>
                    <span className="text-sm">{userDetails.ethnicity || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Primary language</span>
                    <span className="text-sm">{userDetails.primaryLanguage || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location</span>
                    <span className="text-sm">{userDetails.location || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Job seeking</span>
                                     <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      userDetails.jobSeeker 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        userDetails.jobSeeker ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                      {userDetails.jobSeeker
                        ? "Available"
                        : "Not Available"}
                    </div>
                  </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Joined on: </span>
                    <span className="text-sm ml-2">{formatDate(userDetails.createdAt)}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right column stack */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-2 text-pink-600">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {userDetails.about || "No description provided."}
                </p>
              </div>

              <div className="rounded-2xl p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-3 text-pink-600">Skills</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {userDetails.skill.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-3 text-pink-600">Connect</h3>
                <div className="flex gap-3 mt-2 items-center">
                  <a
                    href={userDetails.xProfile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition text-pink-600"
                  >
                    <FaSquareXTwitter size={18} />
                  </a>
                  <a
                    href={userDetails.linkedInProfile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition text-pink-600"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={userDetails.githubProfile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition text-pink-600"
                  >
                    <FaGithub size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

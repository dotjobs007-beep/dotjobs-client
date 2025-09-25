"use client";
import service from "@/helper/service.helper";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { formatDate } from "@/helper/date_formatter";
import Card from "../Card";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<IUserDetails | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  const fetchUserData = async () => {
    setIsLoading(true);
    const registerUser: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/profile",
      "GET"
    );
    if (registerUser.code == 401) {
      setIsLoading(false);
      router.push("/auth/signin");
      return;
    }

    if (registerUser.status === "error") {
      toast.error(registerUser.message);
      setIsLoading(false);
      return;
    }

    setUserData(registerUser.data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditOpen = () => {
    if (!userData) return;
    setAbout(userData.about || "");
    setSkills(userData.skill.join(", "));
    setShowEdit(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const skillsArray = skills.split(",").map((skill) => skill.trim());
    console.log("Skills Array:", skillsArray);
    const response: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/update-profile",
      "PATCH",
      {
        data: {
          about,
          skills: skillsArray,
        },
        withCredentials: true,
      }
    );

    if (response.code === 401) {
      setIsLoading(false);
      router.push("/auth/signin");
      return;
    }

    if (response.status === "error") {
      toast.error(response.message);
      setIsLoading(false);

      return;
    } else {
      toast.success(response.message);
      await fetchUserData();
      setShowEdit(false);
      setIsLoading(false);
      return;
    }
  };

  //   const handleEditOpen = () => {
  //   if (!userData) return;
  //   // 🟢 Pre-fill with existing data
  //   setAbout(userData.about || "");
  //   setSkills(userData.skill?.join(", ") || ""); // <-- show previous skills
  //   setShowEdit(true);
  // };

  return (
    <div>
      {!isLoading && userData && (
        <div className="lg:h-[89vh] px-6 py-10 flex justify-center items-center">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🟣 Card 1 – User Info */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99] flex flex-col items-center text-center">
              <Image
                src={userData.avatar}
                alt="User Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-white/30 mb-4"
              />
              <Image
                src={
                  userData.verified_onchain
                    ? "https://res.cloudinary.com/dk06cndku/image/upload/v1758747697/verified_p2oyti.png"
                    : "https://res.cloudinary.com/dk06cndku/image/upload/v1758747695/not_verified_k1ybbw.png"
                }
                alt="Verification Status"
                width={100}
                height={100}
                className="rounded-full mt-[-30px] border-4 border-white/30 bg-gray-500"
              />
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-sm text-white/80 mt-1">{userData.role}</p>
              <p className="text-xs text-white/70 mt-3">
                Joined on:{" "}
                <span className="font-medium">
                  {formatDate(userData.createdAt)}
                </span>
              </p>

              {/* ✅ Edit Profile Button */}
              <button
                onClick={handleEditOpen}
                className="mt-4 px-4 py-2 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-50 transition"
              >
                Edit Profile
              </button>
            </div>

            {/* 🟣 Card 2 – About */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
              <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
                About
              </h3>
              <p className="leading-relaxed text-white/90">
                {userData.about || "No description provided."}
              </p>
            </div>

            {/* 🟣 Card 3 – Skills */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
              <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {userData.skill.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 font-medium transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 🟣 Card 4 – Social Media */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
              <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
                Connect
              </h3>
              <div className="flex gap-6 mt-2">
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 text-gray-800"
              rows={4}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 text-gray-800"
              placeholder="e.g. React, Node.js"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700"
              >
                Save
              </button>
            </div>
          </Card>
        </div>
      )}

      <Spinner isLoading={isLoading} />
    </div>
  );
}

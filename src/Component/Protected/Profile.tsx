"use client";
import service from "@/helper/service.helper";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { formatDate } from "@/helper/date_formatter";
import Card from "../Card";
import { updateProfile } from "firebase/auth";
import { auth } from "@/Firebase/firebase";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImageUrl, setUploadingImageUrl] = useState(false);
  const [userData, setUserData] = useState<IUserDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔧 State for Edit About/Skills
  const [showEdit, setShowEdit] = useState(false);
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  // 🔧 State for Avatar + Name update
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const router = useRouter();

  // 👉 Fetch user profile
  const fetchUserData = async () => {
    setIsLoading(true);
    const res: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/profile",
      "GET"
    );

    if (res.code === 401) {
      setIsLoading(false);
      router.push("/auth/signin");
      return;
    }

    if (res.status === "error") {
      toast.error(res.message);
      setIsLoading(false);
      return;
    }

    setUserData(res.data || null);
    setUploadedUrl(res.data?.avatar || "");
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  // 👉 Handle About/Skills Save
  const handleSave = async () => {
    setIsLoading(true);
    const skillsArray = skills.split(",").map((s) => s.trim());
    const response: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/update-profile",
      "PATCH",
      {
        data: { about, skills: skillsArray },
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
    } else {
      toast.success(response.message);
      await fetchUserData();
      setShowEdit(false);
      setIsLoading(false);
    }
  };

  const handleEditOpen = () => {
    if (!userData) return;
    setAbout(userData.about || "");
    setSkills(userData.skill.join(", "));
    setShowEdit(true);
  };

  // 👉 Handle image upload to your backend
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("dottoken");
    if (!token) return toast.error("User not authenticated");

    setUploadingImageUrl(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/job/upload-file`,
        {
          method: "POST",
          headers: {
            authorization: "Bearer " + token,
            secret: process.env.NEXT_PUBLIC_SECRET_KEY || "",
          },
          body: fd,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploadedUrl(data.data);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingImageUrl(false);
    }
  };

  // 👉 Update Firebase + backend with new avatar/name
  const handleAvatarUpdate = async () => {
    if (!auth.currentUser) return toast.error("No user signed in");
    if (!newName && !uploadedUrl) {
      toast.error("Please provide a name or upload an image");
      return;
    }

    try {
      setUploading(true);
      const photoURL = uploadedUrl || userData?.avatar || "";

      // ✅ Firebase Auth profile update
      await updateProfile(auth.currentUser, {
        displayName: newName || auth.currentUser.displayName || "",
        photoURL,
      });

      // ✅ Update backend DB to keep it in sync
      await service.fetcher("/user/update-profile", "PATCH", {
        data: {
          name: newName || userData?.name,
          avatar: photoURL,
        },
        withCredentials: true,
      });

      toast.success("Profile updated!");
      setShowAvatarModal(false);
      setUploadedUrl("");
      setNewName("");
      fetchUserData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!isLoading && userData && (
        <div className="lg:h-[89vh] px-6 py-10 flex justify-center items-center">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🟣 Card 1 – User Info */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99] flex flex-col items-center text-center">
              <div
                onClick={() => {
                  setNewName(userData.name);
                  setShowAvatarModal(true);
                }}
                className="cursor-pointer"
              >
                <Image
                  src={userData.avatar}
                  alt="User Avatar"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white/30 mb-4 cursor-pointer"
                />
              </div>
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
              <p className="text-sm text-white/80 mt-1">{userData.email}</p>
              <p className="text-xs text-white/70 mt-3">
                Joined on:{" "}
                <span className="font-medium">
                  {formatDate(userData.createdAt)}
                </span>
              </p>
              <button
                onClick={handleEditOpen}
                className="mt-4 px-4 py-2 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-50 transition"
              >
                Edit Profile
              </button>
            </div>

            {/* 🟣 About */}
            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-[#DB2F7B] to-[#724B99]">
              <h3 className="text-xl font-semibold mb-3 border-b border-white/30 pb-2">
                About
              </h3>
              <p className="leading-relaxed text-white/90">
                {userData.about || "No description provided."}
              </p>
            </div>

            {/* 🟣 Skills */}
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

            {/* 🟣 Social */}
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

      {/* ✅ Edit About/Skills Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              rows={4}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
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

      {/* ✅ Avatar + Name Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Update Name & Avatar</h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="Enter full name"
            />

            <div className="flex flex-col items-center mt-4">
              <p className="text-sm mb-2">Avatar</p>
              <div
                onClick={handleAvatarClick}
                className="relative w-28 h-28 rounded-full bg-white/20 border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
              >
                {uploadedUrl ? (
                  <img
                    src={uploadedUrl}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-center px-2">
                    {uploadingImageUrl ? "Uploading..." : "Click to upload"}
                  </span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
            {/* <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full mb-4"
            />

            {uploadedUrl && (
              <Image
                src={uploadedUrl}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4"
              />
            )} */}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarUpdate}
                disabled={uploading}
                className="px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60"
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </Card>
        </div>
      )}

      <Spinner isLoading={isLoading || uploadingImageUrl} />
    </div>
  );
}

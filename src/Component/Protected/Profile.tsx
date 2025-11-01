"use client";
import service from "@/helper/service.helper";
import {
  IApiResponse,
  IUpdateProfile,
  IUserDetails,
} from "@/interface/interface";
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
import { useAuth } from "@/app/context/authcontext";
import { Verified } from "lucide-react";
import { isTrustedUrl } from "@/helper/validate_link";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImageUrl, setUploadingImageUrl] = useState(false);
  const [userData, setUserData] = useState<IUserDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔧 State for Edit About/Skills
  const [showEdit, setShowEdit] = useState(false);
  // const [about, setAbout] = useState("");
  // const [skills, setSkills] = useState("");
  // const [lin]

  const [formData, setFormData] = useState<IUpdateProfile>({
    about: "",
    skills: "",
    location: "",
    linkedInProfile: "",
    xProfile: "",
    githubProfile: "",
    jobSeeker: false,
  });

  // 🔧 State for Avatar + Name update
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const { setUserDetails, theme } = useAuth();

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
    setUserDetails(res.data || null);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const validateProfileUrl = (): boolean => {
    if (formData.githubProfile != "") {
      const isValidUrl = isTrustedUrl(formData.githubProfile ?? "");
      if (!isValidUrl) {
        toast.error("Please enter a valid and trusted GitHub profile URL.");
        return false;
      }
    }

    if (formData.linkedInProfile != "") {
      const isValidUrl = isTrustedUrl(formData.linkedInProfile ?? "");
      if (!isValidUrl) {
        toast.error("Please enter a valid and trusted LinkedIn profile URL.");
        return false;
      }
    }
    if (formData.xProfile != "") {
      const isValidUrl = isTrustedUrl(formData.xProfile ?? "");
      if (!isValidUrl) {
        toast.error("Please enter a valid and trusted X profile URL.");
        return false;
      }
    }
    return true;
  };

  // 👉 Handle About/Skills Save
  const handleSave = async () => {
    setIsLoading(true);
    const skillsArray = formData.skills?.split(",").map((s) => s.trim());
    const isValid = validateProfileUrl();
    if (!isValid) {
      return;
    }
    const response: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/update-profile",
      "PATCH",
      {
        data: {
          about: formData.about,
          skills: skillsArray,
          location: formData.location,
          linkedInProfile: formData.linkedInProfile,
          xProfile: formData.xProfile,
          githubProfile: formData.githubProfile,
          gender: formData.gender,
          ethnicity: formData.ethnicity,
          primaryLanguage: formData.primaryLanguage,
          jobSeeker: formData.jobSeeker,
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
    } else {
      toast.success(response.message);
      await fetchUserData();
      setShowEdit(false);
      setIsLoading(false);
    }
  };

  const handleEditOpen = () => {
    if (!userData) return;
    const skillsString = (userData.skill || []).join(", ");
    setFormData((prev) => ({
      ...prev,
      jobSeeker: userData.jobSeeker || false,
      linkedInProfile: userData.linkedInProfile || "",
      xProfile: userData.xProfile || "",
      githubProfile: userData.githubProfile || "",
      about: userData.about || "",
      skills: skillsString || "",
      location: userData.location || "",
      gender: userData.gender || "",
      ethnicity: userData.ethnicity || "",
      primaryLanguage: userData.primaryLanguage || "",
    }));
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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="mt-20">
      {!isLoading && userData && (
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
                  onClick={() => {
                    setNewName(userData.name);
                    setShowAvatarModal(true);
                  }}
                  className="cursor-pointer"
                >
                  <div className="relative w-22 h-22 rounded-full overflow-hidden border-4 border-white/30 mb-4 shadow-md">
                    <Image
                      src={userData.avatar}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 ring-2 ring-white/20 rounded-full pointer-events-none" />
                  </div>
                </div>

                <Image
                  src={
                    userData.verified_onchain
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
                    <span className="text-sm">{userData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email</span>
                    <span className="text-sm flex items-center gap-2">
                      {userData.email}
                      {userData.email_verified && (
                        <Verified className="inline-block ml-1 text-green-400" />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gender</span>
                    <span className="text-sm">{userData.gender || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ethnicity</span>
                    <span className="text-sm">{userData.ethnicity || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Primary language</span>
                    <span className="text-sm">{userData.primaryLanguage || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location</span>
                    <span className="text-sm">{userData.location || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Job seeking</span>
                    <span className={`text-sm font-semibold ${userData.jobSeeker ? 'text-green-400' : 'text-red-400'}`}>
                      {userData.jobSeeker ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Joined on:</span>
                    <span className="text-sm ml-2">{formatDate(userData.createdAt)}</span>
                  </div>
                </div>

              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleEditOpen}
                  className="px-4 py-2 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-50 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Right column stack */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-2 text-pink-600">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {userData.about || "No description provided."}
                </p>
              </div>

              <div className="rounded-2xl p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-3 text-pink-600">Skills</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {userData.skill.map((skill, idx) => (
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
                    href={userData.xProfile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition text-pink-600"
                  >
                    <FaSquareXTwitter size={18} />
                  </a>
                  <a
                    href={userData.linkedInProfile || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition text-pink-600"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={userData.githubProfile || "#"}
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

      {/* ✅ Edit About/Skills Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-auto flex items-center justify-center z-50">
          <Card className="rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="block text-sm font-medium text-white mb-1">
              About
            </label>
            <textarea
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              rows={4}
            />

            <label className="block text-sm font-medium text-white mb-1">
              Skills (comma separated)
            </label>
            <input
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. React, Node.js"
            />

            <label className="block text-sm font-medium text-white mb-1">
              LinkedIn Profile
            </label>
            <input
              value={formData.linkedInProfile}
              onChange={handleFormChange}
              name="linkedInProfile"
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. https://www.linkedin.com/in/username"
            />

            <label className="block text-sm font-medium text-white mb-1">
              x Profile
            </label>
            <input
              value={formData.xProfile}
              onChange={handleFormChange}
              name="xProfile"
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. https://www.x.com/in/username"
            />

            <label className="block text-sm font-medium text-white mb-1">
              GitHub Profile
            </label>
            <input
              value={formData.githubProfile}
              onChange={handleFormChange}
              name="githubProfile"
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. https://www.github.com/in/username"
            />

            <label className="block text-sm font-medium text-white mb-1">
              Job Seeker
            </label>
            <input
              type="checkbox"
              checked={formData.jobSeeker}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  jobSeeker: e.target.checked,
                }))
              }
              name="jobSeeker"
              className="mr-2 leading-tight"
            />

            <label className="block text-sm font-medium text-white mb-1">
              Location
            </label>
            <input
              value={formData.location}
              onChange={handleFormChange}
              name="location"
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. San Francisco, CA"
            />

            {/* Gender */}
            <label className="block text-sm font-medium text-white mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>

            {/* Ethnicity / Race (optional) */}
            <label className="block text-sm font-medium text-white mb-1">
              Race / Ethnicity (optional)
            </label>
            <select
              name="ethnicity"
              value={formData.ethnicity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ethnicity: e.target.value }))
              }
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-1 text-gray-800"
            >
              <option value="">Select an option</option>
              <option value="black_african">Black / African</option>
              <option value="white_caucasian">White / Caucasian</option>
              <option value="asian">Asian</option>
              <option value="hispanic_latino">Hispanic / Latino</option>
              <option value="mideast_northafrican">
                Middle Eastern / North African
              </option>
              <option value="indigenous_native">Indigenous / Native</option>
              <option value="mixed_multiracial">Mixed / Multiracial</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
            <p className="text-xs text-gray-300 mb-4">
              Select the option that best describes you. This information is
              collected only for diversity and inclusion purposes and will not
              affect your application.
            </p>

            {/* Primary Language */}
            <label className="block text-sm font-medium text-white mb-1">
              Primary Language
            </label>
            <input
              value={formData.primaryLanguage}
              onChange={handleFormChange}
              name="primaryLanguage"
              className="w-full border-gray-300 p-3 rounded-lg border bg-[#FDD7FD] mb-4 text-gray-800"
              placeholder="e.g. English"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-auto flex items-center justify-center z-50">
          <Card className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
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

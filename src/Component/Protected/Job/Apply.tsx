"use client";

import { useState, useEffect } from "react";
import Modal from "../../Modal";
import { useRouter } from "next/navigation";
import { useJob } from "@/app/context/jobcontext";
import service from "@/helper/service.helper";
import Spinner from "@/Component/Spinner";
import { isTrustedUrl } from "@/helper/validate_link";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authcontext";

export default function ApplyPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { userDetails } = useAuth();
  // Applicant info state
  const [fullName, setFullName] = useState(userDetails?.name || "");
  const [contactMethod, setContactMethod] = useState<
    "email" | "x" | "linkedin" | "other"
  >("email");
  const [contactHandle, setContactHandle] = useState<string>(
    userDetails?.email || ""
  );

  // Prefill contactHandle when contactMethod or userDetails change
  useEffect(() => {
    if (contactMethod === "email") {
      setContactHandle(userDetails?.email || "");
    } else if (contactMethod === "x") {
      setContactHandle(userDetails?.xProfile || "");
    } else if (contactMethod === "linkedin") {
      setContactHandle(userDetails?.linkedInProfile || "");
    } else {
      // keep existing contactHandle for 'other' or allow user to type
      if (!contactHandle) setContactHandle("");
    }
  }, [contactMethod, userDetails]);
  const [coverLetter, setCoverLetter] = useState("");
  const [polkadotExperience, setPolkadotExperience] = useState<boolean | null>(
    null
  );
  const [polkadotDescription, setPolkadotDescription] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ success modal
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const { jobDetails } = useJob();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload");
    const token = localStorage.getItem("dottoken");
    if (!token) return toast.error("User not authenticated");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/job/upload-file`,
        {
          method: "POST",
          headers: {
            secret: process.env.NEXT_PUBLIC_SECRET_KEY || "",
            authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.status === "error") {
        toast.error(data.message || "Upload failed");
        return;
      }

      const fileUrl = data.data;
      // Build payload with applicant fields and uploaded file URL
      const payload = {
        jobId: jobDetails?._id,
        resume: fileUrl,
        fullName,
        contactMethod,
        contactHandle,
        coverLetter,
        polkadotExperience,
        polkadotDescription,
      } as any;
      await handleResumeSubmitWithPayload(payload);

      // Show success modal
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000); // hide after 3s

      // Optionally close upload modal automatically
      setShowUploadModal(false);
    } catch (error: any) {
      alert(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleApplySubmit = async () => {
    // Validate pre-application fields
    if (!fullName || fullName.trim().length < 2)
      return toast.error("Full name is required");
    if (!contactHandle || contactHandle.trim().length < 1)
      return toast.error("Please provide a preferred contact handle or link");
    if (!resumeURL) return toast.error("Please enter your resume URL");

    const payload = {
      jobId: jobDetails?._id,
      resume: resumeURL,
      fullName,
      contactMethod,
      contactHandle,
      coverLetter,
      polkadotExperience,
      polkadotDescription,
    } as any;

    await handleResumeSubmitWithPayload(payload);
  };

  const handleGoback = () => {
    setShowSuccessModal(false);
    router.push("/jobs");
  };

  const handleResumeSubmitWithPayload = async (body: any) => {
    const isTrusted = isTrustedUrl(body.resume);
    if (!isTrusted) {
      return toast.error("Please provide a valid and trusted URL");
    }

    setIsLoading(true);
    const res = await service.fetcher(`/job/job-application`, "POST", {
      data: body,
      withCredentials: true,
    });

    if (res.code === 401) {
      router.replace("/auth/signin");
      setIsLoading(false);
      return;
    }

    if (res.status === "error") {
      toast.error(res.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setShowSuccessModal(true);
  };

  return (
    <main className="px-6 py-12 flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-700">
          <span>Step 1</span>
          <span>Step 2</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-purple-600 rounded-full w-1/2" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
        >
          Apply with Resume
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
        >
          Upload Resume
        </button>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply with Resume Link"
      >
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block mb-2">Preferred Contact Method</label>
        <select
          value={contactMethod}
          onChange={(e) => setContactMethod(e.target.value as any)}
          className="border p-2 w-full rounded mb-3 text-gray-700"
        >
          <option value="email">Email</option>
          <option value="x">X</option>
          <option value="linkedin">LinkedIn</option>
          <option value="other">Other</option>
        </select>

        <label className="block mb-2">Contact Handle / Link</label>
        <input
          type="text"
          placeholder="e.g. @username or https://t.me/username"
          value={contactHandle}
          onChange={(e) => setContactHandle(e.target.value)}
          readOnly={contactMethod !== "other"}
          aria-readonly={contactMethod !== "other"}
          className={`border p-2 w-full rounded mb-3 ${
            contactMethod !== "other"
              ? "bg-gray-100 cursor-not-allowed text-gray-600"
              : ""
          }`}
        />

        <label className="block mb-2">Cover Letter (max 500 chars)</label>
        <textarea
          maxLength={500}
          rows={4}
          placeholder="Why are you interested in this role?"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block mb-2">
          Have you worked on any Polkadot or Kusama project before?
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="polk"
              checked={polkadotExperience === true}
              onChange={() => setPolkadotExperience(true)}
            />{" "}
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="polk"
              checked={polkadotExperience === false}
              onChange={() => setPolkadotExperience(false)}
            />{" "}
            No
          </label>
        </div>
        {polkadotExperience && (
          <>
            <label className="block mb-2">
              If yes, briefly describe your role
            </label>
            <input
              type="text"
              placeholder="Brief description"
              value={polkadotDescription}
              onChange={(e) => setPolkadotDescription(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
          </>
        )}

        <label className="block mb-2">Resume URL</label>
        <input
          type="text"
          placeholder="Enter your resume url"
          value={resumeURL || ""}
          onChange={(e) => setResumeURL(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <div className="text-sm text-gray-600 mb-4">
          <b>Note:</b>
          <p>
            Please ensure your resume is in PDF format and does not exceed 5MB
            in size.
          </p>
          <p>
            We recommend using trusted platforms like Google Drive, Dropbox,
            Cloudinary or OneDrive to host your resume. Make sure the link is
            publicly accessible.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleApplySubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setShowApplyModal(false);
              setShowUploadModal(true);
            }}
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
          >
            Upload Resume Instead
          </button>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Your Resume"
      >
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block mb-2">Preferred Contact Method</label>
        <select
          value={contactMethod}
          onChange={(e) => setContactMethod(e.target.value as any)}
          className="border p-2 w-full rounded mb-3 text-gray-700"
        >
          <option value="email">Email</option>
          <option value="x">X</option>
          <option value="linkedin">LinkedIn</option>
          <option value="other">Other</option>
        </select>

        <label className="block mb-2">Contact Handle / Link</label>
        <input
          type="text"
          placeholder="e.g. @username or https://t.me/username"
          value={contactHandle}
          onChange={(e) => setContactHandle(e.target.value)}
          readOnly={contactMethod !== "other"}
          aria-readonly={contactMethod !== "other"}
          className={`border p-2 w-full rounded mb-3 ${
            contactMethod !== "other"
              ? "bg-gray-100 cursor-not-allowed text-gray-600"
              : ""
          }`}
        />

        <label className="block mb-2">Cover Letter (max 500 chars)</label>
        <textarea
          maxLength={500}
          rows={4}
          placeholder="Why are you interested in this role?"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <label className="block mb-2">
          Have you worked on any Polkadot or Kusama project before?
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="polk"
              checked={polkadotExperience === true}
              onChange={() => setPolkadotExperience(true)}
            />{" "}
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="polk"
              checked={polkadotExperience === false}
              onChange={() => setPolkadotExperience(false)}
            />{" "}
            No
          </label>
        </div>
        {polkadotExperience && (
          <>
            <label className="block mb-2">
              If yes, briefly describe your role
            </label>
            <input
              type="text"
              placeholder="Brief description"
              value={polkadotDescription}
              onChange={(e) => setPolkadotDescription(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
          </>
        )}

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
        {resumeURL && (
          <p className="mt-3 text-sm text-green-600">
            File saved:{" "}
            <a href={resumeURL} target="_blank" rel="noreferrer">
              View File
            </a>
          </p>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => router.push(`/jobs/${jobDetails?._id}`)}
        title="Success"
      >
        <h1 className="text-[#FF2670] font-bold text-[20px] mb-5">
          Application Submitted!
        </h1>
        <p className="text-green-600 text-center font-medium mb-5">
          Your application for <b>Senior Blockchain Developer at Chainlink</b>{" "}
          has been successfully submitted. You will receive an email
          notification once the hiring team reviews your application.
        </p>

        <button
          onClick={() => handleGoback()}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Back to Jobs
        </button>
      </Modal>

      <Spinner isLoading={isLoading} />
    </main>
  );
}

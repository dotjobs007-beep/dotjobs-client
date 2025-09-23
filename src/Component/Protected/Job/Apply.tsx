"use client";

import { useState } from "react";
import Modal from "../../Modal";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ success modal
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${process.env.NEXT_BASE_URL}/job/upload-resume`, {
        method: "POST",
        headers: {
          secret: process.env.NEXT_PUBLIC_SECRET_KEY || "",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setDownloadURL(data.url || null);

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

  const handleApplySubmit = () => {
    if (!name) return alert("Please enter your name");
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
    setShowApplyModal(false);
  };

  const handleGoback = () => {
    setShowSuccessModal(false);
    router.push("/jobs");
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
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />
        <button
          onClick={handleApplySubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Submit
        </button>
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Your Resume"
      >
        <input
          type="file"
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
        {downloadURL && (
          <p className="mt-3 text-sm text-green-600">
            File saved:{" "}
            <a href={downloadURL} target="_blank" rel="noreferrer">
              View File
            </a>
          </p>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
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
    </main>
  );
}

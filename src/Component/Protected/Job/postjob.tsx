"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { IApiResponse, IJob } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import ConnectWalletModal from "../ConnectWalletModal";
import WalletModal from "@/Component/WalletModal";
import MobileWalletModal from "../MobileWalletModal";

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    employmentType: "",
    workArrangement: "",
    salaryType: "",
    salaryRange: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companyDescription: "",
    companyLogo: "",
  });
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const { userDetails } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [showWalletModal, setShowWalletModal] = useState(true);
  const {
    isWalletConnected,
  } = useAuth();
  const router = useRouter();
  const [showConnectModal , setShowConnectModal] = useState(true);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salaryRange" ? value.replace(/[^0-9-]/g, "") : value,
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const token = localStorage.getItem("dottoken");
    if (!token) return toast.error("User not authenticated");
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

      setFormData((prev) => ({ ...prev, companyLogo: data.data }));
      toast.success("Logo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    const body: IJob = {
      title: formData.jobTitle,
      description: formData.jobDescription,
      employment_type: formData.employmentType as IJob["employment_type"],
      work_arrangement: formData.workArrangement as IJob["work_arrangement"],
      salary_type: formData.salaryType as IJob["salary_type"],
      salary_range: {
        min: parseInt(formData.salaryRange.split("-")[0], 10),
        max: parseInt(formData.salaryRange.split("-")[1], 10),
      },
      company_name: formData.companyName,
      company_website: formData.companyWebsite,
      company_description: formData.companyDescription,
      company_location: formData.companyLocation,
      logo: formData.companyLogo || userDetails?.avatar,
    };

    setLoading(true);

    const res: IApiResponse<any> = await service.fetcher(
      "/job/post-job",
      "POST",
      {
        data: body,
        withCredentials: true,
      }
    );

    if (res.code === 401) {
      router.replace("/auth/signin");
      setLoading(false);
      return;
    }

    if (res.status === "error") {
      toast.error(res.message);
      setLoading(false);
      return;
    }
    toast.success(res.message);
    setLoading(false);
    router.replace("/jobs/my_jobs");
    // TODO: Redirect to job listings or dashboard
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Animation Variants
  const variants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const validateForm = () => {
    if (formData.jobTitle.trim() === "") {
      toast.error("Job Title is required");
      return false;
    }
    if (formData.jobDescription.trim() === "") {
      toast.error("Job Description is required");
      return false;
    }
    if (formData.employmentType === "") {
      toast.error("Employment Type is required");
      return false;
    }
    if (formData.workArrangement === "") {
      toast.error("Work Arrangement is required");
      return false;
    }
    if (formData.salaryType === "") {
      toast.error("Salary Type is required");
      return false;
    }
    if (!/^[0-9]+-[0-9]+$/.test(formData.salaryRange)) {
      toast.error("Salary Range must be in format min-max");
      return false;
    }
    if (formData.companyName.trim() === "") {
      toast.error("Company Name is required");
      return false;
    }
    if (formData.companyLocation.trim() === "") {
      toast.error("Company Location is required");
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-12">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-2">
        Post a New Job
      </h1>
      <p className="text-center text-gray-600 mb-8">Step {step} of 3</p>

      {isWalletConnected && (
        <form
          onSubmit={handleSubmit}
          className="relative bg-gradient-to-b from-[#A64FA0] to-[#7A2E7A] rounded-3xl p-8 shadow-2xl overflow-hidden text-sm text-white"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-6">Job Details</h2>

                <label className="block mb-2">Job Title</label>
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <label className="block mb-2">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Responsibilities, requirements, benefits..."
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Employment Type</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                    >
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Work Arrangement</label>
                    <select
                      name="workArrangement"
                      value={formData.workArrangement}
                      onChange={handleChange}
                      className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                    >
                      <option value="">Select arrangement</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block mb-2">Salary Type</label>
                    <select
                      name="salaryType"
                      value={formData.salaryType}
                      onChange={handleChange}
                      className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                    >
                      <option value="">Choose salary type</option>
                      <option value="hourly">Hourly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="commission">Commission</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Salary Range</label>
                    <input
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleChange}
                      placeholder="e.g. 800-2000"
                      pattern="^[0-9]+-[0-9]+$"
                      required
                      className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-6">Company Details</h2>

                <label className="block mb-2">Company Name</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <label className="block mb-2">Company Website (optional)</label>
                <input
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="e.g. www.acme.com"
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <label className="block mb-2">Company Location</label>
                <input
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <label className="block mb-2">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Briefly describe your company"
                  className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                />

                <div className="flex flex-col items-center mt-4">
                  <p className="text-sm mb-2">Company Logo</p>
                  <div
                    onClick={handleAvatarClick}
                    className="relative w-28 h-28 rounded-full bg-white/20 border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
                  >
                    {formData.companyLogo ? (
                      <img
                        src={formData.companyLogo}
                        alt="Company Logo"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-center px-2">
                        {uploading ? "Uploading..." : "Click to upload"}
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
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-4">Verification</h2>
                <p className="text-xs mb-6">
                  To maintain quality, we require identity verification through
                  Polka Identity or Polkassembly.
                </p>
                {!userDetails?.verified_onchain ? (
                  <Link
                    href="/jobs/verify_identity"
                    className="block w-full text-center bg-white text-[#7A2E7A] font-semibold rounded-lg py-2 hover:bg-gray-100 transition"
                  >
                    Verify Identity
                  </Link>
                ) : (
                  <div className="block w-full text-center bg-white/10 text-green-600 font-semibold rounded-lg py-2">
                    You are verified onchain ✅
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== Navigation Buttons ===== */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  prevStep();
                }}
                className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-white/90 to-white/70 text-[#7A2E7A] shadow hover:scale-105 hover:shadow-lg transition"
              >
                ← Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-8 py-2 rounded-full font-semibold bg-gradient-to-r from-[#FF2670] to-[#FF4B92] shadow hover:scale-105 hover:shadow-lg transition"
              >
                Next →
              </button>
            )}
            {step == 3 && (
              <button
                type="submit"
                disabled={uploading}
                className="ml-auto px-8 py-2 rounded-full font-semibold bg-gradient-to-r from-[#FF2670] to-[#FF4B92] shadow hover:scale-105 hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Post Job"}
              </button>
            )}
          </div>
        </form>
      )}

      {!isWalletConnected && showConnectModal && (
        <>
          <ConnectWalletModal closeModal={() => setShowConnectModal(false)} />
        </>
      )}
    </div>
  );
}

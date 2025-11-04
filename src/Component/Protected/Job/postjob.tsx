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
import Card from "@/Component/Card";
import { CategoryOptions } from "@/constants/categories";

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobRequirement: "",
    employmentType: "",
    workArrangement: "",
    salaryType: "",
    salaryRange: "",
    category: "",
    salaryToken: "dot",
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
  const { isWalletConnected } = useAuth();
  const router = useRouter();
  const [showConnectModal, setShowConnectModal] = useState(true);

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

    if (
      formData.companyWebsite &&
      !/^https?:\/\//i.test(formData.companyWebsite)
    ) {
      toast.error("Company Website must be a valid URL");
      return;
    }

    // Parse salary range safely
    const salaryParts = formData.salaryRange.split("-");
    if (salaryParts.length !== 2) {
      toast.error("Invalid salary range format. Use format: min-max (e.g., 800-2000)");
      return;
    }

    const minSalary = parseInt(salaryParts[0].trim(), 10);
    const maxSalary = parseInt(salaryParts[1].trim(), 10);

    if (isNaN(minSalary) || isNaN(maxSalary)) {
      toast.error("Salary range must contain valid numbers");
      return;
    }

    if (minSalary >= maxSalary) {
      toast.error("Maximum salary must be greater than minimum salary");
      return;
    }

    const body: IJob = {
      title: formData.jobTitle.trim(),
      description: formData.jobDescription.trim(),
      requirements: formData.jobRequirement.trim(),
      employment_type: formData.employmentType as IJob["employment_type"],
      work_arrangement: formData.workArrangement as IJob["work_arrangement"],
      salary_type: formData.salaryType as IJob["salary_type"],
      salary_range: {
        min: minSalary,
        max: maxSalary,
      },
      // additional metadata
      category: formData.category,
      salary_token: formData.salaryToken,
      company_name: formData.companyName.trim(),
      company_website: formData.companyWebsite.trim() || undefined,
      company_description: formData.companyDescription.trim() || undefined,
      company_location: formData.companyLocation.trim(),
      logo: formData.companyLogo ? formData.companyLogo : userDetails?.avatar,
    };

    // Final validation to ensure no required fields are empty
    const requiredFields = [
      { field: body.title, name: "Job Title" },
      { field: body.description, name: "Job Description" },
      { field: body.requirements, name: "Job Requirements" },
      { field: body.employment_type, name: "Employment Type" },
      { field: body.work_arrangement, name: "Work Arrangement" },
      { field: body.salary_type, name: "Salary Type" },
      { field: body.category, name: "Job Category" },
      { field: body.company_name, name: "Company Name" },
      { field: body.company_location, name: "Company Location" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field || (typeof field === 'string' && field.trim() === '')) {
        toast.error(`${name} is required and cannot be empty`);
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      // Debug environment variables
      const res: IApiResponse<any> = await service.fetcher(
        "/job/post-job",
        "POST",
        {
          data: body,
          withCredentials: true,
        }
      );

      if (res.code === 401) {
        toast.error("Authentication required. Please sign in again.");
        router.replace("/auth/signin");
        setLoading(false);
        return;
      }

      if (res.status === "error") {
        toast.error(res.message || "Failed to post job. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.status || res.status === "success") {
        toast.success(res.message || "Job posted successfully!");
        setLoading(false);
        router.replace("/jobs/my_jobs");
      } else {
        toast.error("Unexpected response from server. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Job submission error:", error);
      toast.error("Failed to post job. Please check your connection and try again.");
      setLoading(false);
    }
    // TODO: Redirect to job listings or dashboard
  };

  // Step-by-step validation functions
  const validateStep1 = () => {
    const errors = [];
    if (formData.jobTitle.trim() === "") errors.push("Job Title is required");
    if (formData.jobDescription.trim() === "") errors.push("Job Description is required");
    if (formData.jobRequirement.trim().length < 10) errors.push("Job Requirement must be at least 10 characters");
    if (formData.employmentType === "") errors.push("Employment Type is required");
    if (formData.workArrangement === "") errors.push("Work Arrangement is required");
    if (!formData.category || formData.category === "") errors.push("Job Category is required");
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errors = [];
    if (formData.salaryType === "") errors.push("Salary Type is required");
    
    // Validate salary range format
    if (!formData.salaryRange.trim()) {
      errors.push("Salary Range is required");
    } else {
      const salaryParts = formData.salaryRange.split("-");
      if (salaryParts.length !== 2) {
        errors.push("Salary Range must be in format min-max (e.g., 800-2000)");
      } else {
        const minSalary = parseInt(salaryParts[0].trim(), 10);
        const maxSalary = parseInt(salaryParts[1].trim(), 10);
        
        if (isNaN(minSalary) || isNaN(maxSalary)) {
          errors.push("Salary range must contain valid numbers");
        } else if (minSalary >= maxSalary) {
          errors.push("Maximum salary must be greater than minimum salary");
        }
      }
    }
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errors = [];
    if (formData.companyName.trim() === "") errors.push("Company Name is required");
    if (formData.companyLocation.trim() === "") errors.push("Company Location is required");
    if (formData.companyWebsite && !/^https?:\/\//i.test(formData.companyWebsite)) {
      errors.push("Company Website must be a valid URL (starting with http:// or https://)");
    }
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    setStep((s) => Math.min(s + 1, 5));
  };
  
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
    if (formData.jobRequirement.trim().length < 10) {
      toast.error("Job Requirement must be at least 10 characters");
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
    if (!formData.category || formData.category === "") {
      toast.error("Job Category is required");
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-12">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-2">
        Post a New Job
      </h1>
      <p className="text-center text-gray-600 mb-2">Step {step} of 5</p>
      <p className="text-center text-sm text-gray-500 mb-8">
        <span className="text-red-500">*</span> indicates required fields
      </p>

      {isWalletConnected && (
        <form onSubmit={handleSubmit}>
          <Card>
            {/* <Card className="p-6"> */}
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

                  <label className="block mb-2">Job Title <span className="text-red-500">*</span></label>
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Job Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Responsibilities, benefits..."
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Job Requirement <span className="text-red-500">*</span></label>
                  <textarea
                    name="jobRequirement"
                    value={formData.jobRequirement}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Requirement, Qualifications..."
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2">Employment Type <span className="text-red-500">*</span></label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        required
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
                      <label className="block mb-2">Work Arrangement <span className="text-red-500">*</span></label>
                      <select
                        name="workArrangement"
                        value={formData.workArrangement}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select arrangement</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  {/* Category (left in step 1) */}
                  <div className="grid md:grid-cols-1 gap-6 mt-6">
                    <div>
                      <label className="block mb-2">Job Category <span className="text-red-500">*</span></label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <CategoryOptions />
                      </select>
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
                  <h2 className="text-xl font-semibold mb-6">Salary</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2">Salary Type <span className="text-red-500">*</span></label>
                      <select
                        name="salaryType"
                        value={formData.salaryType}
                        onChange={handleChange}
                        required
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
                      <label className="block mb-2">Salary Range <span className="text-red-500">*</span></label>
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

                  <div className="mt-6">
                    <label className="block mb-2">Salary Token</label>
                    <select
                      name="salaryToken"
                      value={formData.salaryToken}
                      onChange={handleChange}
                      className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                    >
                      <option value="dot">DOT</option>
                      <option value="usdc">USDC</option>
                      <option value="usdt">USDT</option>
                      <option value="ksm">KSM</option>
                      <option value="other native token">Other native token</option>
                    </select>
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
                  <h2 className="text-xl font-semibold mb-6">
                    Company Details
                  </h2>

                  <label className="block mb-2">Company Name <span className="text-red-500">*</span></label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">
                    Company Website (optional)
                  </label>
                  <input
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="e.g. https://www.acme.com"
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Company Location <span className="text-red-500">*</span></label>
                  <input
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    required
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

              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Verification</h2>
                  <p className="text-xs mb-6">
                    To maintain quality, we require identity verification
                    through Polka Identity or Polkassembly.
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
                      You are verified onchain
                    </div>
                  )}
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Please review all the information before submitting your job posting.
                  </p>

                  <div className="space-y-6">
                    {/* Job Details Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">Job Details</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Title:</span>
                          <p className="text-gray-800">{formData.jobTitle}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Category:</span>
                          <p className="text-gray-800 capitalize">{formData.category}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Employment Type:</span>
                          <p className="text-gray-800 capitalize">{formData.employmentType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Work Arrangement:</span>
                          <p className="text-gray-800 capitalize">{formData.workArrangement}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-medium text-gray-600">Description:</span>
                        <p className="text-gray-800 mt-1">{formData.jobDescription}</p>
                      </div>
                      <div className="mt-4">
                        <span className="font-medium text-gray-600">Requirements:</span>
                        <p className="text-gray-800 mt-1">{formData.jobRequirement}</p>
                      </div>
                    </div>

                    {/* Salary Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">Compensation</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Salary Type:</span>
                          <p className="text-gray-800 capitalize">{formData.salaryType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Range:</span>
                          <p className="text-gray-800">{formData.salaryRange}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Token:</span>
                          <p className="text-gray-800 uppercase">{formData.salaryToken}</p>
                        </div>
                      </div>
                    </div>

                    {/* Company Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">Company Information</h3>
                      <div className="flex items-start gap-4">
                        {(formData.companyLogo || userDetails?.avatar) && (
                          <img
                            src={formData.companyLogo || userDetails?.avatar}
                            alt="Company Logo"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1 grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Company Name:</span>
                            <p className="text-gray-800">{formData.companyName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Location:</span>
                            <p className="text-gray-800">{formData.companyLocation}</p>
                          </div>
                          {formData.companyWebsite && (
                            <div>
                              <span className="font-medium text-gray-600">Website:</span>
                              <p className="text-gray-800">{formData.companyWebsite}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.companyDescription && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-600">Description:</span>
                          <p className="text-gray-800 mt-1">{formData.companyDescription}</p>
                        </div>
                      )}
                    </div>

                    {/* Verification Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">Verification Status</h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        userDetails?.verified_onchain 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {userDetails?.verified_onchain ? "Verified On-chain" : "Not Verified"}
                      </div>
                    </div>
                  </div>
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

              {step < 5 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-8 py-2 rounded-full font-semibold bg-gradient-to-r from-[#FF2670] to-[#FF4B92] shadow hover:scale-105 hover:shadow-lg transition"
                >
                  {step === 4 ? "Review →" : "Next →"}
                </button>
              )}
              {step === 5 && (
                <button
                  type="submit"
                  disabled={uploading || loading}
                  className="ml-auto px-8 py-2 rounded-full font-semibold bg-gradient-to-r from-[#FF2670] to-[#FF4B92] shadow hover:scale-105 hover:shadow-lg transition disabled:opacity-60"
                >
                  {loading ? "Posting Job..." : "Post Job"}
                </button>
              )}
            </div>
            {/* <Card />   */}
          </Card>
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

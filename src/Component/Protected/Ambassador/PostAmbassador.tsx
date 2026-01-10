"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { IAmbassador, IApiResponse } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import ConnectWalletModal from "../ConnectWalletModal";
import Card from "@/Component/Card";

export default function PostAmbassador() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    programType: "",
    commitmentLevel: "",
    duration: "",
    compensationType: "",
    compensationDetails: "",
    category: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companyDescription: "",
    companyLogo: "",
    // Social handles
    twitterHandle: "",
    telegramHandle: "",
    discordHandle: "",
    facebookHandle: "",
    applicationDeadline: "",
    maxAmbassadors: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { userDetails, isWalletConnected } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showConnectModal, setShowConnectModal] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/ambassador/upload-file`,
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

    if (formData.companyWebsite && !/^https?:\/\//i.test(formData.companyWebsite)) {
      toast.error("Company Website must be a valid URL");
      return;
    }

    const body: IAmbassador = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      responsibilities: formData.responsibilities.trim(),
      benefits: formData.benefits.trim(),
      program_type: formData.programType as IAmbassador["program_type"],
      commitment_level: formData.commitmentLevel as IAmbassador["commitment_level"],
      duration: formData.duration as IAmbassador["duration"],
      compensation_type: formData.compensationType as IAmbassador["compensation_type"],
      compensation_details: formData.compensationDetails.trim(),
      category: formData.category,
      company_name: formData.companyName.trim(),
      company_website: formData.companyWebsite.trim() || undefined,
      company_description: formData.companyDescription.trim() || undefined,
      company_location: formData.companyLocation.trim(),
      logo: formData.companyLogo ? formData.companyLogo : userDetails?.avatar,
      // Social handles
      twitter_handle: formData.twitterHandle.trim() || undefined,
      telegram_handle: formData.telegramHandle.trim() || undefined,
      discord_handle: formData.discordHandle.trim() || undefined,
      facebook_handle: formData.facebookHandle.trim() || undefined,
      application_deadline: formData.applicationDeadline || undefined,
      max_ambassadors: formData.maxAmbassadors ? parseInt(formData.maxAmbassadors) : undefined,
    };

    setLoading(true);

    try {
      const res: IApiResponse<any> = await service.fetcher(
        "/ambassador/post-ambassador",
        "POST",
        { data: body, withCredentials: true }
      );

      if (res.code === 401) {
        toast.error("Authentication required. Please sign in again.");
        router.replace("/auth/signin");
        setLoading(false);
        return;
      }

      if (res.status === "error") {
        toast.error(res.message || "Failed to post ambassador program. Please try again.");
        setLoading(false);
        return;
      }

      toast.success(res.message || "Ambassador program posted successfully!");
      setLoading(false);
      router.replace("/jobs/my_ambassadors");
    } catch (error) {
      console.error("Ambassador submission error:", error);
      toast.error("Failed to post ambassador program. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("Program Title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.programType) errors.push("Program Type is required");
    if (!formData.commitmentLevel) errors.push("Commitment Level is required");
    if (!formData.duration) errors.push("Duration is required");
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errors = [];
    if (!formData.requirements.trim() || formData.requirements.length < 10) 
      errors.push("Requirements must be at least 10 characters");
    if (!formData.responsibilities.trim() || formData.responsibilities.length < 10) 
      errors.push("Responsibilities must be at least 10 characters");
    if (!formData.compensationType) errors.push("Compensation Type is required");
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errors = [];
    if (!formData.companyName.trim()) errors.push("Company/Project Name is required");
    if (!formData.companyLocation.trim()) errors.push("Location is required");
    if (formData.companyWebsite && !/^https?:\/\//i.test(formData.companyWebsite)) {
      errors.push("Website must be a valid URL");
    }
    
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const variants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const validateForm = () => {
    if (!formData.title.trim()) { toast.error("Program Title is required"); return false; }
    if (!formData.description.trim()) { toast.error("Description is required"); return false; }
    if (!formData.programType) { toast.error("Program Type is required"); return false; }
    if (!formData.commitmentLevel) { toast.error("Commitment Level is required"); return false; }
    if (!formData.duration) { toast.error("Duration is required"); return false; }
    if (!formData.requirements.trim()) { toast.error("Requirements are required"); return false; }
    if (!formData.responsibilities.trim()) { toast.error("Responsibilities are required"); return false; }
    if (!formData.compensationType) { toast.error("Compensation Type is required"); return false; }
    if (!formData.companyName.trim()) { toast.error("Company Name is required"); return false; }
    if (!formData.companyLocation.trim()) { toast.error("Location is required"); return false; }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-12">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-2">
        Post Ambassador Program
      </h1>
      <p className="text-center text-gray-600 mb-2">Step {step} of 5</p>
      <p className="text-center text-sm text-gray-500 mb-8">
        <span className="text-red-500">*</span> indicates required fields
      </p>

      {isWalletConnected && (
        <form onSubmit={handleSubmit}>
          <Card>
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
                  <h2 className="text-xl font-semibold mb-6">Program Details</h2>

                  <label className="block mb-2">Program Title <span className="text-red-500">*</span></label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Community Ambassador Program"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Program Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your ambassador program..."
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2">Program Type <span className="text-red-500">*</span></label>
                      <select
                        name="programType"
                        value={formData.programType}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select type</option>
                        <option value="community">Community</option>
                        <option value="marketing">Marketing</option>
                        <option value="technical">Technical</option>
                        <option value="regional">Regional</option>
                        <option value="content">Content</option>
                        <option value="developer-relations">Developer Relations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2">Commitment Level <span className="text-red-500">*</span></label>
                      <select
                        name="commitmentLevel"
                        value={formData.commitmentLevel}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select level</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block mb-2">Duration <span className="text-red-500">*</span></label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select duration</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="project-based">Project Based</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select category</option>
                        <option value="defi">DeFi</option>
                        <option value="nft">NFT</option>
                        <option value="gaming">Gaming</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="dao">DAO</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
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
                  <h2 className="text-xl font-semibold mb-6">Requirements & Compensation</h2>

                  <label className="block mb-2">Requirements <span className="text-red-500">*</span></label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What qualifications or skills are required?"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Responsibilities <span className="text-red-500">*</span></label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What will ambassadors be expected to do?"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2">Compensation Type <span className="text-red-500">*</span></label>
                      <select
                        name="compensationType"
                        value={formData.compensationType}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      >
                        <option value="">Select type</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid (Volunteer)</option>
                        <option value="token-based">Token Based</option>
                        <option value="perks-only">Perks Only</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2">Compensation Details</label>
                      <input
                        name="compensationDetails"
                        value={formData.compensationDetails}
                        onChange={handleChange}
                        placeholder="e.g. $500/month + tokens"
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="block mb-2 mt-6">Benefits</label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What perks and benefits do ambassadors receive?"
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />
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
                  <h2 className="text-xl font-semibold mb-6">Company/Project Information</h2>

                  <label className="block mb-2">Company/Project Name <span className="text-red-500">*</span></label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Polkadot"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Website</label>
                  <input
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://yourproject.com"
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Location <span className="text-red-500">*</span></label>
                  <input
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="e.g. Global, Remote, USA"
                    required
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Company/Project Description</label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of your company or project..."
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />
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
                  <h2 className="text-xl font-semibold mb-6">Additional Details</h2>

                  <label className="block mb-2">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Max Number of Ambassadors</label>
                  <input
                    type="number"
                    name="maxAmbassadors"
                    value={formData.maxAmbassadors}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 mb-6 focus:outline-none"
                  />

                  <label className="block mb-2">Company/Project Logo</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <div
                    onClick={handleAvatarClick}
                    className="w-full h-32 bg-[#FCE9FC] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#f5d5f5] transition mb-6"
                  >
                    {formData.companyLogo ? (
                      <img
                        src={formData.companyLogo}
                        alt="Logo"
                        className="h-24 w-24 object-contain rounded"
                      />
                    ) : uploading ? (
                      <span className="text-gray-500">Uploading...</span>
                    ) : (
                      <span className="text-gray-500">Click to upload logo</span>
                    )}
                  </div>

                  {/* Social Handles */}
                  <h3 className="text-lg font-semibold mb-4 mt-6">Social Handles (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Twitter / X Handle</label>
                      <input
                        name="twitterHandle"
                        value={formData.twitterHandle}
                        onChange={handleChange}
                        placeholder="@yourproject"
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Telegram</label>
                      <input
                        name="telegramHandle"
                        value={formData.telegramHandle}
                        onChange={handleChange}
                        placeholder="@yourproject or t.me/yourproject"
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Discord</label>
                      <input
                        name="discordHandle"
                        value={formData.discordHandle}
                        onChange={handleChange}
                        placeholder="discord.gg/yourserver"
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Facebook</label>
                      <input
                        name="facebookHandle"
                        value={formData.facebookHandle}
                        onChange={handleChange}
                        placeholder="facebook.com/yourpage"
                        className="w-full bg-[#FCE9FC] text-gray-800 rounded-lg p-3 focus:outline-none"
                      />
                    </div>
                  </div>
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

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Program Title</p>
                        <p className="text-gray-600">{formData.title}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Program Type</p>
                        <p className="text-gray-600 capitalize">{formData.programType?.replace("-", " ")}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Commitment Level</p>
                        <p className="text-gray-600 capitalize">{formData.commitmentLevel?.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p className="text-gray-600 capitalize">{formData.duration?.replace("-", " ")}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Compensation</p>
                        <p className="text-gray-600 capitalize">{formData.compensationType?.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Company</p>
                        <p className="text-gray-600">{formData.companyName}</p>
                      </div>
                    </div>

                    {(formData.twitterHandle || formData.telegramHandle || formData.discordHandle || formData.facebookHandle) && (
                      <div>
                        <p className="font-semibold mb-2">Social Handles</p>
                        <div className="flex flex-wrap gap-3">
                          {formData.twitterHandle && (
                            <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">🐦 {formData.twitterHandle}</span>
                          )}
                          {formData.telegramHandle && (
                            <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">📱 {formData.telegramHandle}</span>
                          )}
                          {formData.discordHandle && (
                            <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">💬 {formData.discordHandle}</span>
                          )}
                          {formData.facebookHandle && (
                            <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">📘 {formData.facebookHandle}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">Description</p>
                      <p className="text-gray-600 line-clamp-3">{formData.description}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF2670] to-[#A64FA0] text-white rounded-lg hover:opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF2670] to-[#A64FA0] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post Ambassador Program"}
                </button>
              )}
            </div>
          </Card>
        </form>
      )}

      {!isWalletConnected && showConnectModal && (
        <ConnectWalletModal closeModal={() => setShowConnectModal(false)} />
      )}
    </div>
  );
}

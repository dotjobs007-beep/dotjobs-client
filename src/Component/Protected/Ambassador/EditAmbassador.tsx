"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { IAmbassador, IApiResponse } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import Spinner from "@/Component/Spinner";

export default function EditAmbassador() {
  const params = useParams();
  const router = useRouter();
  const { userDetails, theme } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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
    twitterHandle: "",
    telegramHandle: "",
    discordHandle: "",
    facebookHandle: "",
    applicationDeadline: "",
    maxAmbassadors: "",
    is_active: true,
  });

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  // Fetch existing ambassador data
  useEffect(() => {
    const fetchAmbassador = async () => {
      const id = params?.id as string;
      if (!id) return;
      
      try {
        const res: IApiResponse<{ ambassador: IAmbassador }> = await service.fetcher(
          `/ambassador/fetch-ambassador/${id}`,
          "GET",
          { withCredentials: true }
        );

        if (res.code === 401) {
          router.replace("/auth/signin");
          return;
        }

        if (!res.data || res.status === "error") {
          toast.error("Ambassador program not found");
          router.replace("/jobs/my_ambassadors");
          return;
        }

        const amb = res.data.ambassador;
        setFormData({
          title: amb.title || "",
          description: amb.description || "",
          requirements: amb.requirements || "",
          responsibilities: amb.responsibilities || "",
          benefits: amb.benefits || "",
          programType: amb.program_type || "",
          commitmentLevel: amb.commitment_level || "",
          duration: amb.duration || "",
          compensationType: amb.compensation_type || "",
          compensationDetails: amb.compensation_details || "",
          category: amb.category || "",
          companyName: amb.company_name || "",
          companyWebsite: amb.company_website || "",
          companyLocation: amb.company_location || "",
          companyDescription: amb.company_description || "",
          companyLogo: amb.logo || "",
          twitterHandle: amb.twitter_handle || "",
          telegramHandle: amb.telegram_handle || "",
          discordHandle: amb.discord_handle || "",
          facebookHandle: amb.facebook_handle || "",
          applicationDeadline: amb.application_deadline ? new Date(amb.application_deadline).toISOString().split('T')[0] : "",
          maxAmbassadors: amb.max_ambassadors?.toString() || "",
          is_active: amb.is_active !== undefined ? amb.is_active : true,
        });
      } catch (error) {
        toast.error("Failed to load ambassador program");
        router.replace("/jobs/my_ambassadors");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbassador();
  }, [params?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Program Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.programType) {
      toast.error("Program Type is required");
      return;
    }
    if (!formData.commitmentLevel) {
      toast.error("Commitment Level is required");
      return;
    }

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
      logo: formData.companyLogo || userDetails?.avatar,
      twitter_handle: formData.twitterHandle.trim() || undefined,
      telegram_handle: formData.telegramHandle.trim() || undefined,
      discord_handle: formData.discordHandle.trim() || undefined,
      facebook_handle: formData.facebookHandle.trim() || undefined,
      application_deadline: formData.applicationDeadline || undefined,
      max_ambassadors: formData.maxAmbassadors ? parseInt(formData.maxAmbassadors) : undefined,
      is_active: formData.is_active,
    };

    setSubmitting(true);

    try {
      const res: IApiResponse<any> = await service.fetcher(
        `/ambassador/update-ambassador/${params?.id}`,
        "PATCH",
        { data: body, withCredentials: true }
      );

      if (res.code === 401) {
        toast.error("Authentication required. Please sign in again.");
        router.replace("/auth/signin");
        return;
      }

      if (res.status === "error") {
        toast.error(res.message || "Failed to update ambassador program");
        return;
      }

      toast.success("Ambassador program updated successfully!");
      router.replace(`/jobs/my_ambassadors/${params?.id}`);
    } catch (error) {
      toast.error("Failed to update ambassador program");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner isLoading />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-12 mt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent">
          Edit Ambassador Program
        </h1>
        <p className="text-gray-600 mb-8">Update your ambassador program details</p>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Program Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g., Community Ambassador"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Describe the ambassador program..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Program Type *</label>
                  <select
                    name="programType"
                    value={formData.programType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="community">Community</option>
                    <option value="marketing">Marketing</option>
                    <option value="technical">Technical</option>
                    <option value="regional">Regional</option>
                    <option value="content">Content</option>
                    <option value="developer-relations">Developer Relations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Commitment Level *</label>
                  <select
                    name="commitmentLevel"
                    value={formData.commitmentLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="project-based">Project Based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Compensation Type *</label>
                  <select
                    name="compensationType"
                    value={formData.compensationType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="token-based">Token Based</option>
                    <option value="perks-only">Perks Only</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Compensation Details</label>
                  <input
                    type="text"
                    name="compensationDetails"
                    value={formData.compensationDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., $500/month + tokens"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="List the requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="List the responsibilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="List the benefits..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Program is active and accepting applications
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Company Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-purple-500 transition overflow-hidden"
                >
                  {formData.companyLogo ? (
                    <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">Upload Logo</span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company/Project Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Social Handles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Twitter/X Handle</label>
                <input
                  type="text"
                  name="twitterHandle"
                  value={formData.twitterHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telegram Handle</label>
                <input
                  type="text"
                  name="telegramHandle"
                  value={formData.telegramHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discord Handle</label>
                <input
                  type="text"
                  name="discordHandle"
                  value={formData.discordHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="username#0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Facebook Handle</label>
                <input
                  type="text"
                  name="facebookHandle"
                  value={formData.facebookHandle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="username"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
            >
              {submitting ? "Updating..." : "Update Program"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

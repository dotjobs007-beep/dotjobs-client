"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { IApiResponse, IJob } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import { CategoryOptions } from "@/constants/categories";
import Spinner from "@/Component/Spinner";

interface IJobEditData {
  _id: string;
  title: string;
  description: string;
  requirements?: string;
  company_name: string;
  company_location: string;
  company_description?: string;
  company_website?: string;
  logo?: string;
  salary_range: { min: number; max: number };
  salary_type: string;
  salary_token?: string;
  employment_type: string;
  work_arrangement: string;
  category?: string;
  is_active: boolean;
}

export default function EditJob() {
  const params = useParams();
  const router = useRouter();
  const { userDetails, theme } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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
    is_active: true,
  });

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      const id = params?.id as string;
      if (!id) return;
      
      try {
        const res: IApiResponse<IJobEditData> = await service.fetcher(
          `/job/fetch-job/${id}`,
          "GET",
          { withCredentials: true }
        );

        if (res.code === 401) {
          router.replace("/auth/signin");
          return;
        }

        if (!res.data || res.status === "error") {
          toast.error("Job not found");
          router.replace("/jobs/my_jobs");
          return;
        }

        const job = res.data;
        setFormData({
          jobTitle: job.title || "",
          jobDescription: job.description || "",
          jobRequirement: job.requirements || "",
          employmentType: job.employment_type || "",
          workArrangement: job.work_arrangement || "",
          salaryType: job.salary_type || "",
          salaryRange: job.salary_range ? `${job.salary_range.min}-${job.salary_range.max}` : "",
          category: job.category || "",
          salaryToken: job.salary_token || "dot",
          companyName: job.company_name || "",
          companyWebsite: job.company_website || "",
          companyLocation: job.company_location || "",
          companyDescription: job.company_description || "",
          companyLogo: job.logo || "",
          is_active: job.is_active !== undefined ? job.is_active : true,
        });
      } catch (error) {
        toast.error("Failed to load job");
        router.replace("/jobs/my_jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "salaryRange" ? value.replace(/[^0-9-]/g, "") : value,
      }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle.trim()) {
      toast.error("Job Title is required");
      return;
    }
    if (!formData.jobDescription.trim()) {
      toast.error("Job Description is required");
      return;
    }

    if (formData.companyWebsite && !/^https?:\/\//i.test(formData.companyWebsite)) {
      toast.error("Company Website must be a valid URL");
      return;
    }

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
      salary_range: { min: minSalary, max: maxSalary },
      category: formData.category,
      salary_token: formData.salaryToken,
      company_name: formData.companyName.trim(),
      company_website: formData.companyWebsite.trim() || undefined,
      company_description: formData.companyDescription.trim() || undefined,
      company_location: formData.companyLocation.trim(),
      logo: formData.companyLogo || userDetails?.avatar,
      is_active: formData.is_active,
    };

    setSubmitting(true);

    try {
      const res: IApiResponse<any> = await service.fetcher(
        `/job/update-job/${params?.id}`,
        "PATCH",
        { data: body, withCredentials: true }
      );

      if (res.code === 401) {
        toast.error("Authentication required. Please sign in again.");
        router.replace("/auth/signin");
        return;
      }

      if (res.status === "error") {
        toast.error(res.message || "Failed to update job");
        return;
      }

      toast.success("Job updated successfully!");
      router.replace(`/jobs/my_jobs/${params?.id}`);
    } catch (error) {
      toast.error("Failed to update job");
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
          Edit Job
        </h1>
        <p className="text-gray-600 mb-8">Update your job listing details</p>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g., Senior Blockchain Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Job Description *</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Describe the role and responsibilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Requirements</label>
                <textarea
                  name="jobRequirement"
                  value={formData.jobRequirement}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="List the requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Type *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Work Arrangement *</label>
                  <select
                    name="workArrangement"
                    value={formData.workArrangement}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Salary Type *</label>
                  <select
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="commission">Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Salary Range *</label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., 800-2000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Token</label>
                  <select
                    name="salaryToken"
                    value={formData.salaryToken}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="dot">DOT</option>
                    <option value="usdt">USDT</option>
                    <option value="usdc">USDC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <CategoryOptions />
                </select>
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
                  Job is active and accepting applications
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
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Website</label>
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
              {submitting ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

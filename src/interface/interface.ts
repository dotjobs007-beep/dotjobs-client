export interface IApiResponse<T> {
  data?: T;
  message: string;
  status: string;
  code: number;
}

export interface IUserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  verified_onchain: boolean;
  about: string;
  avatar: string;
  email_verified: boolean;
  phoneNumber: string;
  skill: string[];
  address: string;
  onchain_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IJob {
  _id?: string;
  title: string;
  description: string;
  is_active?: boolean;

  employment_type:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "temporary"
    | "freelance";

  work_arrangement: "remote" | "hybrid" | "on-site";

  salary_type: "hourly" | "monthly" | "yearly" | "commission";

  salary_range: {
    min?: number; // non-negative
    max?: number; // non-negative
  };

  company_name: string;
  company_website?: string;
  company_description?: string;
  company_location: string;
  logo?: string;
}

export interface JobApplication {
  jobId: string;
  resume: string;
  linkedInProfile?: string;
  xProfile?: string;
  coverLetter?: string;
  status?: "pending" | "reviewed" | "accepted" | "rejected";
}


// Salary range structure
export interface ISalaryRange {
  min: number;
  max: number;
}


// Pagination info
export interface IPagination {
  currentPage: number;
  pageSize: number;
  totalJobs: number;
  totalPages: number;
}

// API response wrapper
export interface IJobResponse {
  data: IJob[];
  pagination: IPagination;
}

export interface ISalaryRange {
  min: number;
  max: number;
}

export interface IJobDetails {
  _id: string;
  title: string;
  description: string;
  company_name: string;
  company_location: string;
  company_description: string;
  company_website: string;
  logo?: string;
  salary_range: ISalaryRange;
  salary_type: string;
  employment_type: string;
  work_arrangement: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}




// types/applicants.ts

// -----------------------------
// ✅ Applicant User Details
// -----------------------------
export interface IApplicantUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  about?: string;
  address?: string;
  skill?: string[];
  verified_onchain: boolean;
}

// -----------------------------
// ✅ Job Applicant Record
// -----------------------------
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface IJobApplicant {
  _id: string;
  jobId: string;
  applicantId: IApplicantUser;
  status: ApplicationStatus;
  linkedInProfile?: string;
  xProfile?: string;
  resume?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------
// ✅ Pagination Info
// -----------------------------
export interface IPagination {
  totalApplications: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// -----------------------------
// ✅ API Response Wrapper
// -----------------------------
export interface IApplicantListResponse {
  data: IJobApplicant[];
  pagination: IPagination;
}

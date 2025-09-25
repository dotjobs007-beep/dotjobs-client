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

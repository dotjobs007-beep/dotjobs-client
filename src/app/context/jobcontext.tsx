"use client";
import { CategoryCardProps } from "@/Component/Landing/Category";
import { IJob } from "@/interface/interface";
import { createContext, useContext, useState } from "react";

interface JobContextType {
  jobDetails: IJob | null;
  setJobDetails: (value: IJob | null) => void;
  companyName: string | null;
  setCompanyName: (value: string) => void;
  category: CategoryCardProps | null;
  setCategory: (value: CategoryCardProps) => void;
  jobQuery: string;
  setJobQuery: (value: string) => void;
}


const JobContext = createContext<JobContextType | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobDetails, setJobDetails] = useState<IJob | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryCardProps | null>(null);
  const [jobQuery, setJobQuery] = useState<string>("");

  return (
    <JobContext.Provider value={{ jobDetails, setJobDetails, companyName, setCompanyName, category, setCategory, jobQuery, setJobQuery }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJob must be used within a JobProvider");
  }
  return context;
}
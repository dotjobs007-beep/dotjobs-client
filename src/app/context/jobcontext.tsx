"use client";
import { IJob } from "@/interface/interface";
import { createContext, useContext, useState } from "react";

interface JobContextType {
  jobDetails: IJob | null;
  setJobDetails: (value: IJob | null) => void;
}


const JobContext = createContext<JobContextType | null>(null);

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobDetails, setJobDetails] = useState<IJob | null>(null);

  return (
    <JobContext.Provider value={{ jobDetails, setJobDetails }}>
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
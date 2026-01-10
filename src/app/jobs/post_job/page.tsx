"use client";

import { useState } from "react";
import PostJob from "@/Component/Protected/Job/postjob";
import PostAmbassador from "@/Component/Protected/Ambassador/PostAmbassador";
import { useAuth } from "@/app/context/authcontext";
import { Briefcase, Users } from "lucide-react";

export default function PostPage() {
  const [postType, setPostType] = useState<"job" | "ambassador" | null>(null);
  const { theme } = useAuth();

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  if (postType === null) {
    return (
      <div className="max-w-3xl mx-auto p-6 lg:p-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-center bg-gradient-to-r from-[#FF2670] to-[#A64FA0] bg-clip-text text-transparent mb-4">
          What would you like to post?
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select the type of opportunity you want to create
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Card */}
          <button
            onClick={() => setPostType("job")}
            className="group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl text-left"
            style={{
              borderColor: theme === "dark" ? "#7F13EC40" : "#AE1E6740",
              background: theme === "dark" ? "#1A0330" : "#fff",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}40)`,
              }}
            >
              <Briefcase className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-bold mb-2">Post a Job</h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Create a job listing to find talented developers, designers, marketers, and more for your project.
            </p>
            <div
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: primaryColor }}
            >
              <span className="text-white text-lg">→</span>
            </div>
          </button>

          {/* Ambassador Card */}
          <button
            onClick={() => setPostType("ambassador")}
            className="group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl text-left"
            style={{
              borderColor: theme === "dark" ? "#7F13EC40" : "#AE1E6740",
              background: theme === "dark" ? "#1A0330" : "#fff",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}40)`,
              }}
            >
              <Users className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-bold mb-2">Post Ambassador Program</h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Create an ambassador program to build a community of advocates for your project.
            </p>
            <div
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: primaryColor }}
            >
              <span className="text-white text-lg">→</span>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          You can switch between posting types at any time
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Back button to switch type */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <button
          onClick={() => setPostType(null)}
          className="text-sm flex items-center gap-2 hover:underline"
          style={{ color: primaryColor }}
        >
          ← Change post type
        </button>
      </div>
      
      {postType === "job" ? <PostJob /> : <PostAmbassador />}
    </div>
  );
}
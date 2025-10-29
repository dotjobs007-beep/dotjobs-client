"use client";
import Image from "next/image";
import Card from "./Card";
import { useAuth } from "@/app/context/authcontext";
import { Building2, DollarSign, Users, MapPin, Clock, Eye, Star, TrendingUp } from "lucide-react";

interface JobCardProps {
  logo: string;
  companyName?: string;
  title: string;
  description: string;
  tags: string[];
  salaryRange?: { min?: number; max?: number };
  salaryType?: string;
  applicantCount?: number;
  onClick?: () => void;
  buttonText?: string;
}

export default function JobCard({
  logo,
  companyName,
  title,
  description,
  tags,
  salaryRange,
  salaryType,
  applicantCount,
  onClick = () => {},
  buttonText = "Apply Now",
}: JobCardProps) {

  const {theme} = useAuth();
  
  return (
    <Card className="group text-white relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg border border-gray-200/50 p-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer">
      {/* Hot Job Badge */}
      {applicantCount && applicantCount < 5 && (
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
            <Star className="w-2.5 h-2.5 mr-1" />
            Hot
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        {/* Company Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={logo || "https://res.cloudinary.com/dk06cndku/image/upload/v1761770552/49816613_gxgudm.jpg"}
              alt={`${companyName} logo`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Job Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Company */}
          <div className="mb-2">
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-white text-xs">
              <Building2 className="w-3 h-3 mr-1" />
              <span>{companyName || "Company"}</span>
            </div>
          </div>
          
          {/* Description - Single Line */}
          <p className="text-white text-xs mb-3 line-clamp-1">
            {description}
          </p>
          
          {/* Tags & Info Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap gap-1">
              {tags.filter(tag => tag).slice(0, 2).map((tag, index) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                    index === 0 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
            
            {/* Salary */}
            <div className="flex items-center text-xs text-gray-700 font-medium">
              <DollarSign className="w-3 h-3 mr-1 text-green-500" />
              {salaryRange && salaryRange.min && salaryRange.max
                ? `${salaryRange.min}k-${salaryRange.max}k`
                : "Competitive"}
            </div>
          </div>
          
          {/* Bottom Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {applicantCount !== undefined && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span>{applicantCount}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>2d ago</span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

"use client";
import { useAuth } from "@/app/context/authcontext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Card from "../Card";
import {
  IJob,
  IJobsDetails,
  IPublicService,
  IUser,
} from "@/interface/interface";
import { useJob } from "@/app/context/jobcontext";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/usercontext";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("jobs"); // toggle state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const { theme } = useAuth();
  const [jobs, setJobs] = useState<IJobsDetails>({} as IJobsDetails);
  const [companies, setCompanies] = useState<IJobsDetails>({} as IJobsDetails);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { setJobDetails, setCompanyName, setJobQuery } = useJob();
  const router = useRouter();
  const { setUserDetails, setUserQuery } = useUser();

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(to bottom, #dbdbdbff, #850335ff, #190330ff)"
      : "linear-gradient(to bottom, #FFFDFE, #EC1166, #724B99)";

  const fetchSearchResults = async (filter: any) => {
    // Placeholder for API call
    setQuery(filter);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!baseUrl || !secret) {
      return;
    }
    const endpoints = [
      `${baseUrl}/public/jobs?title=${filter}`,
      `${baseUrl}/public/jobs?companyName=${filter}`,
      `${baseUrl}/public/users?name=${filter}`,
    ];

    setLoading(true);

    const [jobsRes, companiesRes, usersRes] = await Promise.all(
      endpoints.map((url) =>
        fetch(url, {
          headers: { secret: secret, "Content-Type": "application/json" },
        })
      )
    );

    const jobData = await jobsRes.json();
    const companiesData = await companiesRes.json();
    const usersData = await usersRes.json();

    const jobsDatas: IPublicService = jobData?.data;
    const companiesDatas: IPublicService = companiesData?.data;
    const usersDatas: IPublicService = usersData?.data;

    if (jobsDatas) {
      setJobs(jobsDatas.job);
    }

    if (companiesDatas) {
      setCompanies(companiesDatas.job);
    }

    if (usersDatas) {
      setUsers(usersDatas.user);
    }

    setLoading(false);
  };

  const navigateJob = (selectedJob: IJob) => {
    setJobDetails(selectedJob);
    router.push(`/jobs/${selectedJob._id}`);
  };

  const navigateWithQuery = (query: string) => {
    setJobQuery(query);
    router.push(`/jobs`);
  };
  const navigateCompany = (companyName: string) => {
    setCompanyName(companyName);
    router.push(`/jobs`);
  };

  const navigateUser = (user: IUser) => {
    setUserDetails(user);
    router.push(`/jobs/talents/${user._id}`);
  };

  const navigateUserQuery = (query: string) => {
    setUserQuery(query);
    router.push(`/jobs/talents`);
  };

  const getFallbackImage = (index: number) => {
    // Return the first banner as fallback for failed images
    return sliders[0];
  };

  const sliders = [
    "https://res.cloudinary.com/dk06cndku/image/upload/v1760345361/dotjobs_banner001_av0sjg.png",
    "https://res.cloudinary.com/dk06cndku/image/upload/v1760345361/dotjobs_banner003_rm8zgh.png",
    "https://res.cloudinary.com/dk06cndku/image/upload/v1760345360/dotjobs_banner002_rfph0r.png",
    "https://res.cloudinary.com/dk06cndku/image/upload/v1761941315/hyperbridge_banner_xxsvsa.png" // Temporary placeholder until Hyperbridge banner is fixed
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [sliders.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleSliderClick = (image: string, index: number) => {
    if (index === 0) {
      router.push('/about');
      return;
    }

    router.push('/info?index=' + index);
  };

  return (
    <div
      className="w-full relative mt-[8rem] z-10"
      style={{
        background: backgroundStyle,
      }}
    >
      {/* Banner Image Slider */}
      <div className="relative w-full cursor-pointer h-[40px] md:h-[90px] lg:h-[100px] overflow-hidden">
        {/* Slider Container */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliders.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-full cursor-pointer flex-shrink-0"
              onClick={() => handleSliderClick(image, index)}
            >
              <Image
                src={failedImages.has(index) ? getFallbackImage(index) : image}
                alt={`banner image ${index + 1}`}
                fill
                className="cursor-pointer object-cover object-center"
                priority={index === 0}
                sizes="100vw"
                onError={(e) => {
                  setFailedImages(prev => new Set([...prev, index]));
                }}
              />
            </div>
          ))}
        </div>

        {/* Theme-based Overlay */}
        <div
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(to right, rgba(219,219,219,0.1), rgba(133,3,53,0.2), rgba(25,3,48,0.3))"
                : "linear-gradient(to right, rgba(255,253,254,0.1), rgba(236,17,102,0.2), rgba(114,75,153,0.3))",
          }}
        />

        {/* Navigation Arrows */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-60 text-white p-2 rounded-full hover:bg-gray-400 hover:bg-opacity-80 transition-all duration-200 z-10"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button> */}

        {/* <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-60 text-white p-2 rounded-full hover:bg-gray-400 hover:bg-opacity-80 transition-all duration-200 z-10"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button> */}

        {/* Slide Indicators - Dot Style */}
        <div className="absolute bottom-1 md:bottom-2 lg:bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-10">
          {sliders.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 border border-white ${
                index === currentSlide
                  ? "bg-white scale-110 shadow-md"
                  : "bg-transparent border-opacity-70 hover:border-opacity-100 hover:scale-105"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex items-center justify-center gap-4 px-2  lg:pt-[8rem] pt-[4rem] text-white flex-col lg:flex-row animate-fadeUp">
        <div className="flex-1 lg:w-4/5 text-center lg:text-left">
          <h1 className="lg:text-4xl text-[14px] font-bold mb-2 animate-fadeUp delay-100">
            Find your dream job in the
          </h1>
          <h1 className="lg:text-4xl text-[14px] mt-4 font-bold mb-2 animate-fadeUp delay-100">
            Polkadot and Kusama Ecosystem
          </h1>
          <p className="mt-4 text-sm animate-fadeUp delay-200">
            Explore opportunities in the decentralized web, connecting talent
            with innovative projects and teams building the future.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-2 lg:mx-6 md:mx-4 mb-4 animate-fadeUp lg:px-0 z-[999]">
        <div className="relative w-full lg:w-1/2 mb-[4rem]">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            // value={query}
            onChange={(e) => fetchSearchResults(e.target.value)}
            placeholder="Search for jobs, talents, companies..."
            className="w-full pl-12 pr-4 py-3 rounded-md my-10 text-14 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg bg-white"
          />

          {/* Dropdown */}
          {query && (
            <Card className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl z-[9999]">
              {/* Tabs */}
              <div className="flex">
                {["jobs", "companies", "users"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-pink-500 text-pink-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div className="p-3 max-h-64 overflow-y-auto">
                {activeTab === "jobs" &&
                  (loading ? (
                    <p>Loading...</p>
                  ) : jobs.data.length === 0 ? (
                    <p>No results found</p>
                  ) : (
                    <div>
                      {jobs.data.map((job: IJob, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 mb-2"
                          onClick={() => navigateJob(job)}
                        >
                          <Image
                            src={job.logo || ""}
                            alt={job.title}
                            width={50}
                            height={50}
                            className="rounded-full object-cover w-[50px] h-[50px]"
                          />

                          <b className="hover:bg-gray-800 cursor-pointer p-3 rounded-md mb-2 border-b-2 border-gray-200">
                            {job.title} at {job.company_name}
                          </b>
                        </div>
                      ))}

                      <b
                        className="text-center flex justify-center text-[#680334] cursor-pointer"
                        onClick={() => navigateWithQuery(query)}
                      >
                        View More
                      </b>
                    </div>
                  ))}
                {activeTab === "companies" &&
                  (loading ? (
                    <p>Loading...</p>
                  ) : companies.data.length === 0 ? (
                    <p>No results found</p>
                  ) : (
                    <div>
                      {companies.data.map((company: IJob, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 mb-2"
                          onClick={() => navigateCompany(company.company_name)}
                        >
                          <Image
                            src={company.logo || ""}
                            alt={company.title}
                            height={50}
                            width={50}
                            className="rounded-full object-cover w-[50px] h-[50px]"
                          />
                          <b className="hover:bg-gray-800 cursor-pointer p-3 rounded-md mb-2 border-b-2 border-gray-200">
                            {company.company_name}
                          </b>
                        </div>
                      ))}

                      <b
                        className="text-center flex justify-center text-[#680334] cursor-pointer"
                        onClick={() => navigateCompany(query)}
                      >
                        View More
                      </b>
                    </div>
                  ))}
                {activeTab === "users" &&
                  (loading ? (
                    <p>Loading...</p>
                  ) : users.length === 0 ? (
                    <p>No results found</p>
                  ) : (
                    <div>
                      {users.map((user: IUser, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 mb-2"
                          onClick={() => navigateUser(user)}
                        >
                          <Image
                            src={user.avatar || ""}
                            alt={user.name}
                            height={50}
                            width={50}
                            className="rounded-full object-cover w-[50px] h-[50px]"
                          />
                          <b className="hover:bg-gray-800 cursor-pointer p-3 rounded-md mb-2 border-b-2 border-gray-200">
                            {user.name}
                          </b>
                        </div>
                      ))}

                      <b
                        className="text-center flex justify-center text-[#680334] cursor-pointer"
                        onClick={() => navigateUserQuery(query)}
                      >
                        View More
                      </b>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .animate-fadeUp.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fadeUp.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fadeUp.delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

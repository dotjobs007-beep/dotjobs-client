"use client";

import { useEffect, useState } from "react";
import { IUser } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import Card from "@/Component/Card";
import { useUser } from "@/app/context/usercontext";
import {
  CheckCircle,
  Search,
  MapPin,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { useAuth } from "@/app/context/authcontext";

interface IPagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function Talents() {
  const { userQuery } = useUser();
  const [query, setQuery] = useState(userQuery); // name or email
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState(""); // comma-separated
  const [jobSeekerOnly, setJobSeekerOnly] = useState<"" | "true" | "false">("");
  const [sortBy, setSortBy] = useState("createdAt");

  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useAuth();

  const { setUserDetails } = useUser();

  const buildQueryParams = (pageNum: number) => {
    const params = new URLSearchParams();
    params.append("page", String(pageNum));
    params.append("limit", "10");
    params.append("sortBy", sortBy);
    if (query) params.append("name", query);
    if (location) params.append("location", location);
    if (skills) params.append("skills", skills); // backend accepts comma-separated
    if (jobSeekerOnly) params.append("jobSeeker", jobSeekerOnly);
    return params.toString();
  };

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const q = buildQueryParams(pageNum);
      const res = await service.fetcher<any>(`/public/users?${q}`);
      if (res.code === 401) {
        router.replace("/auth/signin");
        return;
      }

      console.log("Fetched users:", res);

      // server returns { data: { data: users, pagination } }
      const payload = res.data ?? res; // defensive
      const list = payload?.user ?? payload; // defensive

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const usersData = Array.isArray(list) ? list : list.data ?? [];
      // try pagination in different shapes
      const pag = (payload.pagination ||
        (list.pagination ?? null)) as IPagination | null;

      setUsers(usersData as IUser[]);
      setPagination(pag ?? null);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleApply = () => fetchUsers(1);
  const nextPage = () =>
    pagination && page < pagination.totalPages && fetchUsers(page + 1);
  const prevPage = () => page > 1 && fetchUsers(page - 1);

  const handleNavigateToTalents = (talents: IUser) => {
    setUserDetails(talents);
    router.push(`/jobs/talents/${talents._id}`);
  };

  const color = theme === "dark" ? "text-[#fff]" : "text-[#734A98]";

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className={`text-4xl lg:text-5xl font-bold ${color} `}>
                Discover Talents
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with verified developers and contributors in the Polkadot
              ecosystem
            </p>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              {pagination && (
                <span>{pagination.totalUsers} talented developers</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm min-w-[140px]"
                />
              </div>

              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm min-w-[160px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={jobSeekerOnly}
                onChange={(e) => setJobSeekerOnly(e.target.value as any)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="">All</option>
                <option value="true">Job Seeking</option>
                <option value="false">Not Seeking</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="createdAt">Newest</option>
                <option value="-createdAt">Oldest</option>
              </select>

              <button
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-lg text-sm flex items-center"
              >
                <Search className="h-4 w-4 mr-1.5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No talents found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria or browse all available
              talents.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {users.map((u) => (
                <div key={u._id}>
                  <Card
                    className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    // onClick={() => handleNavigateToTalents(u)}
                  >
                    {/* Verified Badge */}
                    {u.verified_onchain && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      </div>
                    )}

                    {/* Job Seeker Status */}
                    {u.jobSeeker && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          <span className="w-2 h-2 bg-white rounded-full inline-block mr-1.5 animate-pulse"></span>
                          Available
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={
                            u.avatar ||
                            "https://res.cloudinary.com/dk06cndku/image/upload/v1761770552/49816613_gxgudm.jpg"
                          }
                          alt={u.name}
                          className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50 shadow-md"
                        />
                        {u.jobSeeker && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-full">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-600 transition-colors">
                              {u.name}
                            </h3>
                            <div className="flex items-center text-gray-500 text-sm h-5">
                              {u.location ? (
                                <>
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {u.location}
                                </>
                              ) : (
                                <span className="text-gray-400">
                                  No location specified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(u.skill || [])
                              .slice(0, 4)
                              .map((skill: string, index) => (
                                <span
                                  key={skill}
                                  className={`text-xs font-medium px-2 py-1 rounded-lg transition-all duration-200 ${
                                    index % 3 === 0
                                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                      : index % 3 === 1
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                  }`}
                                >
                                  {skill}
                                </span>
                              ))}
                            {(u.skill || []).length > 4 && (
                              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                                +{(u.skill || []).length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToTalents(u);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          <Eye className="h-3 w-3 mr-1.5" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex justify-center items-center">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-2 flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={prevPage}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </button>

              <div className="flex items-center space-x-2 px-4">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchUsers(pageNum)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-gray-400 px-2">...</span>
                    <button
                      onClick={() => fetchUsers(pagination.totalPages)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                        pagination.totalPages === page
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                disabled={page === pagination.totalPages}
                onClick={nextPage}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500">
            Showing {(page - 1) * 10 + 1} -{" "}
            {Math.min(page * 10, pagination.totalUsers)} of{" "}
            {pagination.totalUsers} talents
          </div>
        </div>
      )}
    </div>
  );
}

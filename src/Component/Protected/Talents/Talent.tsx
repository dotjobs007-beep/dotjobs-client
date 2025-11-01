"use client";

import { useEffect, useState } from "react";
import { IUser } from "@/interface/interface";
import service from "@/helper/service.helper";
import { useRouter } from "next/navigation";
import Card from "@/Component/Card";
import { useUser } from "@/app/context/usercontext";

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

      // server returns { data: { data: users, pagination } }
      const payload = res.data ?? res; // defensive
      const list = payload.user ?? payload; // defensive

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

  return (
    <div className="my-12 px-4 lg:px-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Browse Talents</h1>
        <p className="text-gray-600">
          Find developers and contributors by name, email, location or skills.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="flex-1 px-4 py-2 border rounded"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="px-4 py-2 border rounded w-40"
          />
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="px-4 py-2 border rounded flex-1"
          />
          <select
            value={jobSeekerOnly}
            onChange={(e) => setJobSeekerOnly(e.target.value as any)}
            className="px-3 py-2 border rounded w-40"
          >
            <option value="">All</option>
            <option value="true">Job seekers</option>
            <option value="false">Not job seekers</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded w-40"
          >
            <option value="createdAt">Newest</option>
            <option value="-createdAt">Oldest</option>
          </select>
          <button
            onClick={handleApply}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </Card>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-600">No talents found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <Card key={u._id} className="p-4 flex gap-4 items-center">
              <img
                src={u.avatar || "/Images/auth_img.png"}
                alt={u.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{u.name}</h3>
                    <p className="text-sm text-gray-500">location: {u.location}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      u.jobSeeker 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        u.jobSeeker ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                      {u.jobSeeker
                        ? "Available"
                        : "Not Available"}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 ">
                  {(u.skill || []).slice(0, 6).map((s: string) => (
                    <span
                      key={s}
                      className="text-xs bg-gray-400 px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleNavigateToTalents(u)}
                    className="text-sm text-gray-700"
                  >
                    View profile
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={prevPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={nextPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

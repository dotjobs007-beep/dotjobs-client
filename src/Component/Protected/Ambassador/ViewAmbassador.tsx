"use client";

import Card from "../../Card";
import Image from "next/image";
import { ArrowRight, Bookmark, Users, Clock, Calendar, DollarSign, MapPin, ExternalLink, MessageCircle, Send, Facebook, X } from "lucide-react";

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
  </svg>
);
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRelativeTime } from "@/utils/relativeTime";
import service from "@/helper/service.helper";
import { useAuth } from "@/app/context/authcontext";
import { IAmbassador, IApiResponse } from "@/interface/interface";
import { toast } from "react-hot-toast";

interface ApplicationFormData {
  briefIntroduction: string;
  contactMethod: string;
  contactHandle: string;
  discordHandle: string;
  telegramHandle: string;
  twitterHandle: string;
  githubHandle: string;
}

export default function ViewAmbassadorDetails() {
  const router = useRouter();
  const params = useParams();
  const { theme, isLoggedIn, userDetails } = useAuth();
  const [ambassador, setAmbassador] = useState<IAmbassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    briefIntroduction: "",
    contactMethod: "email",
    contactHandle: "",
    discordHandle: "",
    telegramHandle: "",
    twitterHandle: "",
    githubHandle: "",
  });

  const primaryColor = theme === "dark" ? "#7F13EC" : "#AE1E67";

  // Get placeholder and label for contact handle based on selected method
  const getContactInputProps = () => {
    switch (formData.contactMethod) {
      case "email":
        return { placeholder: "your.email@example.com", label: "Email Address", type: "email" };
      case "phone":
        return { placeholder: "+1234567890", label: "Phone Number", type: "tel" };
      case "discord":
        return { placeholder: "username#1234", label: "Discord Username", type: "text" };
      case "telegram":
        return { placeholder: "@username", label: "Telegram Handle", type: "text" };
      case "twitter":
        return { placeholder: "@username", label: "Twitter/X Handle", type: "text" };
      default:
        return { placeholder: "Contact info", label: "Contact", type: "text" };
    }
  };

  // Pre-populate form with user details when modal opens
  useEffect(() => {
    if (showApplicationModal && userDetails) {
      setFormData((prev) => ({
        ...prev,
        briefIntroduction: prev.briefIntroduction || userDetails.about || "",
        contactHandle: prev.contactHandle || userDetails.email || "",
        twitterHandle: prev.twitterHandle || userDetails.xProfile || "",
        githubHandle: prev.githubHandle || userDetails.githubProfile || "",
      }));
    }
  }, [showApplicationModal, userDetails]);

  useEffect(() => {
    const fetchAmbassador = async () => {
      try {
        const res: IApiResponse<{ ambassador: IAmbassador }> = await service.fetcher(
          `/public/ambassadors/${params.id}`,
          "GET"
        );

        if (res.status === "success" && res.data?.ambassador) {
          setAmbassador(res.data.ambassador);
        } else {
          router.push("/jobs");
        }
      } catch (error) {
        console.error("Failed to fetch ambassador details:", error);
        router.push("/jobs");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAmbassador();
    }
  }, [params.id, router]);

  const handleApply = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to apply");
      router.push("/auth/signin");
      return;
    }
    setShowApplicationModal(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.briefIntroduction.trim()) {
      toast.error("Please provide a brief introduction about yourself");
      return;
    }

    if (!formData.contactHandle.trim()) {
      toast.error("Please provide your contact information");
      return;
    }

    setApplying(true);
    try {
      const res = await service.fetcher(
        `/ambassador/ambassador-application`,
        "POST",
        {
          data: {
            ambassadorId: ambassador?._id,
            briefIntroduction: formData.briefIntroduction,
            contactMethod: formData.contactMethod,
            contactHandle: formData.contactHandle,
            discordHandle: formData.discordHandle,
            telegramHandle: formData.telegramHandle,
            twitterHandle: formData.twitterHandle,
            githubHandle: formData.githubHandle,
          },
          withCredentials: true,
        }
      );

      if (res.status === "success") {
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
      } else {
        toast.error(res.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="px-6 py-8 lg:px-[10rem] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading ambassador program...</div>
      </main>
    );
  }

  if (!ambassador) {
    return (
      <main className="px-6 py-8 lg:px-[10rem] min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Ambassador program not found</div>
      </main>
    );
  }

  const tags = [
    ambassador.program_type,
    ambassador.commitment_level,
    ambassador.duration,
    ambassador.compensation_type,
  ].filter(Boolean);

  return (
    <main className="px-6 py-8 lg:px-[10rem]">
      {/* Breadcrumb */}
      <p className="mb-6 text-gray-500 text-sm">
        Opportunities / Ambassador Programs / {ambassador.title}
      </p>

      {/* Title + Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${primaryColor}20`,
                color: primaryColor,
              }}
            >
              Ambassador Program
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">{ambassador.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Posted {getRelativeTime(ambassador.createdAt)}{" "}
            {ambassador.company_location ? `• ${ambassador.company_location}` : ""}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={applying}
            className="text-white px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            style={{ background: primaryColor }}
          >
            {applying ? "Submitting..." : "Apply Now"} <ArrowRight size={18} />
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Bookmark size={18} /> Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
        {/* Left Content */}
        <div className="w-full md:w-[60%]">
          <h2 className="font-bold text-xl my-2 dark:text-white">About the Program</h2>
          <p className="mb-5 leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {ambassador.description}
          </p>

          {/* Program Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Users className="w-5 h-5" style={{ color: primaryColor }} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{ambassador.program_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Clock className="w-5 h-5" style={{ color: primaryColor }} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Commitment</p>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{ambassador.commitment_level}</p>
              </div>
            </div>
            {ambassador.duration && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">{ambassador.duration}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <DollarSign className="w-5 h-5" style={{ color: primaryColor }} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Compensation</p>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{ambassador.compensation_type}</p>
              </div>
            </div>
          </div>

          {ambassador.requirements && (
            <>
              <h2 className="font-bold text-xl my-4 dark:text-white">Requirements</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{ambassador.requirements}</p>
            </>
          )}

          {ambassador.responsibilities && (
            <>
              <h2 className="font-bold text-xl my-4 dark:text-white">Responsibilities</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{ambassador.responsibilities}</p>
            </>
          )}

          {ambassador.benefits && (
            <>
              <h2 className="font-bold text-xl my-4 dark:text-white">Benefits</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{ambassador.benefits}</p>
            </>
          )}
        </div>

        {/* Right Card */}
        <div className="w-full md:w-[40%] mt-10 md:mt-0">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              {ambassador.logo ? (
                <Image
                  src={ambassador.logo}
                  alt="company logo"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-md flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, #FF2670)` }}
                >
                  {ambassador.company_name?.charAt(0) || "A"}
                </div>
              )}
              <h3 className="font-bold text-lg text-white">{ambassador.company_name}</h3>
            </div>

            <p className="text-sm mb-3 leading-relaxed text-gray-200">
              {ambassador.company_description || "No company description provided."}
            </p>

            {ambassador.company_location && (
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{ambassador.company_location}</span>
              </div>
            )}

            <h4 className="font-semibold mb-3 text-white">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) =>
                tag ? (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    {tag}
                  </span>
                ) : null
              )}
            </div>

            {/* Social Handles */}
            {(ambassador.twitter_handle || ambassador.telegram_handle || ambassador.discord_handle || ambassador.facebook_handle) && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Connect With Us</h4>
                <div className="flex flex-wrap gap-2">
                  {ambassador.twitter_handle && (
                    <a
                      href={ambassador.twitter_handle.startsWith("http") ? ambassador.twitter_handle : `https://x.com/${ambassador.twitter_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <XIcon className="w-4 h-4" />
                      X 
                    </a>
                  )}
                  {ambassador.telegram_handle && (
                    <a
                      href={ambassador.telegram_handle.startsWith("http") ? ambassador.telegram_handle : `https://t.me/${ambassador.telegram_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <Send className="w-4 h-4" />
                      Telegram
                    </a>
                  )}
                  {ambassador.discord_handle && (
                    <a
                      href={ambassador.discord_handle.startsWith("http") ? ambassador.discord_handle : `https://${ambassador.discord_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <DiscordIcon className="w-4 h-4" />
                      Discord
                    </a>
                  )}
                  {ambassador.facebook_handle && (
                    <a
                      href={ambassador.facebook_handle.startsWith("http") ? ambassador.facebook_handle : `https://facebook.com/${ambassador.facebook_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}

            {ambassador.company_website && (
              <a
                href={ambassador.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full text-center py-2 rounded-lg transition flex items-center justify-center gap-2 border"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                <ExternalLink size={16} />
                <b>Visit Company Site</b>
              </a>
            )}

            <button
              onClick={handleApply}
              disabled={applying}
              className="mt-3 w-full text-white py-2 rounded-lg transition disabled:opacity-50"
              style={{ background: primaryColor }}
            >
              <b>{applying ? "Submitting..." : "Apply Now"}</b>
            </button>
          </Card>

          {/* Application Stats */}
          {ambassador.applicantCount !== undefined && (
            <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 inline-block mr-2" />
                {ambassador.applicantCount} {ambassador.applicantCount === 1 ? "person has" : "people have"} applied
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">Apply for {ambassador.title}</h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-4 space-y-4">
              {/* Brief Introduction */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Brief Introduction About Yourself <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="briefIntroduction"
                  value={formData.briefIntroduction}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Tell us about yourself, your background, and why you'd be a great ambassador..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Preferred Contact Method
                </label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                  <option value="discord">Discord</option>
                  <option value="telegram">Telegram</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>

              {/* Contact Handle Input */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  {getContactInputProps().label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={getContactInputProps().type}
                  name="contactHandle"
                  value={formData.contactHandle}
                  onChange={handleFormChange}
                  placeholder={getContactInputProps().placeholder}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Social Media Handles Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium dark:text-white">
                  Social Media Handles
                  <span className="text-gray-500 font-normal ml-1">(Add if not in your profile)</span>
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Discord</label>
                    <input
                      type="text"
                      name="discordHandle"
                      value={formData.discordHandle}
                      onChange={handleFormChange}
                      placeholder="username#1234"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Telegram</label>
                    <input
                      type="text"
                      name="telegramHandle"
                      value={formData.telegramHandle}
                      onChange={handleFormChange}
                      placeholder="@username"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Twitter/X</label>
                    <input
                      type="text"
                      name="twitterHandle"
                      value={formData.twitterHandle}
                      onChange={handleFormChange}
                      placeholder="@username"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">GitHub</label>
                    <input
                      type="text"
                      name="githubHandle"
                      value={formData.githubHandle}
                      onChange={handleFormChange}
                      placeholder="username"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition dark:border-gray-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50"
                  style={{ background: primaryColor }}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

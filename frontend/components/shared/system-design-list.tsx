"use client";

import React, { useState, useDeferredValue, useMemo } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import {
  Search,
  Server,
  Database,
  Globe,
  Layers,
  Cloud,
  MessageSquare,
  Video,
  ShoppingCart,
  Car,
  CreditCard,
  ArrowRight,
  Clock,
  Zap,
  Filter,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const generateMetadata = (title: string) => {
  const lower = title.toLowerCase();
  let category = "Cloud Infrastructure";
  let tags = ["System Design", "Scalability"];
  let description =
    "Design a scalable architecture for this real-world system.";
  let icon = Server;

  if (
    lower.includes("twitter") ||
    lower.includes("instagram") ||
    lower.includes("facebook") ||
    lower.includes("tiktok")
  ) {
    category = "Social Media";
    tags = ["CDN", "Database", "Caching", "News Feed"];
    description =
      "Design a globally distributed social network with high read throughput.";
    icon = Globe;
  } else if (
    lower.includes("whatsapp") ||
    lower.includes("slack") ||
    lower.includes("messenger") ||
    lower.includes("chat")
  ) {
    category = "Messaging";
    tags = ["WebSockets", "NoSQL", "Real-time"];
    description = "Design a real-time messaging system with low latency.";
    icon = MessageSquare;
  } else if (
    lower.includes("youtube") ||
    lower.includes("netflix") ||
    lower.includes("spotify")
  ) {
    category = "Media Streaming";
    tags = ["CDN", "Blob Storage", "Streaming"];
    description =
      "Design a media streaming platform with massive bandwidth requirements.";
    icon = Video;
  } else if (
    lower.includes("amazon") ||
    lower.includes("ecommerce") ||
    lower.includes("bookmyshow") ||
    lower.includes("ticket")
  ) {
    category = "E-commerce";
    tags = ["Transactions", "Search", "Inventory"];
    description =
      "Design an e-commerce platform with consistent transactional data.";
    icon = ShoppingCart;
  } else if (
    lower.includes("uber") ||
    lower.includes("lyft") ||
    lower.includes("grab")
  ) {
    category = "Ride Sharing";
    tags = ["Geo-spatial", "Pub/Sub", "Real-time"];
    description =
      "Design a ride-sharing service with real-time location tracking.";
    icon = Car;
  } else if (
    lower.includes("dropbox") ||
    lower.includes("google drive") ||
    lower.includes("storage")
  ) {
    category = "Storage Systems";
    tags = ["Blob Storage", "Sync", "Chunking"];
    description = "Design a reliable and durable cloud storage system.";
    icon = Database;
  } else if (
    lower.includes("payment") ||
    lower.includes("stripe") ||
    lower.includes("paypal")
  ) {
    category = "Payment Systems";
    tags = ["ACID", "Security", "Idempotency"];
    description =
      "Design a highly secure and reliable payment processing system.";
    icon = CreditCard;
  } else if (lower.includes("tinyurl") || lower.includes("url shortener")) {
    category = "Core Systems";
    tags = ["Hashing", "Caching", "Key-Value Store"];
    description = "Design a highly available URL shortening service.";
    icon = Layers;
  }

  return { category, tags, description, icon };
};

export function SystemDesignList({
  isDashboard = false,
}: {
  isDashboard?: boolean;
}) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All Questions");
  const [systemDesignData, setSystemDesignData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { contentApi } = await import("@/lib/api");
        let data: any[] = [];

        try {
          if (isDashboard) {
            const res = await contentApi.getSystemDesignQuestions();
            data = res.data?.data || res.data || [];
          } else {
            // Dummy data for public preview if API fails or not dashboard
            data = [
              {
                _id: "1",
                id: "1",
                title: "Design a URL Shortener like TinyURL",
                estimatedTime: "45 mins",
                difficulty: "Medium",
                companies: ["Google", "Meta"],
              },
              {
                _id: "2",
                id: "2",
                title: "Design WhatsApp",
                estimatedTime: "60 mins",
                difficulty: "Hard",
                companies: ["Meta", "Discord"],
              },
              {
                _id: "3",
                id: "3",
                title: "Design a Rate Limiter",
                estimatedTime: "45 mins",
                difficulty: "Medium",
                companies: ["Stripe", "Amazon"],
              },
              {
                _id: "4",
                id: "4",
                title: "Design Twitter",
                estimatedTime: "60 mins",
                difficulty: "Hard",
                companies: ["Twitter", "Netflix"],
              },
              {
                _id: "5",
                id: "5",
                title: "Design YouTube",
                estimatedTime: "60 mins",
                difficulty: "Hard",
                companies: ["Google"],
              },
              {
                _id: "6",
                id: "6",
                title: "Design Uber",
                estimatedTime: "60 mins",
                difficulty: "Hard",
                companies: ["Uber", "Lyft"],
              },
              {
                _id: "7",
                id: "7",
                title: "Design Dropbox",
                estimatedTime: "45 mins",
                difficulty: "Medium",
                companies: ["Dropbox"],
              },
            ];
          }
        } catch (err) {}

        const augmentedData = Array.isArray(data)
          ? data.map((q: any) => {
              const meta = generateMetadata(q.title);
              return { ...q, ...meta };
            })
          : [];

        setSystemDesignData(augmentedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [isDashboard]);

  const filteredQuestions = useMemo(() => {
    return systemDesignData.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        q.category.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        q.tags.some((t: string) =>
          t.toLowerCase().includes(deferredSearch.toLowerCase()),
        );

      let matchesFilter = true;
      if (activeFilter === "Beginner") matchesFilter = q.difficulty === "Easy";
      else if (activeFilter === "Intermediate")
        matchesFilter = q.difficulty === "Medium";
      else if (activeFilter === "Advanced")
        matchesFilter = q.difficulty === "Hard";

      return matchesSearch && matchesFilter;
    });
  }, [systemDesignData, deferredSearch, activeFilter]);

  const featuredSystems = useMemo(() => {
    const featuredTitles = ["twitter", "youtube", "uber", "whatsapp"];
    return systemDesignData
      .filter((q) =>
        featuredTitles.some((ft) => q.title.toLowerCase().includes(ft)),
      )
      .slice(0, 4);
  }, [systemDesignData]);

  const actionButtons = [
    "All Questions",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];
  const topics = [
    "Cache",
    "Database",
    "Load Balancer",
    "CDN",
    "Queue",
    "Kafka",
    "Redis",
    "Sharding",
    "API Gateway",
    "Rate Limiter",
    "Search",
    "Notification",
    "Authentication",
    "Streaming",
    "Payments",
  ];

  const categories = [
    {
      name: "Social Media",
      icon: Globe,
      count: systemDesignData.filter((q) => q.category === "Social Media")
        .length,
    },
    {
      name: "Messaging",
      icon: MessageSquare,
      count: systemDesignData.filter((q) => q.category === "Messaging").length,
    },
    {
      name: "Media Streaming",
      icon: Video,
      count: systemDesignData.filter((q) => q.category === "Media Streaming")
        .length,
    },
    {
      name: "E-commerce",
      icon: ShoppingCart,
      count: systemDesignData.filter((q) => q.category === "E-commerce").length,
    },
    {
      name: "Ride Sharing",
      icon: Car,
      count: systemDesignData.filter((q) => q.category === "Ride Sharing")
        .length,
    },
    {
      name: "Storage Systems",
      icon: Database,
      count: systemDesignData.filter((q) => q.category === "Storage Systems")
        .length,
    },
    {
      name: "Payment Systems",
      icon: CreditCard,
      count: systemDesignData.filter((q) => q.category === "Payment Systems")
        .length,
    },
    {
      name: "Core Systems",
      icon: Layers,
      count: systemDesignData.filter((q) => q.category === "Core Systems")
        .length,
    },
    {
      name: "Cloud Infrastructure",
      icon: Cloud,
      count: systemDesignData.filter(
        (q) => q.category === "Cloud Infrastructure",
      ).length,
    },
  ].filter((c) => c.count > 0);

  return (
    <>
      {isDashboard && (
        <DashboardNavbar />
      )}

      <div className="flex flex-col flex-1 overflow-y-auto dark:bg-[#0a0a0a] bg-gray-50/50 min-h-screen text-foreground font-sans">
        {/* Hero Section */}
        <div className="pt-16 pb-12 px-6 lg:px-12 border-b dark:border-white/5 border-black/5 bg-gradient-to-b dark:from-white/[0.02] from-blue-50/50 to-transparent">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              System Design Explorer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10 font-medium leading-relaxed">
              Explore real-world architecture problems asked in top tech
              interviews. Master scalability, availability, and performance.
            </p>

            {/* Large Search Bar */}
            <div className="relative w-full max-w-2xl mb-10 group">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl transition-all opacity-0 group-focus-within:opacity-100"></div>
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-blue-600"
                size={22}
              />
              <input
                type="text"
                placeholder="Search systems, topics, or companies..."
                className="relative w-full pl-14 pr-6 py-4 dark:bg-[#111] bg-white border dark:border-white/10 border-black/10 rounded-2xl text-lg outline-none transition-all shadow-sm focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus:ring-4 focus:ring-blue-500/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {actionButtons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => setActiveFilter(btn)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === btn
                      ? "bg-foreground text-background shadow-md scale-105"
                      : "bg-background border dark:border-white/10 border-black/10 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-12 space-y-16">
          {/* Topic Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearch(topic)}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-background border dark:border-white/10 border-black/10 text-foreground hover:border-blue-500/40 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {!search && activeFilter === "All Questions" && featuredSystems.length > 0 && (
            /* Featured Section */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured System Designs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {featuredSystems.map((problem) => {
                  const slug = problem.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                  const Icon = problem.icon;
                  return (
                    <Link
                      key={problem._id}
                      href={
                        isDashboard
                          ? `/system-design/${slug}`
                          : `/codestreak/system-design/${slug}`
                      }
                      className="group flex flex-col justify-between bg-card dark:bg-[#111] border dark:border-white/10 border-black/10 rounded-[20px] p-6 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="text-blue-500 w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                      <div>
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                          <Icon className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                          {problem.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                          {problem.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {problem.estimatedTime}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {!search && activeFilter === "All Questions" && categories.length > 0 && (
            /* Categories Section */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSearch(category.name)}
                      className="flex items-center gap-4 p-4 bg-background border dark:border-white/10 border-black/10 rounded-[16px] hover:border-blue-500/40 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {category.count} Questions
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Questions Grid */}
          <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {search || activeFilter !== "All Questions" ? "Search Results" : "All Questions"}
              </h2>
              <span className="text-muted-foreground text-sm font-medium bg-muted px-3 py-1 rounded-full">
                {filteredQuestions.length} Total
              </span>
            </div>

            {isLoading ? (
              <div className="py-32 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredQuestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.map((problem) => {
                  const slug = problem.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                  const Icon = problem.icon;
                  return (
                    <Link
                      key={problem._id}
                      href={
                        isDashboard
                          ? `/system-design/${slug}`
                          : `/codestreak/system-design/${slug}`
                      }
                      className="group flex flex-col bg-card dark:bg-[#111] border dark:border-white/10 border-black/10 rounded-[20px] transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-transparent group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-100 dark:group-hover:border-blue-500/20 transition-colors">
                            <Icon className="text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 w-5 h-5 transition-colors" />
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              problem.difficulty === "Easy"
                                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                : problem.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                          {problem.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-5 flex-1">
                          {problem.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {problem.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-1 bg-background border dark:border-white/10 border-black/10 text-muted-foreground font-medium rounded-md whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t dark:border-white/10 border-black/10 mt-auto">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                            <Clock className="w-4 h-4" />
                            {problem.estimatedTime || "45 mins"}
                          </div>
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Open Design <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="py-24 flex flex-col items-center justify-center text-center bg-card/50 border dark:border-white/5 border-black/5 rounded-[24px] border-dashed">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Filter className="text-muted-foreground/50 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  No matching system design found.
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We couldn't find any questions matching your current filters
                  and search query.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All Questions");
                  }}
                  className="px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

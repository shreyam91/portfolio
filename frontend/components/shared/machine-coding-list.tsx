"use client";

import React, { useState, useDeferredValue, useMemo } from "react";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";
import Link from "next/link";
import {
  Search,
  Code2,
  Gamepad2,
  CalendarCheck,
  Wallet,
  MessageCircle,
  Briefcase,
  ShoppingCart,
  Heart,
  PlaySquare,
  FolderOpen,
  Wrench,
  ArrowRight,
  Clock,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Box,
  LayoutGrid,
  Code,
  FileCode2,
  AlertCircle,
  TerminalSquare,
  Play,
  Terminal,
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

  let type = "Utilities";
  let description = "Build a complete, real-world utility application.";
  let loc = "~500 LOC";
  let concepts = ["OOP", "SOLID"];
  let features = ["Core application logic", "In-memory database", "CLI menu"];
  let classes = ["Application", "Service", "Repository"];
  let patterns = ["Singleton", "Factory"];

  if (lower.includes("splitwise")) {
    type = "Finance";
    description =
      "Build an expense sharing application with automated settlements.";
    loc = "~1200 LOC";
    concepts = ["OOP", "Graph Algorithms", "Design Patterns"];
    features = ["Add expenses", "Split equally/unequally", "Simplify debts"];
    classes = ["User", "Expense", "Split", "BalanceSheet"];
    patterns = ["Strategy", "Observer"];
  } else if (
    lower.includes("bookmyshow") ||
    lower.includes("ticket") ||
    lower.includes("parking")
  ) {
    type = "Booking Systems";
    description = "Build a reservation system with concurrency control.";
    loc = "~1500 LOC";
    concepts = ["Concurrency", "State Management", "SOLID"];
    features = [
      "Search availability",
      "Concurrent booking",
      "Payment processing",
    ];
    classes = ["Booking", "Seat", "User", "Payment"];
    patterns = ["State", "Factory", "Strategy"];
  } else if (
    lower.includes("snake") ||
    lower.includes("chess") ||
    lower.includes("tic tac toe") ||
    lower.includes("game")
  ) {
    type = "Games";
    description = "Build a classic game with complex state management.";
    loc = "~800 LOC";
    concepts = ["State Management", "OOP", "Design Patterns"];
    features = ["Game loop", "Move validation", "Score tracking"];
    classes = ["Game", "Board", "Player", "Piece"];
    patterns = ["State", "Command", "Observer"];
  } else if (lower.includes("atm")) {
    type = "Finance";
    description = "Build an ATM machine simulation.";
    loc = "~600 LOC";
    concepts = ["State Management", "Design Patterns"];
    features = ["Cash withdrawal", "Balance inquiry", "PIN validation"];
    classes = ["ATM", "Card", "Account", "CashDispenser"];
    patterns = ["State", "Chain of Responsibility"];
  } else if (lower.includes("file system")) {
    type = "File Systems";
    description = "Build an in-memory file system.";
    loc = "~1000 LOC";
    concepts = ["Data Structures", "Recursion", "OOP"];
    features = [
      "Create files/directories",
      "Read/Write files",
      "Search files",
    ];
    classes = ["FileSystem", "File", "Directory", "Node"];
    patterns = ["Composite", "Iterator"];
  } else if (
    lower.includes("delivery") ||
    lower.includes("zomato") ||
    lower.includes("swiggy")
  ) {
    type = "E-commerce";
    description = "Build a food delivery application.";
    loc = "~1800 LOC";
    concepts = ["OOP", "Design Patterns", "State Management"];
    features = ["Restaurant search", "Cart management", "Order tracking"];
    classes = ["Restaurant", "User", "Order", "DeliveryAgent"];
    patterns = ["Observer", "Strategy", "State"];
  } else if (lower.includes("trello") || lower.includes("jira")) {
    type = "Productivity";
    description = "Build a project management tool.";
    loc = "~1500 LOC";
    concepts = ["OOP", "State Management"];
    features = ["Create boards", "Move cards", "Assign users"];
    classes = ["Board", "List", "Card", "User"];
    patterns = ["Observer", "State", "Command"];
  }

  return { type, description, loc, concepts, features, classes, patterns };
};

export function MachineCodingList({
  isDashboard = false,
}: {
  isDashboard?: boolean;
}) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("All");
  const [machineCodingData, setMachineCodingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { contentApi } = await import("@/lib/api");
        let data: any[] = [];

        try {
          if (isDashboard) {
            const res = await contentApi.getMachineCodingQuestions();
            data = Array.isArray(res) ? res : (res.data?.data || res.data || []);
          } else {
            // Dummy data for public preview
            data = [
              {
                _id: "1",
                id: "1",
                title: "Design a File System",
                estimatedTime: "45 mins",
                difficulty: "Medium",
                companies: ["Amazon", "Microsoft"],
              },
              {
                _id: "2",
                id: "2",
                title: "Task Scheduler",
                estimatedTime: "60 mins",
                difficulty: "Hard",
                companies: ["Uber", "Atlassian"],
              },
              {
                _id: "3",
                id: "3",
                title: "Parking Lot Design",
                estimatedTime: "45 mins",
                difficulty: "Medium",
                companies: ["Google", "Flipkart"],
              },
              {
                _id: "4",
                id: "4",
                title: "In-Memory Key Value Store",
                estimatedTime: "30 mins",
                difficulty: "Easy",
                companies: ["Stripe", "Redis"],
              },
              {
                _id: "5",
                id: "5",
                title: "Design Splitwise",
                estimatedTime: "90 mins",
                difficulty: "Hard",
                companies: ["Google", "Uber"],
              },
              {
                _id: "6",
                id: "6",
                title: "Design BookMyShow",
                estimatedTime: "90 mins",
                difficulty: "Hard",
                companies: ["Amazon", "Flipkart"],
              },
              {
                _id: "7",
                id: "7",
                title: "Design Snake Game",
                estimatedTime: "60 mins",
                difficulty: "Medium",
                companies: ["Microsoft", "Google"],
              },
            ];
          }
        } catch (error) {}

        const augmentedData = Array.isArray(data)
          ? data.map((q: any) => {
              const meta = generateMetadata(q.title);
              return { ...q, ...meta };
            })
          : [];

        setMachineCodingData(augmentedData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [isDashboard]);

  const filteredQuestions = useMemo(() => {
    return machineCodingData.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        q.type.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        q.concepts.some((c: string) =>
          c.toLowerCase().includes(deferredSearch.toLowerCase()),
        );

      let matchesFilter = true;
      if (activeFilter === "Beginner") matchesFilter = q.difficulty === "Easy";
      else if (activeFilter === "Intermediate")
        matchesFilter = q.difficulty === "Medium";
      else if (activeFilter === "Advanced")
        matchesFilter = q.difficulty === "Hard";
      // Most Asked and Recently Added would be server-side or more complex logic,
      // here we just treat them as "All" for demo.

      return matchesSearch && matchesFilter;
    });
  }, [machineCodingData, deferredSearch, activeFilter]);

  const featuredProjects = useMemo(() => {
    const featuredTitles = ["splitwise", "bookmyshow", "snake", "parking"];
    return machineCodingData
      .filter((q) =>
        featuredTitles.some((ft) => q.title.toLowerCase().includes(ft)),
      )
      .slice(0, 4);
  }, [machineCodingData]);

  const projectTypes = [
    { name: "Games", icon: Gamepad2 },
    { name: "Booking Systems", icon: CalendarCheck },
    { name: "Finance", icon: Wallet },
    { name: "Messaging", icon: MessageCircle },
    { name: "Productivity", icon: Briefcase },
    { name: "E-commerce", icon: ShoppingCart },
    { name: "Social Media", icon: Heart },
    { name: "Media Players", icon: PlaySquare },
    { name: "File Systems", icon: FolderOpen },
    { name: "Utilities", icon: Wrench },
  ];

  const skills = [
    { name: "Object-Oriented Design", icon: Box },
    { name: "SOLID Principles", icon: ShieldCheck },
    { name: "Low-Level Design", icon: Layers },
    { name: "Design Patterns", icon: LayoutGrid },
    { name: "Concurrency", icon: Cpu },
    { name: "API Design", icon: Code },
    { name: "File Handling", icon: FolderOpen },
    { name: "State Management", icon: TerminalSquare },
  ];

  return (
    <>
      {isDashboard && (
        <DashboardNavbar />
      )}

      <div className="flex flex-col flex-1 overflow-y-auto dark:bg-[#0a0a0a] bg-[#fafafa] min-h-screen text-foreground font-sans">
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-6 lg:px-12 relative overflow-hidden">
          {/* Subtle grid and gradient background */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b dark:from-indigo-900/20 from-indigo-100/50 to-transparent pointer-events-none -z-10"></div>

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-6">
              <Terminal className="w-4 h-4" /> Developer Workshop
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
              Machine Coding Workshop
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
              Build real-world applications, practice object-oriented design,
              and improve implementation skills for coding interviews.
            </p>

            {/* Large Search Bar */}
            <div className="relative w-full max-w-2xl mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-30 transition-all duration-500"></div>
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-indigo-600"
                size={24}
              />
              <input
                type="text"
                placeholder="Search projects, concepts, or technologies..."
                className="relative w-full pl-16 pr-6 py-5 dark:bg-[#111] bg-white border dark:border-white/10 border-black/10 rounded-2xl text-lg outline-none transition-all shadow-sm focus:border-indigo-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                "All",
                "Beginner",
                "Intermediate",
                "Advanced",
                "Most Asked",
                "Recently Added",
              ].map((btn) => (
                <button
                  key={btn}
                  onClick={() => setActiveFilter(btn)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === btn
                      ? "bg-foreground text-background shadow-md"
                      : "bg-transparent border dark:border-white/10 border-black/10 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full py-12 space-y-24">
          {!search &&
            activeFilter === "All" &&
            featuredProjects.length > 0 && (
              /* Featured Projects Section */
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Featured Projects
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProjects.map((problem) => {
                    const slug = problem.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    return (
                      <div
                        key={problem._id}
                        className="group flex flex-col justify-between bg-card dark:bg-[#111] border dark:border-white/10 border-black/10 rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] hover:-translate-y-1 relative"
                      >
                        {/* Glassmorphism Header */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md border ${
                              problem.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                                : problem.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          <div className="bg-background/80 backdrop-blur-md border dark:border-white/10 border-black/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {problem.estimatedTime}
                          </div>
                        </div>

                        {/* Project Artwork Placeholder (Gradient) */}
                        <div className="h-48 w-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 relative overflow-hidden flex items-center justify-center">
                          <Code2 className="w-20 h-20 text-indigo-500/20 dark:text-indigo-400/20 transform -rotate-12 scale-150 group-hover:scale-125 transition-transform duration-700" />
                        </div>

                        <div className="p-8 flex-1 flex flex-col bg-card dark:bg-[#111]">
                          <h3 className="font-bold text-2xl mb-3 text-foreground group-hover:text-indigo-600 transition-colors">
                            {problem.title.replace("Design ", "Build ")}
                          </h3>
                          <p className="text-muted-foreground text-base mb-6 flex-1">
                            {problem.description}
                          </p>

                          <div className="space-y-6">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Primary Concepts
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {problem.concepts.map((concept: string) => (
                                  <span
                                    key={concept}
                                    className="text-xs px-3 py-1.5 bg-muted text-foreground font-medium rounded-md"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <Link
                              href={
                                isDashboard
                                  ? `/machine-coding/${slug}`
                                  : `/codestreak/machine-coding/${slug}`
                              }
                              className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                            >
                              Build Project <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {!search && activeFilter === "All" && (
            /* Browse by Project Type */
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">
                Browse by Project Type
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.name}
                      onClick={() => setSearch(type.name)}
                      className="flex flex-col items-center justify-center gap-4 p-6 bg-transparent border dark:border-white/10 border-black/10 rounded-[20px] hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all hover:-translate-y-1 group"
                    >
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <span className="font-semibold text-sm text-center group-hover:text-indigo-600 transition-colors">
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!search && activeFilter === "All" && (
            /* Skills You'll Practice */
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">
                Skills You'll Practice
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="flex items-center gap-4 p-5 bg-card dark:bg-[#111] border dark:border-white/10 border-black/10 rounded-[16px] shadow-sm"
                    >
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-semibold text-sm">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Project Gallery */}
          <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">
                Project Gallery
              </h2>
              <span className="text-muted-foreground text-sm font-medium bg-muted px-4 py-1.5 rounded-full">
                {filteredQuestions.length} Projects
              </span>
            </div>

            {isLoading ? (
              <div className="py-32 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredQuestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredQuestions.map((problem) => {
                  const slug = problem.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                  return (
                    <Link
                      key={problem._id}
                      href={
                        isDashboard
                          ? `/machine-coding/${slug}`
                          : `/codestreak/machine-coding/${slug}`
                      }
                      className="group flex flex-col bg-card dark:bg-[#111] border dark:border-white/10 border-black/10 rounded-[20px] transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_12px_30px_rgba(79,70,229,0.1)] hover:-translate-y-1 relative"
                    >
                      {/* Project Preview on Hover (Desktop) */}
                      <div className="absolute inset-0 z-20 bg-card/95 dark:bg-[#111]/95 backdrop-blur-md rounded-[20px] p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col pointer-events-none lg:block hidden">
                        <h4 className="font-bold text-lg mb-4 text-indigo-600 dark:text-indigo-400">
                          Project Preview
                        </h4>
                        <div className="space-y-4 flex-1">
                          <div>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                              Key Features
                            </span>
                            <ul className="text-sm space-y-1 text-foreground/90">
                              {problem.features.map(
                                (f: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                    {f}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                              Suggested Classes
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.classes.map(
                                (c: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded"
                                  >
                                    {c}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                              Design Patterns
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.patterns.map(
                                (p: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs border dark:border-white/10 border-black/10 px-2 py-0.5 rounded-full"
                                  >
                                    {p}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 border-t dark:border-white/10 border-black/10 flex justify-end">
                          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1">
                            Click to begin <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      {/* Default Card Content */}
                      <div className="p-6 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center border border-transparent group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 transition-colors">
                            <FileCode2 className="text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 w-6 h-6 transition-colors" />
                          </div>
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
                        </div>

                        <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {problem.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                          {problem.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {problem.concepts.map((concept: string) => (
                            <span
                              key={concept}
                              className="text-[11px] px-2.5 py-1 bg-background border dark:border-white/10 border-black/10 text-muted-foreground font-medium rounded-md whitespace-nowrap"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t dark:border-white/10 border-black/10 mt-auto">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                              <Clock className="w-4 h-4" />
                              {problem.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                              <Code2 className="w-4 h-4" />
                              {problem.loc}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 lg:hidden flex items-center gap-1">
                            Start Building
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
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <TerminalSquare className="text-muted-foreground/50 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  No projects match your search.
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Try adjusting your filters or search for another technology,
                  concept, or project name.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore All Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

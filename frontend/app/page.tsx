"use client";

import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import JourneyMap from "@/components/JourneyMap";
import SkillsTools from "@/components/SkillsTools";
import Timeline from "@/components/Timeline";
import Thoughts from "@/components/Thoughts";
import CodeStreakSection from "@/components/CodeStreakSection";
import Destination from "@/components/Destination";
import GlobalHeader from "@/components/GlobalHeader";
import Certifications from "@/components/Certifications";
import ImageGallery from "@/components/ImageGallery";
import { portfolioData } from "./data/portfolioData";
import { projects } from "./data/projectsData";
import { blogs } from "./data/blogsData";

import { contentApi } from "@/lib/api";

export default function AdventurePage() {
  const [mounted, setMounted] = useState(false);
  const [dbBlogs, setDbBlogs] = useState(blogs);
  const [dbProjects, setDbProjects] = useState(projects);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const [blogsRes, projectsRes] = await Promise.all([
          contentApi.getBlogs().catch(() => null),
          contentApi.getProjects().catch(() => null),
        ]);

        if (blogsRes?.data?.data) {
          setDbBlogs(blogsRes.data.data);
        }
        if (projectsRes?.data?.data) {
          setDbProjects(projectsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] text-[#1a1a1a] dark:text-[#fcfcfc] transition-colors duration-300 font-sans selection:bg-[#3b82f6] selection:text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#e0e7ff] dark:bg-[#0f172a] rounded-full blur-[150px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#fce7f3] dark:bg-[#31102f] rounded-full blur-[150px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <GlobalHeader />
        <Hero heroData={portfolioData.hero} />
        <JourneyMap projects={dbProjects} />
        <SkillsTools
          skills={portfolioData.skills}
          techStack={portfolioData.techStack}
        />
        <Timeline experience={portfolioData.experience} />
        <Thoughts blogs={dbBlogs} />
        <CodeStreakSection />
        <Certifications />
        <ImageGallery />
        <Destination
          contact={portfolioData.contact}
          socialLinks={portfolioData.socialLinks}
        />
      </div>
    </div>
  );
}

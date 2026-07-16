"use client";

import { useEffect, useState, use } from "react";
import { MachineCodingDetail } from "@/components/shared/machine-coding-detail";
import { contentApi } from "@/lib/api";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";

export default function MachineCodingDashboardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        // The API returns all challenges in getMachineCodingQuestions
        const res = await contentApi.getMachineCodingQuestions();
        const data = Array.isArray(res) ? res : (res.data?.data || res.data || []);
        
        // Find matching item (by matching id or converting title to slug to match resolvedParams.id)
        const found = data.find((item: any) => 
          item.id?.toString() === resolvedParams.id || 
          item._id === resolvedParams.id ||
          item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === resolvedParams.id
        );
        
        if (found) setChallenge(found);
      } catch (err) {
        // console.error("Failed to load machine coding challenge", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <DashboardNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <DashboardNavbar />
        <div className="flex-1 flex justify-center items-center text-muted-foreground">
          Challenge not found
        </div>
      </div>
    );
  }

  return <MachineCodingDetail isDashboard={true} challenge={challenge} />;
}

"use client";

import { useEffect, useState, use } from "react";
import { SystemDesignDetail } from "@/components/shared/system-design-detail";
import { contentApi } from "@/lib/api";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";

export default function SystemDesignDashboardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        // The API returns all questions in getSystemDesignQuestions, we can find the one matching ID or slug.
        // Or if the backend has getSingleSystemDesign we can use that if the ID matches _id.
        // We'll fetch all and find by title/id matching the slug to be safe.
        const res = await contentApi.getSystemDesignQuestions();
        const data = res.data?.data || [];
        
        // Find matching item (by matching id or converting title to slug to match resolvedParams.id)
        const found = data.find((item: any) => 
          item.id?.toString() === resolvedParams.id || 
          item._id === resolvedParams.id ||
          item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === resolvedParams.id
        );
        
        if (found) setQuestion(found);
      } catch (err) {
        console.error("Failed to load system design question", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestion();
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

  if (!question) {
    return (
      <div className="dark:bg-[#0a0a0a] min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <DashboardNavbar />
        <div className="flex-1 flex justify-center items-center text-muted-foreground">
          Question not found
        </div>
      </div>
    );
  }

  return <SystemDesignDetail isDashboard={true} question={question} />;
}

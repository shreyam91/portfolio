"use client";

import { use, useEffect, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { SystemDesignDetail } from "@/components/shared/system-design-detail";
import { contentApi } from "@/lib/api";

export default function SystemDesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const res = await contentApi.getSystemDesignQuestions();
        const data = res.data?.data ?? res.data ?? [];
        const found = data.find(
          (item: any) =>
            item.id?.toString() === resolvedParams.id ||
            item._id === resolvedParams.id ||
            item.title
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "") === resolvedParams.id,
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <CodeStreakNav />
        <div className="py-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <CodeStreakNav />
        <div className="py-28 text-center">
          <p className="text-base font-light text-gray-500 dark:text-gray-400">
            Case study not found.
          </p>
        </div>
      </div>
    );
  }

  return <SystemDesignDetail question={question} />;
}

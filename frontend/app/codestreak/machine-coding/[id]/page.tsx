"use client";

import { use, useEffect, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { MachineCodingDetail } from "@/components/shared/machine-coding-detail";
import { contentApi } from "@/lib/api";

export default function MachineCodingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const res = await contentApi.getMachineCodingQuestions();
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
        if (found) setChallenge(found);
      } catch (err) {
        console.error("Failed to load machine coding challenge", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        <CodeStreakNav />
        <div className="py-28 text-center">
          <p className="text-base font-light text-gray-500 dark:text-gray-400">
            Challenge not found.
          </p>
        </div>
      </div>
    );
  }

  return <MachineCodingDetail challenge={challenge} />;
}

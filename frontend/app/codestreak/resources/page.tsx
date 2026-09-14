"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CodeStreakNav } from "@/components/shared/CodeStreakNav";
import { EASE, PageHeader, TagPill } from "@/components/shared/codestreak-ui";
import { contentApi } from "@/lib/api";
import { useCodeStreakBasePath } from "@/lib/codestreak";

type Resource = {
  _id?: string;
  slug?: string;
  title?: string;
  description?: string;
  type?: string;
  pages?: number;
  size?: string;
  lastUpdated?: string;
  downloadUrl?: string;
};

export default function ResourcesPage() {
  const basePath = useCodeStreakBasePath();
  const [items, setItems] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await contentApi.getResources();
        const data = res.data?.data ?? res.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <PageHeader
          eyebrow="Resources"
          title="Handbooks &"
          titleAccent="downloads"
          subtitle="PDFs and guides I keep for interview prep — free to preview or download."
        />

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              No resources yet.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {items.map((res, i) => (
              <motion.div
                key={res._id ?? res.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
              >
                <div className="group flex flex-col md:flex-row gap-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8 hover:border-[#3b82f6]/40 transition-all duration-300">
                  <div className="w-12 h-12 shrink-0 rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/5 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                        {res.type ?? "PDF"}
                      </TagPill>
                      {res.pages != null && (
                        <TagPill>{res.pages} pages</TagPill>
                      )}
                      {res.size && <TagPill>{res.size}</TagPill>}
                    </div>
                    <h3 className="text-lg font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc]">
                      {res.title}
                    </h3>
                    {res.description && (
                      <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                    {res.lastUpdated && (
                      <p className="mt-3 text-xs font-mono text-gray-400 dark:text-gray-500">
                        Updated {res.lastUpdated}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row md:flex-col items-center gap-3 shrink-0">
                    <Link
                      href={`${basePath}/resources/${res.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-[#3b82f6] hover:underline"
                    >
                      Preview <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    {res.downloadUrl && (
                      <a
                        href={res.downloadUrl}
                        download
                        className="inline-flex items-center gap-1.5 text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 hover:border-[#3b82f6]/40 hover:text-[#3b82f6] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

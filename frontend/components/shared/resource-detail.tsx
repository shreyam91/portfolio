"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  FileText,
  Link2,
} from "lucide-react";
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

export function ResourceDetail({ slug }: { slug: string }) {
  const basePath = useCodeStreakBasePath();
  const [resource, setResource] = useState<Resource | null>(null);
  const [related, setRelated] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getResources();
        const all = (res.data?.data ?? res.data ?? []) as Resource[];
        const found = all.find((r) => r.slug === slug);
        setResource(found ?? null);
        setRelated(all.filter((r) => r.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error("Failed to load resource", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <CodeStreakNav />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
          </div>
        ) : !resource ? (
          <div className="py-20 text-center">
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              Resource not found.
            </p>
            <Link
              href={`${basePath}/resources`}
              className="inline-block mt-4 text-sm font-mono text-[#3b82f6] hover:underline"
            >
              ← All resources
            </Link>
          </div>
        ) : (
          <>
            {/* Back */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Link
                href={`${basePath}/resources`}
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All resources
              </Link>
            </motion.div>

            <PageHeader
              eyebrow={resource.type ?? "Resource"}
              title={resource.title ?? "Resource"}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <TagPill className="text-[#3b82f6] border-[#3b82f6]/30">
                  <FileText className="w-3 h-3 mr-1" />
                  {resource.type ?? "PDF"}
                </TagPill>
                {resource.pages != null && (
                  <TagPill>{resource.pages} pages</TagPill>
                )}
                {resource.size && <TagPill>{resource.size}</TagPill>}
                {resource.lastUpdated && (
                  <TagPill>Updated {resource.lastUpdated}</TagPill>
                )}
              </div>

              {resource.description && (
                <p className="text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {resource.downloadUrl && (
                  <a
                    href={resource.downloadUrl}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white text-sm font-mono rounded-full hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                )}
                {resource.downloadUrl && (
                  <a
                    href={resource.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono text-[#3b82f6] hover:underline"
                  >
                    Open <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>

            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="mb-5 text-xs font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                  More resources
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((res) => (
                    <Link
                      key={res._id ?? res.slug}
                      href={`${basePath}/resources/${res.slug}`}
                      className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5 hover:border-[#3b82f6]/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-2">
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono uppercase tracking-widest">
                          {res.type ?? "PDF"}
                        </span>
                      </div>
                      <h3 className="text-sm font-normal tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] group-hover:text-[#3b82f6] transition-colors leading-snug">
                        {res.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

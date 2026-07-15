"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { Play, ListFilter } from "lucide-react";

import { contentApi } from "@/lib/api";

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videosData, setVideosData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await contentApi.getVideos();
        const data = res.data?.data || [];
        // Normalize: extract YouTube ID from youtubeLink or use videoId field
        const normalized = data.map((v: any) => {
          let ytId = v.videoId || v.id || "";
          if (!ytId && v.youtubeLink) {
            const match = v.youtubeLink.match(
              /(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/,
            );
            if (match) ytId = match[1];
          }
          return {
            ...v,
            ytId,
            thumbnail:
              v.thumbnail ||
              (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""),
          };
        });
        setVideosData(normalized);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    loadVideos();
  }, []);

  const categories = ["All", "DSA", "System Design", "Web Dev"];

  const filteredVideos = videosData.filter(
    (v) => activeCategory === "All" || v.category === activeCategory,
  );

  return (
    <>
      <header className="dark:bg-[#0a0a0a]/80 bg-white/80 backdrop-blur-xl sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b dark:border-white/10 border-black/10 px-4 z-10">
        
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">
                Video Library
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 lg:p-10 flex-1 overflow-y-auto dark:bg-[#0a0a0a] bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learning Videos</h1>
              <p className="text-muted-foreground">
                Curated video content to help you master concepts quickly.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <ListFilter size={18} className="text-muted-foreground mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent border dark:border-white/10 border-black/10 text-foreground hover:bg-muted"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video._id || video.id}
                  className="group cursor-pointer flex flex-col h-full"
                >
                  <div
                    className="relative rounded-xl overflow-hidden mb-3 aspect-video border dark:border-white/10 border-black/10 shadow-sm bg-black group cursor-pointer"
                    onClick={() =>
                      !playingVideoId &&
                      setPlayingVideoId(video._id || video.id)
                    }
                  >
                    {playingVideoId === (video._id || video.id) ? (
                      <iframe
                        className="w-full h-full absolute inset-0 bg-black"
                        src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />

                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg hover:bg-primary hover:border-primary">
                            <Play
                              size={24}
                              className="ml-1"
                              fill="currentColor"
                            />
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold tracking-wide rounded border border-white/10 backdrop-blur-sm shadow-sm pointer-events-none">
                          {video.duration}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground mt-auto">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        {video.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredVideos.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ListFilter className="text-muted-foreground" size={24} />
                  </div>
                  <h3 className="text-lg font-bold">No videos found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your category filter.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

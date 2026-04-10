"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useClickOutside } from "@react-hookz/web";
import { projects } from "@/data";
import Image from 'next/image';
import { Github, ExternalLink, X } from 'lucide-react';

export function ExpandableCardDemo() {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  // Adapt your data
  const cards = projects
    .filter((proj) => selectedCategory === "All" || proj.category === selectedCategory)
    .map((proj) => ({
      title: proj.title,
      tech: proj.tech,
      category: proj.category,
      src: proj.img,
      ctaText: "Github Code",
      ctaLink: proj.github,
      liveLink: proj.liveLink,
      iconLists: proj.iconLists,
      content: () => (
        <div>
          <p className="text-gray-300 leading-relaxed">{proj.des}</p>
        </div>
      ),
    }));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useClickOutside(ref, () => setActive(null));

  return (
    <>
      {/* Backdrop */}
      {active && typeof active === "object" && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-40"
          onClick={() => setActive(null)}
        />
      )}

      {/* Expanded Modal */}
      {active && typeof active === "object" && (
        <div className="fixed inset-0 grid place-items-center z-[100] p-2 sm:p-4">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full h-8 w-8 sm:h-10 sm:w-10 z-50 hover:bg-white/20 transition-colors"
            onClick={() => setActive(null)}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          <div
            ref={ref}
            className="relative w-full max-w-[600px] h-full md:h-fit md:max-h-[85%] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
              {/* Expanded Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
                <Image
                  src={active.src}
                  alt={active.title}
                  width={600}
                  height={300}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20">
                  <div className="flex gap-1 sm:gap-2">
                    {active.iconLists?.slice(0, 3).map((icon: string, idx: number) => (
                      <div
                        key={idx}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                      >
                        <Image
                          src={icon}
                          alt="tech icon"
                          width={12}
                          height={12}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-0 pb-20 sm:pb-24">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {active.title}
                      </h2>
                      {/* <span className="px-2 py-0.5 rounded-full bg-purple/20 border border-purple/30 text-[10px] sm:text-xs text-purple-300">
                        {active.category}
                      </span> */}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {active.tech}
                    </p>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto mb-6">
                  {active.content()}
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-900 to-transparent">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <a
                      href={active.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors backdrop-blur-sm"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                    {active.liveLink?.trim() && (
                      <a
                        href={active.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors backdrop-blur-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 mt-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              selectedCategory === cat
                ? "bg-purple text-white border-purple shadow-lg shadow-purple/20 scale-105"
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card List */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <div className="grid gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative bg-[#0a0a1a] rounded-3xl border border-white/10 hover:border-purple/30 transition-all duration-500 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row p-6 sm:p-8 gap-8 items-center lg:items-stretch">
                {/* Visual Section */}
                <div 
                  onClick={() => setActive(card)}
                  className="relative w-full lg:w-48 h-32 lg:h-auto rounded-2xl overflow-hidden cursor-pointer group/image flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 z-10 group-hover/image:opacity-0 transition-opacity" />
                  <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover group-hover/image:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                    <span className="text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      Expand View
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between w-full">
                  <div className="text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple transition-colors">
                        {card.title}
                      </h3>
                      <div className="flex justify-center lg:justify-start gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-xs text-purple-300 font-medium whitespace-nowrap">
                          {card.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">
                      {card.tech}
                    </p>
                    
                    {/* Tech Icons */}
                    <div className="flex justify-center lg:justify-start gap-3 mb-6">
                      {card.iconLists?.map((icon: string, idx: number) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                          title="Technology used"
                        >
                          <Image
                            src={icon}
                            alt="tech"
                            width={16}
                            height={16}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                    <button
                      onClick={() => setActive(card)}
                      className="w-full sm:w-auto px-6 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    <div className="flex w-full sm:w-auto items-center gap-3">
                      <a
                        href={card.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl border border-white/10 transition-all flex items-center justify-center"
                        title="GitHub Repo"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      
                      {card.liveLink?.trim() && (
                        <a
                          href={card.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                          Live Site
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}


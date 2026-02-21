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

  // Adapt your data
  const cards = projects.map((proj) => ({
    title: proj.title,
    tech: proj.tech,
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
        <div className="fixed inset-0 grid place-items-center z-[100] p-4">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full h-10 w-10 z-50 hover:bg-white/20 transition-colors"
            onClick={() => setActive(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div
            ref={ref}
            className="relative w-full max-w-[600px] h-full md:h-fit md:max-h-[85%] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 sm:rounded-3xl overflow-hidden shadow-2xl"
          >
              {/* Expanded Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
                <Image
                  src={active.src}
                  alt={active.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="flex gap-2">
                    {active.iconLists?.slice(0, 3).map((icon: string, idx: number) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                      >
                        <Image
                          src={icon}
                          alt="tech icon"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow min-h-0 pb-24">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-white mb-2">
                      {active.title}
                    </h3>
                    <p className="text-blue-300 font-medium text-sm">
                      {active.tech}
                    </p>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {typeof active.content === "function" ? active.content() : active.content}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
                <div className="flex gap-3">
                  <a
                    href={active.ctaLink}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    {active.ctaText}
                  </a>
                  {active.liveLink?.trim() && (
                    <a
                      href={active.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors backdrop-blur-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Card List */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => setActive(card)}
              className="group relative p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl cursor-pointer hover:border-white/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 items-center flex-1">
                  {/* Modern Avatar */}
                  <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl shadow-lg">
                    <span className="drop-shadow-sm">{card.title.charAt(0)}</span>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800" />
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {card.tech}
                    </p>
                  </div>
                </div>

                <button
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </button>
              </div>

              {/* Tech Icons Preview */}
              <div className="relative mt-4 flex gap-2">
                {card.iconLists?.slice(0, 4).map((icon: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-60"
                  >
                    <Image
                      src={icon}
                      alt="tech icon"
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                  </div>
                ))}
                {card.liveLink?.trim() && (
                  <div className="ml-auto flex items-center gap-1 text-green-400 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}


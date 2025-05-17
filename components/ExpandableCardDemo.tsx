"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useClickOutside } from "@react-hookz/web";
import { projects } from "@/data"; // Your updated projects data

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
    content: () => (
      <div>
        <p>{proj.des}</p>
        <p className="font-semibold text-sm mt-2 text-white">Technologies Used:</p>
        <p>{proj.tech}</p>
        <div className="flex gap-2 mt-4">
          {proj.iconLists.map((icon, idx) => (
            <img key={idx} src={icon} alt="tech icon" className="w-6 h-6" />
          ))}
        </div>
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
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            {/* Close Button */}
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="relative w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              {/* Expanded Image */}
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-60 object-cover object-top"
                />
              </motion.div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`tech-${active.tech}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.tech}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-2 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>

                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                >
                  {typeof active.content === "function" ? active.content() : active.content}
                </motion.div>
              </div>

              {/* Live Demo Link (Conditional) */}
              {active.liveLink?.trim() && (
                <div className="absolute bottom-4 right-4">
                  <a
                    href={active.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg transition"
                  >
                    Live Demo
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card List */}
      <ul className="max-w-2xl mx-auto w-full gap-4">
  {cards.map((card) => (
    <motion.div
      layoutId={`card-${card.title}-${id}`}
      key={`card-${card.title}-${id}`}
      onClick={() => setActive(card)}
      className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
    >
      <div className="flex gap-4 flex-col md:flex-row items-center">
        {/* Avatar Circle with First Letter */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold text-lg">
          {card.title.charAt(0)}
        </div>

        {/* Project Info */}
        <div>
          <motion.h3
            layoutId={`title-${card.title}-${id}`}
            className="font-medium text-neutral-800 dark:text-neutral-200"
          >
            {card.title}
          </motion.h3>
          <motion.p
            layoutId={`tech-${card.tech}-${id}`}
            className="text-neutral-600 dark:text-neutral-400"
          >
            {card.tech}
          </motion.p>
        </div>
      </div>

      <motion.button
        layoutId={`button-${card.title}-${id}`}
        className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
      >
        {card.ctaText}
      </motion.button>
    </motion.div>
  ))}
</ul>

    </>
  );
}

// Close icon component
export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

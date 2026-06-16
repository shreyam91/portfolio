"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiX } from "react-icons/fi";
import houses from "../app/data/imagesData";

// Predefined scattering patterns for desktop
const desktopPositions = [
  { left: "5%", top: "10%", width: "24%", depth: 0.4, rotation: -4 },
  { left: "35%", top: "5%", width: "20%", depth: 1.2, rotation: 3 },
  { left: "65%", top: "15%", width: "26%", depth: 0.7, rotation: -2 },
  { left: "15%", top: "45%", width: "22%", depth: 1.5, rotation: 6 },
  { left: "45%", top: "40%", width: "28%", depth: 0.5, rotation: -3 },
  { left: "75%", top: "55%", width: "20%", depth: 1.1, rotation: 4 },
  { left: "10%", top: "75%", width: "25%", depth: 0.8, rotation: -5 },
  { left: "55%", top: "80%", width: "22%", depth: 1.3, rotation: 2 },
  { left: "85%", top: "35%", width: "18%", depth: 0.9, rotation: 5 },
  { left: "30%", top: "85%", width: "20%", depth: 0.6, rotation: -4 },
];

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; // range based on center
    const y = (e.clientY - top - height / 2) / 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative w-full py-24 bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200/50 dark:from-gray-900/50 via-[#fafafa] dark:via-[#0a0a0a] to-[#fafafa] dark:to-[#0a0a0a] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8 md:mb-0">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block text-center md:text-left">
          07
        </span>
        <h2 className="text-3xl md:text-6xl font-light text-black dark:text-white mb-4 text-center md:text-left">
          Visual <span className="font-serif italic text-gray-400 dark:text-gray-500">Diary</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg font-light text-center md:text-left">
          Moments captured through the lens. Hover to reveal color and depth.
        </p>
      </div>

      {/* Gallery Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full max-w-screen-2xl mx-auto ${
          isMobile ? "flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 mt-12 pb-8 no-scrollbar" : "h-[800px] mt-12"
        }`}
      >
        {houses.slice(0, desktopPositions.length).map((img, i) => {
          const pos = desktopPositions[i % desktopPositions.length];

          // Create derived motion values for parallax unconditionally (Rules of Hooks)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const parallaxX = useTransform(springX, value => value * pos.depth * -10);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const parallaxY = useTransform(springY, value => value * pos.depth * -10);

          // If mobile, render a horizontal scroll snapping carousel.
          if (isMobile) {
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedImage(img)}
                className="snap-center shrink-0 w-[80vw] max-w-[320px] relative rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-200 aspect-[3/4]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnail}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          }

          // Desktop Parallax Render
          return (
            <motion.div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="absolute rounded-xl overflow-hidden cursor-pointer shadow-2xl group border-[4px] border-white/5"
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                rotate: pos.rotation,
                x: parallaxX,
                y: parallaxY,
              }}
              whileHover={{
                scale: 1.1,
                rotate: 0,
                zIndex: 50,
                transition: { duration: 0.4 },
              }}
            >
              {/* Image with grayscale that transitions to full color on hover */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnail}
                  alt={img.title}
                  className="w-full h-auto object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50 backdrop-blur-md border border-white/10"
            >
              <FiX size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center justify-center cursor-default"
            >
              <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.full}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[75vh] object-contain"
                />
              </div>
              
              <div className="mt-8 text-center max-w-2xl mx-auto px-4">
                <h3 className="text-3xl font-light text-white mb-3 tracking-wide">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-400 font-light text-lg leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

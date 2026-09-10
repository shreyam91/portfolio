"use client";

import { AnimatePresence, motion } from "framer-motion";
import Script from "next/script";
import { useState } from "react";
import { FiAward, FiExternalLink, FiX } from "react-icons/fi";

/**
 * Certifications — Professional Credentials.
 *
 * Quiet credential cards that open into a focused modal. No per-cert color
 * themes or code backgrounds — uniform #3b82f6 styling keeps it part of the
 * page. Credly badges load lazily below.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  skills: string[];
  link?: string;
}

const certifications: Certification[] = [
  {
  id: 1,
  title: "Agentic AI Foundation Associate",
  issuer: "Oracle",
  date: "September 2026",
  description:
    "Demonstrates foundational knowledge of Agentic AI concepts, intelligent agents, and how agentic systems can be applied to build more autonomous and adaptive AI solutions.",
  image: "/images/cert-agentic-ai.jpg",
  skills: ["Agentic AI", "AI Agents", "Artificial Intelligence"],
  link:
    "https://catalog-education.oracle.com/pls/certview/sharebadge?id=BDFE6700509075EF10299A3359F7E477CD9AC300BAEBF09744942153486806EF",
},
  {
    id: 2,
    title: "MongoDB Certification – Complete Developer Track",
    issuer: "GeeksforGeeks",
    date: "April 2024",
    description:
      "Covers MongoDB fundamentals to advanced database design including CRUD operations, aggregation pipeline, indexing, schema design, and performance optimization for scalable applications.",
    image: "/images/cert-mongodb.jpg",
    skills: ["MongoDB", "NoSQL", "Aggregation", "Indexing"],
  },
  {
    id: 3,
    title: "React.js – Basic to Advanced",
    issuer: "Udemy",
    date: "February 2024",
    description:
      "Comprehensive React course covering fundamentals like components, props, state, hooks, context API, routing, performance optimization, and building production-ready applications.",
    image: "/images/cert-react.jpg",
    skills: ["React", "Hooks", "Redux", "Frontend"],
  },
  {
    id: 4,
    title: "Java Programming – Basic to Advanced",
    issuer: "Udemy",
    date: "December 2023",
    description:
      "Deep dive into Java programming from core concepts to advanced topics including OOPs, collections, multithreading, exception handling, JDBC, and backend development fundamentals.",
    image: "/images/cert-java.jpg",
    skills: ["Java", "OOP", "Collections", "Multithreading"],
  },
  
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section
      id="certifications"
      className="relative w-full py-20 md:py-24 bg-white dark:bg-[#0d0d0d] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl mb-14 md:mb-20"
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-5 block">
            Credentials
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-tight">
            Continuous learning,{" "}
            <span className="font-serif italic text-[#3b82f6]">
              formally recognized
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-4">
            Official recognition of technical expertise through hands-on,
            practical learning.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: EASE }}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer flex flex-col p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-[#fafafa] dark:bg-[#111111] hover:border-[#3b82f6]/40 hover:bg-white dark:hover:bg-[#151515] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-[#3b82f6] border border-[#3b82f6]/20 bg-[#3b82f6]/5 group-hover:border-[#3b82f6]/40 transition-colors">
                <FiAward size={22} />
              </div>
              <h3 className="text-xl font-normal text-[#1a1a1a] dark:text-white mb-2 tracking-tight">
                {cert.title}
              </h3>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-4">
                {cert.issuer} • {cert.date}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-6">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20"
        >
          <h3 className="text-2xl font-light tracking-tight text-[#1a1a1a] dark:text-white mb-8 text-center">
            Digital{" "}
            <span className="font-serif italic text-[#3b82f6]">Badges</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="54b2729e-dcdc-4c26-89cc-a895ea780d0d"
              data-share-badge-host="https://www.credly.com"
            />
            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="7f480e0c-e61b-4a92-9f92-b86383b48831"
              data-share-badge-host="https://www.credly.com"
            />
          </div>
          <Script
            src="//cdn.credly.com/assets/utilities/embed.js"
            strategy="lazyOnload"
          />
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 md:p-12 bg-black/50 backdrop-blur-sm overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl my-8 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden cursor-default"
            >
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 p-3 bg-white/80 dark:bg-[#1a1a1a]/80 hover:bg-white dark:hover:bg-[#222] backdrop-blur-md rounded-full text-gray-600 dark:text-gray-300 shadow-md transition-all z-10"
                aria-label="Close credential"
              >
                <FiX size={18} />
              </button>

              <div className="p-8 md:p-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-[#3b82f6] border border-[#3b82f6]/20 bg-[#3b82f6]/5">
                  <FiAward size={26} />
                </div>

                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] dark:text-white mb-2">
                  {selectedCert.title}
                </h2>
                <div className="flex items-center gap-3 text-sm font-mono text-gray-500 dark:text-gray-400 mb-8">
                  <span>{selectedCert.issuer}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>{selectedCert.date}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-10">
                  {selectedCert.description}
                </p>

                <div className="flex items-center gap-4">
                  {selectedCert.link && (
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-[#3b82f6] text-white text-sm rounded-full hover:bg-gray-800 dark:hover:bg-[#2b6cb0] transition-colors"
                    >
                      Verify Credential <FiExternalLink />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

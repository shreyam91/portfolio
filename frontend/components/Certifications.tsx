"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { FiAward, FiExternalLink, FiX } from "react-icons/fi";

const certifications = [
  {
    id: 1,
    title: "MongoDB Certification – Complete Developer Track",
    issuer: "GeeksforGeeks",
    date: "April 2024",
    description:
      "Covers MongoDB fundamentals to advanced database design including CRUD operations, aggregation pipeline, indexing, schema design, and performance optimization for scalable applications.",
    image: "/images/cert-mongodb.jpg",
    skills: ["MongoDB", "NoSQL", "Aggregation", "Indexing"],
    theme:
      "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700/50",
    iconTheme: "text-green-600 bg-green-100 dark:bg-green-900/30",
    codeBg: `const UserSchema = new Schema({\n  email: { type: String, unique: true },\n  role: { type: String, enum: ['admin'] },\n  lastLogin: Date\n});\n\ndb.users.createIndex({ email: 1 });`,
  },
  {
    id: 2,
    title: "React.js – Basic to Advanced",
    issuer: "Udemy",
    date: "February 2024",
    description:
      "Comprehensive React course covering fundamentals like components, props, state, hooks, context API, routing, performance optimization, and building production-ready applications.",
    image: "/images/cert-react.jpg",
    skills: ["React", "Hooks", "Redux", "Frontend"],
    theme:
      "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700/50",
    iconTheme: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    codeBg: `function App() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = \`Count: \${count}\`;\n  }, [count]);\n\n  return <Button onClick={...} />;\n}`,
  },
  {
    id: 3,
    title: "Java Programming – Basic to Advanced",
    issuer: "Udemy",
    date: "December 2023",
    description:
      "Deep dive into Java programming from core concepts to advanced topics including OOPs, collections, multithreading, exception handling, JDBC, and backend development fundamentals.",
    image: "/images/cert-java.jpg",
    skills: ["Java", "OOP", "Collections", "Multithreading"],
    theme:
      "bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700/50",
    iconTheme: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    codeBg: `public class Main {\n  public static void main(String[] args) {\n    List<String> list = new ArrayList<>();\n    list.stream()\n        .filter(s -> s.startsWith("A"))\n        .forEach(System.out::println);\n  }\n}`,
  },
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  return (
    <section
      id="certifications"
      className="relative w-full py-18 bg-white dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">
            06
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] dark:text-white mb-4">
            Professional{" "}
            <span className="font-serif italic text-gray-500">Credentials</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg font-light">
            Continuous learning and official recognition of technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className={`relative group cursor-pointer flex flex-col p-8 rounded-2xl border transition-all overflow-hidden shadow-sm hover:shadow-xl ${cert.theme}`}
            >
              <div className="absolute inset-0 z-0 opacity-15 dark:opacity-25 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none overflow-hidden select-none flex items-start justify-end">
                <pre className="text-[10px] md:text-xs font-mono text-gray-400 dark:text-gray-500 font-bold leading-relaxed whitespace-pre text-right transform translate-x-2 -translate-y-2 group-hover:scale-105 transition-transform duration-500">
                  {cert.codeBg}
                </pre>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#111111] dark:via-[#111111]/90 dark:to-transparent z-0 pointer-events-none" />

              <div
                className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${cert.iconTheme}`}
              >
                <FiAward size={24} />
              </div>
              <h3 className="relative z-10 text-xl font-medium text-[#1a1a1a] dark:text-white mb-2">
                {cert.title}
              </h3>
              <p className="relative z-10 text-sm font-mono text-gray-500 dark:text-gray-400 mb-4">
                {cert.issuer} • {cert.date}
              </p>

              <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-6">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-[10px] uppercase tracking-wider rounded-full group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-light text-[#1a1a1a] dark:text-white mb-8 text-center">
            Digital{" "}
            <span className="font-serif italic text-gray-500">Badges</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="54b2729e-dcdc-4c26-89cc-a895ea780d0d"
              data-share-badge-host="https://www.credly.com"
            ></div>
            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="7f480e0c-e61b-4a92-9f92-b86383b48831"
              data-share-badge-host="https://www.credly.com"
            ></div>
          </div>
          <Script
            src="//cdn.credly.com/assets/utilities/embed.js"
            strategy="lazyOnload"
          />
        </motion.div>
      </div>

      {/* Modal View for Certification */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-white/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-colors z-10"
              >
                <FiX size={20} />
              </button>

              <div className="p-8 md:p-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-8">
                  <FiAward size={32} />
                </div>

                <h2 className="text-2xl md:text-3xl font-medium text-[#1a1a1a] mb-2">
                  {selectedCert.title}
                </h2>
                <div className="flex items-center gap-3 text-sm font-mono text-gray-500 mb-8">
                  <span>{selectedCert.issuer}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{selectedCert.date}</span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-10">
                  {selectedCert.description}
                </p>

                <div className="flex items-center gap-4">
                  {selectedCert.link && (
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Verify Credential <FiExternalLink />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
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

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiActivity, FiCode, FiLayers, FiExternalLink, FiServer } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function CodeStreakSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    dsa: 0,
    sysDesign: 0,
    machineCoding: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch live data from CodeStreak Backend
    const fetchCodeStreakData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        
        const [dsaRes, sysRes, mcRes] = await Promise.all([
          fetch(`/api/proxy/dsa?limit=1000`).then(res => res.json()).catch(() => ({ data: { data: [] } })),
          fetch(`/api/proxy/system-design?limit=1000`).then(res => res.json()).catch(() => ({ data: { data: [] } })),
          fetch(`/api/proxy/machine-coding?limit=1000`).then(res => res.json()).catch(() => ({ data: { data: [] } })),
        ]);

        const dsa = dsaRes?.data?.data || [];
        const sys = sysRes?.data?.data || [];
        const mc = mcRes?.data?.data || [];

        const allContent = [...dsa, ...sys, ...mc];

        const getLocalDateStr = (date: Date) => {
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        const activityMap: Record<string, number> = {};
        allContent.forEach((q: any) => {
          if (!q.createdAt) return;
          try {
            const date = new Date(q.createdAt);
            const dateStr = getLocalDateStr(date);
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
          } catch (e) {}
        });

        let currentStreak = 0;
        const today = new Date();
        let checkDate = new Date(today);
        const todayStr = getLocalDateStr(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = getLocalDateStr(checkDate);

        let streakStart = new Date(today);
        if (activityMap[todayStr]) {
           // Start from today
        } else if (activityMap[yesterdayStr]) {
           streakStart.setDate(streakStart.getDate() - 1);
        }

        while (true) {
          const dateStr = getLocalDateStr(streakStart);
          if (activityMap[dateStr]) {
            currentStreak++;
            streakStart.setDate(streakStart.getDate() - 1);
          } else {
            break;
          }
        }

        setStats({
          dsa: dsa.length,
          sysDesign: sys.length,
          machineCoding: mc.length,
          streak: currentStreak,
        });
      } catch (error) {
        console.error("Failed to fetch CodeStreak data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodeStreakData();
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 block">05</span>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full">
                Interactive Tracker
              </span>
              <span className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Sync
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
              CodeStreak <span className="font-serif italic text-gray-400 dark:text-gray-500">Dashboard</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
              A real-time synchronization with my personal problem-solving tracker, reflecting my daily coding consistency and progress.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/codestreak"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm hover:shadow-md group gap-2"
            >
              Enter Dashboard 
              <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            { 
              label: stats.streak === 0 ? "Just Starting" : stats.streak <= 7 ? "Newbie Streak" : stats.streak <= 30 ? "Consistent" : "Unstoppable", 
              desc: "Current active streak", 
              value: stats.streak, 
              icon: <FiActivity className="text-orange-500 dark:text-orange-400" />, 
              suffix: " Days", 
              bg: "bg-orange-50 dark:bg-orange-500/10", 
              border: "group-hover:border-orange-200 dark:group-hover:border-orange-500/30",
              codeBg: `git commit -m "streak"\n[main 8a2b4c1]\n2 files changed, 45 (+)\nnpm run build\n> build successful\ndeploy --prod`
            },
            { 
              label: "DSA Solved", 
              desc: "Data structures & algorithms", 
              value: stats.dsa, 
              icon: <FiCode className="text-blue-500 dark:text-blue-400" />, 
              bg: "bg-blue-50 dark:bg-blue-500/10", 
              border: "group-hover:border-blue-200 dark:group-hover:border-blue-500/30",
              codeBg: `function solve(n) {\n  let dp = [0, 1];\n  for(let i=2; i<=n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}`
            },
            { 
              label: "System Design", 
              desc: "Architecture problems solved", 
              value: stats.sysDesign, 
              icon: <FiServer className="text-indigo-500 dark:text-indigo-400" />, 
              bg: "bg-indigo-50 dark:bg-indigo-500/10", 
              border: "group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30",
              codeBg: `[LB] -> [API Gateway]\n          |\n   +------+------+\n   |             |\n[Cache]        [Auth]\n   |             |\n[DB-M] <====> [DB-S]`
            },
            { 
              label: "Machine Coding", 
              desc: "Low-level design & UI tasks", 
              value: stats.machineCoding, 
              icon: <FiLayers className="text-purple-500 dark:text-purple-400" />, 
              bg: "bg-purple-50 dark:bg-purple-500/10", 
              border: "group-hover:border-purple-200 dark:group-hover:border-purple-500/30",
              codeBg: `const UI = () => {\n  const [s, setS] = useState();\n  return (\n    <div className="app">\n      <Header />\n      <List />\n    </div>\n  );\n}`
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`relative bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-lg transition-all group overflow-hidden ${stat.border}`}
            >
              <div 
                className="absolute inset-0 z-0 opacity-15 dark:opacity-25 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none overflow-hidden select-none flex items-start justify-end"
              >
                <pre className="text-[10px] md:text-[11px] font-mono text-gray-400 dark:text-gray-500 font-bold leading-relaxed whitespace-pre text-right transform translate-x-2 -translate-y-2 group-hover:scale-105 transition-transform duration-500">
                  {stat.codeBg}
                </pre>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#111111] dark:via-[#111111]/80 dark:to-transparent z-0 pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div className="h-8 w-8 rounded-full border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiExternalLink className="text-gray-600 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                {loading ? (
                  <div className="w-16 h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mb-2" />
                ) : (
                  <div className="text-5xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight flex items-baseline gap-1">
                    {stat.value}
                    {stat.suffix && <span className="text-base text-gray-500 font-medium">{stat.suffix}</span>}
                  </div>
                )}
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

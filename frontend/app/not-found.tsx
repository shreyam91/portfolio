"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Flame, Code2, Terminal, RefreshCw, Home, ArrowLeft, Zap } from "lucide-react";

const codeLines = [
  { text: "const page = await fetch('/this-page');", delay: 0 },
  { text: "// 🤔 Hmm, that's odd...", delay: 0.4 },
  { text: "if (page.status === 404) {", delay: 0.8 },
  { text: '  throw new Error("Page not found");', delay: 1.2, highlight: true },
  { text: "}", delay: 1.6 },
  { text: "// Your streak is still intact 🔥", delay: 2.0, muted: true },
];

const tips = [
  "Double-check the URL for typos",
  "This page may have been moved or deleted",
  "Try navigating from the dashboard",
  "Your streak is safe, don't worry!",
];

export default function NotFound() {
  const router = useRouter();
  const [typed, setTyped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);

  // Animate streak counter
  useEffect(() => {
    const target = 404;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      setStreak((prev) => {
        if (prev + step >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Cycle tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Typing effect for code lines
  useEffect(() => {
    if (typed < codeLines.length) {
      const timer = setTimeout(
        () => setTyped((prev) => prev + 1),
        codeLines[typed].delay * 1000
      );
      return () => clearTimeout(timer);
    }
  }, [typed]);

  const handleGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 m-auto h-[400px] w-[400px] rounded-full bg-primary/15 opacity-40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-12 cursor-pointer w-fit"
          onClick={() => router.push("/")}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Flame size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">CodeStreak</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Big 404 + message */}
          <div>
            {/* Glitchy 404 */}
            <motion.div
              className="relative select-none cursor-pointer mb-4"
              onClick={handleGlitch}
              title="Click me"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h1
                className="text-[9rem] md:text-[11rem] font-extrabold leading-none tracking-tighter text-foreground/10"
                animate={
                  glitching
                    ? {
                        x: [0, -4, 4, -2, 2, 0],
                        skewX: [0, -3, 3, -1, 1, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                {streak}
              </motion.h1>

              {/* Overlay colored text */}
              <motion.div
                className="absolute inset-0 flex items-center"
                animate={glitching ? { x: [0, 3, -3, 1, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[9rem] md:text-[11rem] font-extrabold leading-none tracking-tighter bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent opacity-80">
                  404
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                This page broke its streak
              </h2>
              <p className="text-muted-foreground text-lg mb-2">
                Looks like this page didn't show up for practice today.
              </p>

              {/* Cycling tip */}
              <div className="flex items-center gap-2 h-8 mb-8">
                <Zap size={14} className="text-primary shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-muted-foreground"
                  >
                    {tips[tipIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Home size={16} />
                  Go Home
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.back()}
                  className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border bg-background text-foreground font-medium text-sm transition-all hover:bg-muted"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, rotate: 180 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border bg-background text-foreground font-medium text-sm transition-all hover:bg-muted"
                >
                  <RefreshCw size={16} />
                  Dashboard
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right: Terminal / Code block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            {/* Terminal top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
              <div className="flex items-center gap-1.5 ml-3">
                <Terminal size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">
                  codestreak ~ debug
                </span>
              </div>
            </div>

            {/* Code lines */}
            <div className="p-5 font-mono text-sm space-y-1.5 min-h-[220px]">
              {codeLines.slice(0, typed).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${
                    line.highlight
                      ? "text-red-400 bg-red-500/10 rounded px-2 -mx-2"
                      : line.muted
                      ? "text-muted-foreground/60"
                      : "text-foreground/80"
                  }`}
                >
                  <span className="text-muted-foreground/40 mr-3 select-none text-xs">
                    {i + 1}
                  </span>
                  {line.text}
                  {i === typed - 1 && typed < codeLines.length && (
                    <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                  )}
                </motion.div>
              ))}

              {typed >= codeLines.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 pt-4 border-t border-border flex items-center gap-2"
                >
                  <Code2 size={14} className="text-primary" />
                  <span className="text-primary text-xs font-medium">
                    Keep your streak going — head back and keep coding!
                  </span>
                </motion.div>
              )}
            </div>

            {/* Streak badge */}
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm font-medium">Your streak is safe</span>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                Still active 🔥
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-xs text-muted-foreground/50 mt-12"
        >
          Tip: Click the{" "}
          <span className="text-primary font-medium cursor-pointer" onClick={handleGlitch}>
            404
          </span>{" "}
          for a surprise
        </motion.p>
      </div>
    </div>
  );
}

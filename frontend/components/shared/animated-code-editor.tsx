"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, Copy, Check, FastForward } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

interface AnimatedCodeEditorProps {
  code: string;
  language?: string;
  onComplete?: () => void;
}

// Custom theme based on vscDarkPlus to make it look more premium
const customTheme = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: "1.5rem",
    textShadow: "none",
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    color: "#e4e4e7", // zinc-200
    textShadow: "none",
  },
};

type Block = {
  startLine: number; // 1-indexed
  endLine: number; // 1-indexed
  isComment: boolean;
};

export function AnimatedCodeEditor({
  code,
  language = "java",
  onComplete,
}: AnimatedCodeEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const endOfCodeRef = useRef<HTMLDivElement>(null);

  // Pre-calculate lines and blocks for intelligent pausing and highlighting
  const { lines, blocks } = useMemo(() => {
    const lines = code.split("\n");
    const blocks: Block[] = [];

    let inBlock = false;
    let blockStart = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isComment = line.trim().startsWith("//");

      if (isComment) {
        if (
          inBlock &&
          !blocks.find((b) => b.startLine === blockStart)?.isComment
        ) {
          blocks.push({ startLine: blockStart, endLine: i, isComment: false });
        }
        blockStart = i + 1;
        inBlock = true;
      } else if (line.trim() === "") {
        if (inBlock) {
          blocks.push({
            startLine: blockStart,
            endLine: i,
            isComment:
              blocks.some((b) => b.startLine === blockStart) ||
              lines[blockStart - 1]?.trim().startsWith("//"),
          });
          inBlock = false;
        }
      } else {
        if (!inBlock) {
          blockStart = i + 1;
          inBlock = true;
        }
      }
    }

    if (inBlock) {
      blocks.push({
        startLine: blockStart,
        endLine: lines.length,
        isComment: lines[blockStart - 1]?.trim().startsWith("//"),
      });
    }

    return { lines, blocks };
  }, [code]);

  // Determine current line (1-indexed) based on typed characters
  const currentTypedCode = code.slice(0, currentIndex);
  const currentLineIndex = currentTypedCode.split("\n").length;

  // Append a blinking cursor character if playing and not finished
  const displayCode =
    isPlaying && currentIndex < code.length
      ? currentTypedCode + "▌"
      : currentTypedCode;

  // Find the active block
  const activeBlock = blocks.find(
    (b) => currentLineIndex >= b.startLine && currentLineIndex <= b.endLine,
  );

  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex < code.length) {
        const nextChar = code[currentIndex];
        const isNewline = nextChar === "\n";
        const currentLineStr = lines[currentLineIndex - 1] || "";

        // Base delay
        let delay = 30 / speed;

        // Add random variation to feel like human typing
        delay += Math.random() * (20 / speed);

        // Pause briefly after completing a comment line
        if (isNewline && currentLineStr.trim().startsWith("//")) {
          delay = 800 / speed; // Longer pause to let the user read the explanation
        }
        // Small pause at the end of statements
        else if (nextChar === ";" || nextChar === "{" || nextChar === "}") {
          delay = 200 / speed;
        }
        // Micro pause on spaces
        else if (nextChar === " ") {
          delay = 50 / speed;
        }

        timeoutId = setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, delay);
      } else {
        setIsPlaying(false);
        if (onComplete) onComplete();
      }
    };

    typeNextChar();

    return () => clearTimeout(timeoutId);
  }, [
    currentIndex,
    isPlaying,
    speed,
    code,
    lines,
    currentLineIndex,
    onComplete,
  ]);

  // Auto-scroll
  useEffect(() => {
    if (isPlaying && endOfCodeRef.current && containerRef.current) {
      endOfCodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentTypedCode, isPlaying]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setTimeout(() => {
      setHasStarted(true);
      setIsPlaying(true);
    }, 100);
  };

  const handlePlayPause = () => {
    if (!hasStarted && currentIndex === 0) {
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const speeds = [1, 2, 4];
  const cycleSpeed = () => {
    const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950/80 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl ring-1 ring-white/5 font-sans">
      <div className="flex flex-1 min-h-0">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Tabs & Controls */}
          <div className="flex bg-zinc-900/30 h-10 border-b border-zinc-800/50 items-center pr-2 overflow-x-auto hide-scrollbar shrink-0">
            <div className="flex items-center gap-2 px-4 bg-zinc-900/50 h-full border-t-[3px] border-t-emerald-500 min-w-[140px] text-zinc-200">
              <svg
                className="w-4 h-4 text-[#e8c679]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm">
                Solution.
                {language === "java"
                  ? "java"
                  : language === "cpp"
                    ? "cpp"
                    : "py"}
              </span>
              <svg
                className="w-3.5 h-3.5 ml-auto text-zinc-500 hover:text-white cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <div className="flex-1 flex items-center justify-end px-2 gap-1">
              <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/50">
                <button
                  onClick={handleReplay}
                  className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
                  title="Replay"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={14} className="fill-zinc-400" />
                  ) : (
                    <Play size={14} className="fill-zinc-400" />
                  )}
                </button>
                <div className="w-px h-3 bg-[#444] mx-1" />
                <button
                  onClick={cycleSpeed}
                  className="px-1.5 py-0.5 flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
                  title="Typing Speed"
                >
                  <FastForward size={12} /> {speed}x
                </button>
                <div className="w-px h-3 bg-[#444] mx-1" />
                <button
                  onClick={handleCopy}
                  className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
                  title="Copy Code"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Editor Body */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto relative font-mono text-sm leading-relaxed"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3f3f46 transparent",
            }}
          >
            {!hasStarted && currentIndex === 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px]">
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-zinc-950 font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                >
                  <Play size={20} className="fill-zinc-950" />
                  Watch Solution
                </motion.button>
              </div>
            )}

            <SyntaxHighlighter
              language={language}
              style={customTheme}
              showLineNumbers={true}
              wrapLines={true}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                background: "transparent",
                minHeight: "100%",
              }}
              lineNumberStyle={{
                minWidth: "2.5em",
                paddingRight: "1em",
                color: "#52525b",
                textAlign: "right",
              }}
              lineProps={(lineNumber) => {
                const isHighlight =
                  activeBlock &&
                  lineNumber >= activeBlock.startLine &&
                  lineNumber <= activeBlock.endLine &&
                  (isPlaying || hasStarted);
                const isCommentLine = lines[lineNumber - 1]
                  ?.trim()
                  .startsWith("//");

                return {
                  style: {
                    display: "block",
                    background: isHighlight
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                    borderLeft: isHighlight
                      ? isCommentLine
                        ? "2px solid #10b981"
                        : "2px solid #3b82f6"
                      : "2px solid transparent",
                    transition: "all 0.3s ease",
                    opacity: isHighlight ? 1 : hasStarted ? 0.6 : 1,
                  },
                };
              }}
            >
              {displayCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* VS Code Status Bar (Customized for glassmorphism) */}
      <div className="h-6 w-full bg-zinc-900/80 border-t border-zinc-800/50 text-zinc-400 text-[11px] font-medium flex items-center px-3 justify-between shrink-0 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            main
          </div>
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            <RotateCcw size={12} />0
          </div>
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            <Check size={12} />0
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            Ln {currentLineIndex}, Col {currentIndex % 50}
          </div>
          <div className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            Spaces: 4
          </div>
          <div className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            UTF-8
          </div>
          <div className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors">
            LF
          </div>
          <div className="hover:bg-white/20 px-1 py-0.5 rounded cursor-pointer transition-colors uppercase">
            {language}
          </div>
        </div>
      </div>
    </div>
  );
}

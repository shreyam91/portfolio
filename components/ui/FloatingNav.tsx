"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const router = useRouter();

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        // also set true for the initial state
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit md:min-w-[20vw] lg:min-w-fit fixed z-[5000] top-10 right-4 md:right-10 lg:right-auto lg:inset-x-0 lg:mx-auto md:px-10 md:py-5 rounded-lg border items-center justify-end md:justify-center space-x-2 sm:space-x-4",
          "bg-background/80 backdrop-blur-sm border-border shadow-lg",
          className
        )}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link-${idx}`}
              href={navItem.link}
              scroll={false}
              onClick={(e) => {
                if (navItem.link.startsWith("#")) {
                  e.preventDefault();
                  const targetId = navItem.link.replace("#", "");
                  const targetElement = document.getElementById(targetId);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", navItem.link);
                  } else {
                    router.push("/" + navItem.link);
                  }
                }
              }}
              className={cn(
                "relative items-center flex space-x-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
              )}
            >
              <span className="text-sm !cursor-pointer">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center justify-end w-full">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 left-auto mt-2 mr-2 md:hidden bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg z-50 min-w-[200px]"
            >
              <div className="py-2">
                {navItems.map((navItem: any, idx: number) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={navItem.link}
                    scroll={false}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (navItem.link.startsWith("#")) {
                        e.preventDefault();
                        const targetId = navItem.link.replace("#", "");
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: "smooth" });
                          window.history.pushState(null, "", navItem.link);
                        } else {
                          router.push("/" + navItem.link);
                        }
                      }
                    }}
                    className={cn(
                      "flex items-center space-x-3 px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    )}
                  >
                    {navItem.icon && (
                      <span className="w-5 h-5 flex items-center justify-center">
                        {navItem.icon}
                      </span>
                    )}
                    <span className="text-sm">{navItem.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
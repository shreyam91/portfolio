"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/blog" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Blog
          </Link>
          <Link
            href="/photos"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/photos" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Photos
          </Link>
        </div>
      </div>
    </nav>
  );
} 
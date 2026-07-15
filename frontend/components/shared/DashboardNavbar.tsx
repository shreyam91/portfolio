"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Code2 } from "lucide-react";
import Image from "next/image";

export function DashboardNavbar() {
  const pathname = usePathname();

  const links = [
    { label: "DSA", href: "/codestreak/dsa" },
    { label: "System Design", href: "/codestreak/system-design" },
    { label: "Machine Coding", href: "/codestreak/machine-coding" },
    { label: "Blogs", href: "/codestreak/blogs" },
    { label: "Resources", href: "/codestreak/resources" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b dark:border-white/10 border-black/10 dark:bg-[#0a0a0a]/80 bg-white/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-8">
        <Link href="/codestreak" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          {/* You can use next/image with public/logo.png here, using an icon as fallback */}
          <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:flex flex-col text-foreground leading-none">
            <span className="font-extrabold tracking-tight text-lg">Codestreak</span>
            <span className="text-[12px] text-muted-foreground font-[cursive] italic self-end -mt-1 pr-1">by Shreyam</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive 
                    ? "bg-black/5 dark:bg-white/10 text-foreground" 
                    : "text-muted-foreground hover:bg-black/5 hover:dark:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}

"use client";

import { Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function PublicNavbar() {
  const router = useRouter();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between border-b border-border/40 bg-background/70 px-6 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo.png" alt="CodeStreak Logo" width={32} height={32} className="object-contain" />
        <h1 className="text-xl font-bold tracking-tight">CodeStreak</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <Link href="/machine-coding" className="hover:text-foreground transition-colors">Machine Coding</Link>
        <Link href="/dsa" className="hover:text-foreground transition-colors">DSA</Link>
        <Link href="/system-design" className="hover:text-foreground transition-colors">System Design</Link>
        <Link href="/blog" className="hover:text-foreground transition-colors">Blogs</Link>
        {/* <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link> */}
      </div>

      {/* <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/login')}
          className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/login')}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          Get Started
        </button>
      </div> */}
    </nav>
  );
}

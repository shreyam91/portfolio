import { Flame } from "lucide-react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 pt-16 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={24} className="text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">CodeStreak</h2>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">
              The unified platform for mastering Machine Coding, DSA, and System Design through daily consistency.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/machine-coding" className="hover:text-primary transition-colors">Machine Coding</Link></li>
              <li><Link href="/dsa" className="hover:text-primary transition-colors">Data Structures</Link></li>
              <li><Link href="/system-design" className="hover:text-primary transition-colors">System Design</Link></li>
              {/* <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeStreak. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

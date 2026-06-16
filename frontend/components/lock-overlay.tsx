import { Lock } from "lucide-react";
import Link from "next/link";

export function LockOverlay() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-card via-card/90 to-transparent flex flex-col items-center justify-end pb-10">
      <div className="bg-background border border-border p-6 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm mx-4">
        <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
          <Lock size={24} />
        </div>
        <h3 className="font-bold text-lg mb-2">Unlock all 100+ Problems</h3>
        {/* <p className="text-sm text-muted-foreground mb-6">Create a free account to access the complete curriculum, track your progress, and maintain your streak.</p> */}
        <Link href="/dashboard" className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Start streak
        </Link>
      </div>
    </div>
  );
}

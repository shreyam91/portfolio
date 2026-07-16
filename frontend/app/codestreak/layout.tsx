import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CodeStreak",
    default: "CodeStreak by Shreyam",
  },
  description: "Your all-in-one interview preparation platform.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

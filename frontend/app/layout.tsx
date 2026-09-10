import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shreyam.online"),
  title: {
    default: "Shreyam Kanaujiya — AI Engineer & Full-Stack Developer",
    template: "%s · Shreyam Kanaujiya",
  },
  description:
    "I'm Shreyam Kanaujiya — an AI engineer and full-stack developer who turns ideas into AI-powered digital products people keep coming back to: product thinking, design, and end-to-end execution.",
  keywords: [
    "Shreyam Kanaujiya",
    "AI Engineer",
    "Full Stack Developer",
    "LLM",
    "OpenAI API",
    "Prompt Engineering",
    "AI-assisted development",
    "Product Engineer",
    "React",
    "Next.js",
    "Node.js",
    "Software Engineer India",
  ],
  authors: [{ name: "Shreyam Kanaujiya" }],
  creator: "Shreyam Kanaujiya",
  openGraph: {
    title: "Shreyam Kanaujiya — AI Engineer & Full-Stack Developer",
    description:
      "An AI engineer and full-stack builder turning ideas into AI-powered digital products people keep coming back to. Explore the thinking, the builds, and the journey.",
    type: "website",
    locale: "en_US",
    siteName: "Shreyam Kanaujiya",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shreyam Kanaujiya",
  url: "https://shreyam.online",
  jobTitle: "AI Engineer & Full-Stack Developer",
  description:
    "I turn ideas into AI-powered digital products people keep coming back to.",
  sameAs: [
    "https://github.com/shreyam91",
    "https://www.linkedin.com/in/shreyam-kanaujiya/",
    "https://leetcode.com/u/Shrey91leet/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, self-authored JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

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

export const metadata = {
  title: "Shreyam Kanaujiya | Full Stack Developer",
  description:
    "Portfolio of Shreyam Kanaujiya - Full Stack Developer specializing in React, Next.js, Node.js, and scalable systems.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Portfolio",
    "Node.js Developer",
    "Software Engineer India",
  ],
  authors: [{ name: "Shreyam Kanaujiya" }],
  creator: "Shreyam Kanaujiya",
  openGraph: {
    title: "Shreyam Kanaujiya Portfolio",
    description:
      "Full Stack Developer building scalable web apps and AI-powered systems.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

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

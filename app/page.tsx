"use client";

import { navItems } from "@/data";
export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GridSmallBackgroundDemo } from "@/components/ui/GridSmallBackgroundDemo";

const Home = () => {
  return (
    <main className="relative bg-background min-h-screen w-full overflow-x-hidden">
      <GridSmallBackgroundDemo />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen relative z-10">
        <ThemeToggle />
        <FloatingNav navItems={navItems} />
        <div className="flex-grow">
          <Hero />
          <Grid />
          <Projects />
          {/* <Clients /> */}
          <Experience />
          <Approach />
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Home;
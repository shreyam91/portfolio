"use client";

import * as React from "react";
import {
  Home,
  LayoutDashboard,
  Code2,
  Network,
  Layers,
  Briefcase,
  FileText,
  PlaySquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Portfolio", url: "/", icon: Home },
  { name: "Dashboard", url: "/codestreak", icon: LayoutDashboard },
  { name: "Machine Coding", url: "/codestreak/machine-coding", icon: Code2 },
  { name: "DSA", url: "/codestreak/dsa", icon: Network },
  { name: "System Design", url: "/codestreak/system-design", icon: Layers },
  {
    name: "Placement Preparation",
    url: "/codestreak/placement-prep",
    icon: Briefcase,
  },
  { name: "Blogs", url: "/codestreak/blogs", icon: FileText },
  { name: "Videos", url: "/codestreak/videos", icon: PlaySquare },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="dark:bg-[#0a0a0a]/60 dark:backdrop-blur-xl bg-white/60 backdrop-blur-xl border-r dark:border-white/10 border-black/10"
      {...props}
    >
      <SidebarHeader className="border-b dark:border-white/10 border-black/10 h-16 flex items-center justify-center flex-row gap-2">
        <Image
          src="/logo.png"
          alt="CodeStreak Logo"
          width={32}
          height={32}
          className="rounded-md object-contain shrink-0"
        />
        <span className="font-extrabold text-lg tracking-tight hidden group-data-[state=expanded]:block bg-gradient-to-r dark:from-white dark:to-white/60 from-black to-black/60 bg-clip-text text-transparent">
          CodeStreak
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    isActive={
                      item.url === "/codestreak"
                        ? pathname === "/codestreak"
                        : pathname === item.url ||
                          pathname?.startsWith(item.url + "/")
                    }
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 dark:hover:bg-white/10 hover:bg-black/5 dark:data-[active=true]:bg-white/10 data-[active=true]:bg-black/5 dark:data-[active=true]:text-white data-[active=true]:text-black text-muted-foreground hover:text-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

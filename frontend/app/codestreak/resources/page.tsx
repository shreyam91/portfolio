import React from "react";
import { ResourceList } from "@/components/shared/resource-list";

export const metadata = {
  title: "Resource Library | Codestreak",
  description: "Browse interview notes, cheat sheets, PDFs, roadmaps, and technical documentation.",
};

export default function ResourcesPage() {
  return <ResourceList />;
}

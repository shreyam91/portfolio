import React from "react";
import { ResourceDetail } from "@/components/shared/resource-detail";

export function generateMetadata({ params }: { params: { id: string } }) {
  // Normally we would fetch the actual title, but for mock routing we just format the slug
  const title = params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Resource Library`,
  };
}

export default function ResourcePreviewPage({ params }: { params: { id: string } }) {
  return <ResourceDetail slug={params.id} />;
}

import React from "react";
import { ResourceDetail } from "@/components/shared/resource-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  // Normally we would fetch the actual title, but for mock routing we just format the slug
  const title = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | Resource Library`,
  };
}

export default async function ResourcePreviewPage({ params }: Props) {
  const { id } = await params;
  return <ResourceDetail slug={id} />;
}

"use client";

import { useParams } from "next/navigation";
import { ResourceDetail } from "@/components/shared/resource-detail";

export default function ResourcePreviewPage() {
  const { id } = useParams<{ id: string }>();
  return <ResourceDetail slug={id} />;
}

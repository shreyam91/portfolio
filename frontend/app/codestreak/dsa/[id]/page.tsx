"use client";

import { useParams } from "next/navigation";
import { DSAProblemDetail } from "@/components/shared/dsa-problem-detail";

export default function DSADetailDashboardPage() {
  const { id } = useParams<{ id: string }>();
  return <DSAProblemDetail slug={id} />;
}

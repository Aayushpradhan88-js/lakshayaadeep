"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FastLoading } from "@/components/shared-component/fast-loading";

export default function GalleryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/media");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="text-center">
      <FastLoading size="md" />
      </div>
    </div>
  );
}

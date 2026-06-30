"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GalleryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/media");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        <p className="mt-2 text-black">Redirecting to Media...</p>
      </div>
    </div>
  );
}

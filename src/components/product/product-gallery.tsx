"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : ["/logo.svg"];

  return (
    <div className="space-y-3">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-2xl border">
        <Image
          key={safeImages[active]}
          src={safeImages[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          priority
          className="object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {safeImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20",
                i === active ? "border-primary" : "border-transparent hover:border-border",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

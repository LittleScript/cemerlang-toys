"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; alt?: string | null };

export function ProductGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ct-cream">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt ?? alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                active === index ? "border-ct-teal" : "border-transparent"
              )}
            >
              <Image src={image.url} alt={image.alt ?? alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

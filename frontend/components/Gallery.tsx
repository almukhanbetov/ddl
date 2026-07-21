'use client';

import { useState } from 'react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/api';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="gallery-col">
      <div className="gallery-main">
        <Image src={resolveImageUrl(images[active])} alt={alt} fill sizes="(max-width: 1180px) 100vw, 55vw" priority />
      </div>
      <div className="gallery-thumbs">
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            className={idx === active ? 'is-active' : ''}
            onClick={() => setActive(idx)}
          >
            <Image src={resolveImageUrl(src)} alt={`${alt} — ракурс ${idx + 1}`} fill sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}

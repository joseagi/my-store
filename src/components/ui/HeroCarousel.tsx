'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroCarouselProps {
  images: string[]
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (paused || images.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused, images.length])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Subtle dark veil */}
      <div className="absolute inset-0 z-20 bg-black/25" />

      {/* SHOP button */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <Link
          href="#products"
          className="bg-white text-black font-heading uppercase tracking-[0.25em] text-sm px-12 py-4 hover:bg-white/90 transition-colors"
        >
          Shop
        </Link>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white scale-125' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lookbook',
  description: 'A glimpse into what we are working on — new arrivals, editorial shots, and upcoming drops.',
}

export default async function LookbookPage() {
  const images = await prisma.lookbookImage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs text-muted-foreground uppercase tracking-widest font-heading hover:text-foreground transition-colors"
        >
          ← Back to store
        </Link>
        <h1 className="font-heading text-3xl uppercase tracking-widest mt-4 mb-2">
          Lookbook
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          A glimpse into what we&apos;re working on — new arrivals, editorial shots, and upcoming drops.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="font-heading uppercase tracking-widest text-sm text-muted-foreground">
            Coming soon
          </p>
          <p className="text-xs text-muted-foreground">
            Check back soon for our first lookbook drop.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map(img => (
            <div key={img.id} className="break-inside-avoid overflow-hidden group">
              <div className="relative w-full overflow-hidden bg-muted">
                <Image
                  src={img.url}
                  alt={img.caption ?? ''}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-heading uppercase tracking-wide">
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

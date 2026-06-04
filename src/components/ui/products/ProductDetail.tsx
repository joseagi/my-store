'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  stock: number
  category?: string | null
  sizes?: string[]
}

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const isOutOfStock = product.stock === 0
  const hasSizes = (product.sizes ?? []).length > 0
  const canAdd = !isOutOfStock && (!hasSizes || selectedSize !== null)

  function prevImage() {
    setActiveImage(i => (i === 0 ? product.images.length - 1 : i - 1))
  }
  function nextImage() {
    setActiveImage(i => (i === product.images.length - 1 ? 0 : i + 1))
  }

  function handleAdd() {
    if (!canAdd) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
      size: selectedSize ?? undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const descriptionLines = product.description.split('\n').filter(Boolean)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors font-heading uppercase tracking-widest"
      >
        ← Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-muted overflow-hidden">
            <Image
              src={product.images[activeImage] ?? '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? 'border-foreground'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-heading">
              {product.category}
            </span>
          )}

          <h1 className="font-heading text-2xl md:text-3xl leading-tight uppercase">
            {product.name}
          </h1>

          <p className="font-heading text-xl">
            {formatPrice(product.price)}
          </p>

          {/* Size selector */}
          {hasSizes && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-heading">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes ?? []).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                    className={`px-4 py-2 border text-sm font-heading uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    [{size}]
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart button */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-3 border border-border text-muted-foreground font-heading uppercase tracking-widest text-sm cursor-not-allowed"
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`w-full py-3 font-heading uppercase tracking-widest text-sm transition-colors ${
                canAdd
                  ? added
                    ? 'bg-green-700 text-white'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                  : 'border border-border text-muted-foreground cursor-not-allowed'
              }`}
            >
              {added
                ? '✓ Added to cart'
                : hasSizes && !selectedSize
                ? 'Select size'
                : 'Add to cart'}
            </button>
          )}

          {/* Description */}
          <ul className="space-y-1.5 mt-1">
            {descriptionLines.map((line, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span>·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {/* Size guide + shipping */}
          <div className="space-y-1.5 pt-3 border-t border-border">
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="block text-sm underline underline-offset-4 hover:text-primary transition-colors font-heading uppercase tracking-widest"
            >
              · Size guide
            </button>
            <Link
              href="/shipping"
              className="block text-sm underline underline-offset-4 hover:text-primary transition-colors font-heading uppercase tracking-widest"
            >
              · Shipping policy
            </Link>
          </div>
        </div>
      </div>

      {/* Size guide modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            className="bg-background border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Measurement diagram */}
            <div className="flex justify-center mb-6 mt-2">
              <svg width="160" height="210" viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 15 L120 15 L128 100 L105 195 L85 195 L80 100 L80 100 L75 195 L55 195 L32 100 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                {/* Waist A */}
                <line x1="40" y1="6" x2="120" y2="6" stroke="#ef4444" strokeWidth="1.5"/>
                <line x1="40" y1="2" x2="40" y2="10" stroke="#ef4444" strokeWidth="1.5"/>
                <line x1="120" y1="2" x2="120" y2="10" stroke="#ef4444" strokeWidth="1.5"/>
                <text x="80" y="5" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold" dominantBaseline="auto">A</text>
                {/* Inseam B */}
                <line x1="74" y1="100" x2="74" y2="195" stroke="#ef4444" strokeWidth="1.5"/>
                <line x1="70" y1="100" x2="78" y2="100" stroke="#ef4444" strokeWidth="1.5"/>
                <line x1="70" y1="195" x2="78" y2="195" stroke="#ef4444" strokeWidth="1.5"/>
                <text x="88" y="152" fill="#ef4444" fontSize="11" fontWeight="bold" dominantBaseline="middle">B</text>
              </svg>
            </div>

            <p className="text-center text-xs uppercase tracking-widest font-heading mb-4">Size Guide</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse font-heading">
                <thead>
                  <tr>
                    <th className="border border-border p-2 text-left uppercase text-muted-foreground">Size (inches)</th>
                    {['W28','W30','W32','W34','W36','W38','W40'].map(s => (
                      <th key={s} className="border border-border p-2 uppercase text-center">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">[A] Waist Along Top Edge — Flat</td>
                    {[28,30,32,34,36,38,40].map(v => (
                      <td key={v} className="border border-border p-2 text-center">{v}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">[B] Inseam</td>
                    {[30,32,32,32,32,32,32].map((v, i) => (
                      <td key={i} className="border border-border p-2 text-center">{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

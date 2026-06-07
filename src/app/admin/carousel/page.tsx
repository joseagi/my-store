'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Loader2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

interface CarouselImage {
  id: string
  url: string
  createdAt: string
}

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/carousel')
    const data = await res.json() as { images: CarouselImage[] }
    setImages(data.images ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/admin/carousel')
      .then(r => r.json())
      .then((data: { images: CarouselImage[] }) => {
        setImages(data.images ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleAdd() {
    const url = newUrl.trim()
    if (!url) return
    setAdding(true)
    const res = await fetch('/api/admin/carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) {
      toast({ title: 'Image added to carousel' })
      setNewUrl('')
      void load()
    } else {
      toast({ title: 'Failed to add image', variant: 'destructive' })
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch('/api/admin/carousel', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast({ title: 'Image removed from carousel' })
    setImages(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading uppercase tracking-widest text-xl mb-1">Carousel Images</h1>
        <p className="text-sm text-muted-foreground">
          Paste the public URL of any image — from Supabase Storage or elsewhere — to add it to the homepage carousel.
          Images display in the order they were added.
        </p>
      </div>

      {/* Add new URL */}
      <div className="border rounded-xl p-5 mb-8 space-y-3">
        <Label htmlFor="url-input">Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="url-input"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/Carousel%20Pictures/..."
            onKeyDown={e => { if (e.key === 'Enter') void handleAdd() }}
          />
          <Button onClick={() => void handleAdd()} disabled={adding || !newUrl.trim()} className="gap-2 shrink-0">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          In Supabase: Storage → Carousel Pictures → click an image → copy the URL shown at the top.
        </p>
      </div>

      {/* Current images */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground border rounded-xl">
          No carousel images yet. Paste a URL above to add the first one.
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-3 border rounded-xl p-3 bg-background">
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
              <div className="relative h-14 w-20 shrink-0 rounded overflow-hidden bg-muted">
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <p className="text-xs text-muted-foreground flex-1 truncate">{img.url}</p>
              <button
                onClick={() => void handleDelete(img.id)}
                disabled={deleting === img.id}
                className="shrink-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove"
              >
                {deleting === img.id
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

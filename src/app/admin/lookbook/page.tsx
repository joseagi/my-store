'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface LookbookImage {
  id: string
  url: string
  caption: string | null
  createdAt: string
}

export default function AdminLookbookPage() {
  const [images, setImages] = useState<LookbookImage[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lookbook')
      .then(r => r.json())
      .then((data: { images: LookbookImage[] }) => {
        setImages(data.images ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function load() {
    const res = await fetch('/api/lookbook')
    const data = await res.json() as { images: LookbookImage[] }
    setImages(data.images ?? [])
  }

  async function handleAdd() {
    const url = newUrl.trim()
    if (!url) return
    setAdding(true)
    const res = await fetch('/api/lookbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, caption: newCaption.trim() || null }),
    })
    if (res.ok) {
      toast({ title: 'Image added to lookbook' })
      setNewUrl('')
      setNewCaption('')
      void load()
    } else {
      toast({ title: 'Failed to add image', variant: 'destructive' })
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch('/api/lookbook', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast({ title: 'Image removed from lookbook' })
    setImages(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading uppercase tracking-widest text-xl mb-1">Lookbook</h1>
        <p className="text-sm text-muted-foreground">
          Paste a public image URL to add it to the lookbook.{' '}
          <Link href="/lookbook" target="_blank" className="underline underline-offset-4 hover:text-foreground">
            View lookbook page →
          </Link>
        </p>
      </div>

      {/* Add new */}
      <div className="border rounded-xl p-5 mb-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="lb-url">Image URL</Label>
          <Input
            id="lb-url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/lookbook/..."
            onKeyDown={e => { if (e.key === 'Enter') void handleAdd() }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lb-caption">
            Caption{' '}
            <span className="text-muted-foreground font-normal text-xs">(optional — shown on hover)</span>
          </Label>
          <Input
            id="lb-caption"
            value={newCaption}
            onChange={e => setNewCaption(e.target.value)}
            placeholder="SS26 Drop · Coming soon"
            onKeyDown={e => { if (e.key === 'Enter') void handleAdd() }}
          />
        </div>
        <Button onClick={() => void handleAdd()} disabled={adding || !newUrl.trim()} className="gap-2">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add to lookbook
        </Button>
      </div>

      {/* Current images */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground border rounded-xl">
          No lookbook images yet. Paste a URL above to add the first one.
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-3 border rounded-xl p-3 bg-background">
              <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
              <div className="relative h-14 w-20 shrink-0 rounded overflow-hidden bg-muted">
                <Image src={img.url} alt={img.caption ?? ''} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{img.url}</p>
                {img.caption && (
                  <p className="text-xs text-foreground mt-0.5 truncate">{img.caption}</p>
                )}
              </div>
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

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Only image files allowed', variant: 'destructive' })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Each image must be under 5MB', variant: 'destructive' })
        return
      }
    }

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of files) {
        // Create unique filename
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        newUrls.push(publicUrl)
      }

      onImagesChange([...images, ...newUrls])
      toast({ title: `${newUrls.length} image(s) uploaded` })

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      toast({ title: 'Upload failed', description: message, variant: 'destructive' })
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  function removeImage(url: string) {
    onImagesChange(images.filter(img => img !== url))
  }

  return (
    <div className="space-y-3">
      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map(url => (
            <div
              key={url}
              className="relative w-24 h-24 rounded-lg overflow-hidden border group"
            >
              <Image
                src={url}
                alt="Product"
                fill
                sizes="96px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        uploading
          ? 'opacity-50 pointer-events-none'
          : 'hover:bg-muted/40 hover:border-primary'
      }`}>
        {uploading ? (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">
            {uploading ? 'Uploading...' : 'Click to upload images'}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WebP — max 5MB each — multiple files allowed
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}
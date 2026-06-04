'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { generateSlug } from '@/lib/utils'

const productFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string; images?: string[]; sizes?: string[] }
  mode: 'create' | 'edit'
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(
    initialData?.images ?? []
  )
  const [sizes, setSizes] = useState<string[]>(
    initialData?.sizes ?? []
  )
  const [sizeInput, setSizeInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData,
  })

  const nameValue = useWatch({ control, name: 'name' }) ?? ''

  // Auto-generate slug from name on create
  function handleNameBlur() {
    if (mode === 'create' && nameValue) {
      setValue('slug', generateSlug(nameValue))
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Image must be under 5MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      setImages(prev => [...prev, publicUrl])
      toast({ title: 'Image uploaded successfully' })

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      toast({
        title: 'Upload failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(img => img !== url))
  }

  async function onSubmit(data: ProductFormData) {
    if (images.length === 0) {
      toast({
        title: 'Please add at least one image',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const url = mode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${initialData?.id}`

      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images, sizes }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      toast({
        title: mode === 'create'
          ? 'Product created successfully'
          : 'Product updated successfully',
      })
      router.push('/admin/products')
      router.refresh()

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed'
      toast({
        title: 'Save failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="space-y-6 max-w-2xl">

      {/* Image upload */}
      <div className="space-y-3">
        <Label>Product images</Label>

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

        <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          uploading
            ? 'opacity-50 pointer-events-none'
            : 'hover:bg-muted/40 hover:border-primary'
        }`}>
          {uploading
            ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            : <Upload className="h-5 w-5 text-muted-foreground" />
          }
          <div>
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP — max 5MB
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          placeholder="Classic White Tee"
          {...register('name')}
          onBlur={handleNameBlur}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">
          URL slug
          <span className="text-muted-foreground font-normal ml-1 text-xs">
            (auto-generated from name)
          </span>
        </Label>
        <Input
          id="slug"
          placeholder="classic-white-tee"
          {...register('slug')}
          className={errors.slug ? 'border-destructive' : ''}
        />
        {errors.slug && (
          <p className="text-xs text-destructive">
            {errors.slug.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the product..."
          {...register('description')}
          className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none ${
            errors.description ? 'border-destructive' : ''
          }`}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (£)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="29.99"
            {...register('price', { valueAsNumber: true })}
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && (
            <p className="text-xs text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stock quantity</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="100"
            {...register('stock', { valueAsNumber: true })}
            className={errors.stock ? 'border-destructive' : ''}
          />
          {errors.stock && (
            <p className="text-xs text-destructive">
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>

{/* Sizes */}
<div className="space-y-1.5">
  <Label>Sizes</Label>

  {/* Tag-style display of added sizes */}
  <div className="flex flex-wrap gap-2 mb-2">
    {sizes.map(size => (
      <span
        key={size}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
      >
        {size}
        <button
          type="button"
          onClick={() => setSizes(prev => prev.filter(s => s !== size))}
          className="hover:text-destructive transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}
  </div>

  {/* Input to add a new size */}
  <div className="flex gap-2">
    <Input
      value={sizeInput}
      onChange={e => setSizeInput(e.target.value.toUpperCase())}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault()
          const trimmed = sizeInput.trim()
          if (trimmed && !sizes.includes(trimmed)) {
            setSizes(prev => [...prev, trimmed])
          }
          setSizeInput('')
        }
      }}
      placeholder="Type a size and press Enter (e.g. S, M, L, XL)"
    />
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        const trimmed = sizeInput.trim()
        if (trimmed && !sizes.includes(trimmed)) {
          setSizes(prev => [...prev, trimmed])
        }
        setSizeInput('')
      }}
    >
      Add
    </Button>
  </div>
  <p className="text-xs text-muted-foreground">
    Press Enter or click Add. Duplicates are ignored.
  </p>
</div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">
          Category
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        </Label>
        <Input
          id="category"
          placeholder="Clothing, Accessories, Home..."
          {...register('category')}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || uploading}
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create product'
            : 'Save changes'
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

export function CategoryTabs({
  categories,
}: {
  categories: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const active = searchParams.get('category') ?? 'All'

  function handleSelect(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className={cn(
      'flex gap-2 flex-wrap mb-6 transition-opacity',
      isPending && 'opacity-60 pointer-events-none'
    )}>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={cn(
            'px-4 py-1.5 rounded-full border text-sm transition-colors',
            active === cat
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
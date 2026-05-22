'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-5">
      <div className="flex justify-center">
        <div className="bg-destructive/10 rounded-full p-5">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
      </div>
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        An unexpected error occurred. Your cart has been saved.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Go home
        </Button>
      </div>
    </div>
  )
}
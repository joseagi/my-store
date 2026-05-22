'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-400 space-y-4 text-center">
      <div className="bg-destructive/10 rounded-full p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold">Admin error</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        {error.message ?? 'Something went wrong loading this page.'}
      </p>
      <Button onClick={reset} size="sm">Try again</Button>
    </div>
  )
}
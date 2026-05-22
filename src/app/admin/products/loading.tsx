import { Skeleton } from '@/components/ui/skeleton'

export default function AdminProductsLoading() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-xl overflow-hidden bg-background">
        <div className="border-b bg-muted/40 px-4 py-3 flex gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20 hidden md:block" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
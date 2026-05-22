import { Skeleton } from '@/components/ui/skeleton'

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="border rounded-xl overflow-hidden bg-background">
        <div className="border-b bg-muted/40 px-4 py-3 flex gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b flex gap-6 items-center">
            <Skeleton className="h-4 w-24" />
            <div className="hidden md:block space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-4 w-24 hidden md:block ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
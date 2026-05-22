import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-9 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
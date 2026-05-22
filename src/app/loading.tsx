import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-11 w-32" />
          </div>
          <Skeleton className="flex-1 aspect-square rounded-2xl max-w-sm" />
        </div>
      </div>

      {/* Trust bar skeleton */}
      <div className="border-b py-3">
        <div className="container mx-auto px-4 flex justify-center gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-32" />
          ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
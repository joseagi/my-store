import { Skeleton } from '@/components/ui/skeleton'

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
import { Skeleton } from '@/components/ui/skeleton'

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="bg-background border-b h-16" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
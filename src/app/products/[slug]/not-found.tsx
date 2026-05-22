import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PackageX } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-5">
      <div className="flex justify-center">
        <div className="bg-muted rounded-full p-6">
          <PackageX className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="text-muted-foreground">
        This product may have been removed or the link is incorrect.
      </p>
      <Link href="/">
        <Button>Browse all products</Button>
      </Link>
    </div>
  )
}
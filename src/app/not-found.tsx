import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-4">
      <p className="text-8xl font-bold text-muted-foreground/20">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or was moved.
      </p>
      <Link href="/">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

// Suspense boundary required because LoginForm uses useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md px-4">
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
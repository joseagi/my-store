'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Store, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

// Read error from URL
  const error = searchParams.get('error')
  const errorMessages: Record<string, string> = {
    OAuthCallback: 'Authentication failed. Please try again.',
    OAuthCreateAccount: 'Could not create account. Database may be unavailable.',
    Callback: 'Sign in callback failed. Check server logs.',
    AccessDenied: 'Access denied. You may need to be added as a test user in Google Console.',
    OAuthSignin: 'Could not start sign in flow.',
    Default: 'An unknown error occurred.',
  }

  const errorMessage = error
    ? (errorMessages[error] ?? errorMessages.Default)
    : null

  // Already signed in? Redirect to homepage
  useEffect(() => {
    if (session) router.push('/')
  }, [session, router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Store className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Sign in to My Store</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to track orders and checkout faster
          </p>
        </div>

         {/* Show error if present */}
        {errorMessage && (
          <div className="flex items-start gap-3 bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Sign in failed</p>
              <p className="text-xs mt-0.5 opacity-80">{errorMessage}</p>
              <p className="text-xs mt-0.5 opacity-60">Error code: {error}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            {/* Google SVG icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By signing in you agree to our{' '}
          <a href="/terms" className="underline hover:text-primary">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
        </p>
      </Card>
    </div>
  )
}
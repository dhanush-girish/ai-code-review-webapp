import { SignIn, SignedIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { Code2 } from 'lucide-react'

export default function LoginPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeReview AI</span>
            </div>
            <h1 className="text-2xl font-bold">Sign in to continue</h1>
            <p className="text-muted-foreground mt-2">Use your Google account to get started</p>
          </div>

          {/* Clerk Sign In component */}
          <div className="flex justify-center">
            <SignIn
              routing="hash"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-card border border-border shadow-xl',
                  headerTitle: 'text-foreground',
                  headerSubtitle: 'text-muted-foreground',
                  socialButtonsBlockButton: 'bg-secondary border-border text-foreground hover:bg-secondary/80',
                  formFieldInput: 'bg-secondary border-border text-foreground',
                  footerActionLink: 'text-primary hover:text-primary/80',
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

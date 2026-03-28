import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Code2, Zap, Bug, FileText, ArrowRight, GitBranch, Star } from 'lucide-react'

const features = [
  {
    icon: Bug,
    title: 'Bug Detection',
    description: 'AI finds potential bugs with severity ratings (low/medium/high)',
  },
  {
    icon: Zap,
    title: 'Code Improvements',
    description: 'Get before/after code examples with actionable suggestions',
  },
  {
    icon: Star,
    title: 'Quality Score',
    description: 'Receive a 1-10 code quality score with detailed breakdown',
  },
  {
    icon: FileText,
    title: 'Auto Documentation',
    description: 'AI generates documentation explaining what each function does',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 max-w-6xl">
          {/* Navbar */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeReview AI</span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  Get Started
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  Dashboard
                </Link>
              </SignedIn>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="py-24 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Code Reviews
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Paste your code or link a GitHub repo — get instant bug reports,
              improvement suggestions, quality scores, and auto-generated documentation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                  Start Reviewing <ArrowRight className="w-5 h-5" />
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/review"
                  className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                  New Review <ArrowRight className="w-5 h-5" />
                </Link>
              </SignedIn>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-base font-semibold transition-all duration-200"
              >
                <GitBranch className="w-5 h-5" /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for <span className="gradient-text">code quality</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Like having a senior developer review your code 24/7.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2026 CodeReview AI. Built for learning purposes.</p>
        </div>
      </footer>
    </div>
  )
}

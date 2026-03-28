import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Plus, History, Code2, TrendingUp, Bug, FileText, Loader2, ArrowRight } from 'lucide-react'
import { useReviews } from '../hooks/useReviews'

export default function DashboardPage() {
  const { user } = useUser()
  const { reviews, isLoading } = useReviews()

  // Calculate stats dynamically
  const totalReviews = reviews.length
  const totalBugs = reviews.reduce((sum, r) => sum + parseInt(r.bug_count || 0), 0)
  const avgScore = totalReviews ? (reviews.reduce((sum, r) => sum + parseFloat(r.quality_score || 0), 0) / totalReviews).toFixed(1) : '—'
  const docsGenerated = totalReviews // Assume 1 per review

  const stats = [
    { label: 'Total Reviews', value: isLoading ? '...' : totalReviews, icon: Code2, color: 'text-primary' },
    { label: 'Bugs Found', value: isLoading ? '...' : totalBugs, icon: Bug, color: 'text-destructive' },
    { label: 'Avg Score', value: isLoading ? '...' : avgScore, icon: TrendingUp, color: 'text-success' },
    { label: 'Docs Generated', value: isLoading ? '...' : docsGenerated, icon: FileText, color: 'text-info' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.firstName || 'Developer'}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your code reviews</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          to="/review"
          className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Start New Review</h3>
            <p className="text-sm text-muted-foreground">Paste code or enter a GitHub repo URL</p>
          </div>
        </Link>
        <Link
          to="/history"
          className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="p-3 rounded-lg bg-info/10 group-hover:bg-info/20 transition-colors">
            <History className="w-6 h-6 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">View History</h3>
            <p className="text-sm text-muted-foreground">Browse your past code reviews</p>
          </div>
        </Link>
      </div>

      {/* Recent Reviews */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
          {reviews.length > 0 && (
            <Link to="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            Loading your reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
            <Code2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet. Start your first code review!</p>
            <Link
              to="/review"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> New Review
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 3).map((review) => (
              <Link
                key={review.id}
                to={`/review/${review.id}`}
                className="group p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold truncate max-w-[150px]">{review.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-1">{review.language}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 flex items-center justify-center font-bold text-sm text-primary group-hover:scale-110 transition-transform">
                    {review.quality_score}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                    {review.source_type}
                  </span>
                  {parseInt(review.bug_count || 0) > 0 && (
                    <span className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive">
                      {review.bug_count} bugs
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

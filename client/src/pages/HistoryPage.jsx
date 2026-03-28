import { Link } from 'react-router-dom'
import { History, Code2, Clock, Star, Search, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useReviews } from '../hooks/useReviews'

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { reviews, isLoading } = useReviews()

  const filteredReviews = reviews.filter(
    (r) => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.language.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Review</span> History
          </h1>
          <p className="text-muted-foreground mt-1">Browse and search your past code reviews</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reviews by title or language..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 rounded-xl bg-card border border-border/50 text-center">
          <History className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Your past code reviews will appear here. Start a new review to get going!
          </p>
          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <Code2 className="w-4 h-4" /> Start New Review
          </Link>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-16 rounded-xl bg-card border border-border/50 text-center">
          <Search className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            We couldn't find any reviews matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <Link
              key={review.id}
              to={`/review/${review.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 group"
            >
              <div>
                <h3 className="font-semibold text-lg max-w-xl truncate group-hover:text-primary transition-colors">
                  {review.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1.5 capitalize"><Code2 className="w-4 h-4" /> {review.language}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(review.created_at).toLocaleDateString()}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-secondary">{review.source_type}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {parseInt(review.bug_count || 0) > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded bg-destructive/10 text-destructive font-medium whitespace-nowrap">
                    {review.bug_count} bugs
                  </span>
                )}
                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Star className="w-4 h-4 text-warning" />
                  <span className="font-medium">{review.quality_score}/10</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

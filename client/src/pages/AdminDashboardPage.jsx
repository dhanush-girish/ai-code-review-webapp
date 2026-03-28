import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Users, Code2, TrendingUp, AlertTriangle, Loader2, ArrowRight } from 'lucide-react'
import api from '../lib/api'

export default function AdminDashboardPage() {
  const { isLoaded } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoaded) return;

    const fetchAdminData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [statsRes, usersRes, reviewsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/reviews'),
        ])

        setStats(statsRes.data)
        setUsers(usersRes.data)
        setReviews(reviewsRes.data)
      } catch (err) {
        console.error('Admin data fetch error:', err)
        const message = err.response?.data?.error || err.message || 'Failed to load admin data'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminData()
  }, [isLoaded])

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-primary' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? '—', icon: Code2, color: 'text-info' },
    { label: 'Avg Quality Score', value: stats?.avgQualityScore ?? '—', icon: TrendingUp, color: 'text-success' },
    { label: 'Total Bugs Found', value: stats?.totalBugs ?? '—', icon: AlertTriangle, color: 'text-warning' },
  ]

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Admin</span> Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage users, view all reviews, and track analytics</p>
        </div>
        <div className="p-12 rounded-xl bg-card border border-destructive/30 text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Make sure your account has admin privileges.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">Admin</span> Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage users, view all reviews, and track analytics</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{isLoading ? '...' : stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Reviews</th>
                <th className="px-6 py-3 font-medium">Avg Score</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No user data available yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email || user.clerk_id}
                          </p>
                          {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.review_count || 0}</td>
                    <td className="px-6 py-4 text-sm">{user.avg_score || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews (All Users) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Reviews (All Users)</h2>
        {isLoading ? (
          <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
            <Code2 className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No reviews across the platform yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 9).map((review) => (
              <Link
                key={review.id}
                to={`/review/${review.id}`}
                className="group p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{review.title || 'Code Review'}</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-1">{review.language}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-4 border-primary/20 flex items-center justify-center font-bold text-sm text-primary group-hover:scale-110 transition-transform ml-3 flex-shrink-0">
                    {review.quality_score}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-secondary">{review.source_type}</span>
                  <span>by {review.first_name || review.email || 'Unknown'}</span>
                  <span className="ml-auto">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

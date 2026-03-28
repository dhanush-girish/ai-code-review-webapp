import { Users, Code2, TrendingUp, AlertTriangle } from 'lucide-react'

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '—', icon: Users, color: 'text-primary' },
    { label: 'Total Reviews', value: '—', icon: Code2, color: 'text-info' },
    { label: 'Avg Quality Score', value: '—', icon: TrendingUp, color: 'text-success' },
    { label: 'Total Bugs Found', value: '—', icon: AlertTriangle, color: 'text-warning' },
  ]

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
        {stats.map((stat, i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Reviews</th>
                <th className="px-6 py-3 font-medium">Avg Score</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  No user data available yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Reviews Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Reviews (All Users)</h2>
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <Code2 className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No reviews across the platform yet.</p>
        </div>
      </div>
    </div>
  )
}

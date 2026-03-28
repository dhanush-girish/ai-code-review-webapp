import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Bug, Lightbulb, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useReview } from '../hooks/useReviews'
import { ScoreRing } from '../components/review/ScoreRing'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function ReviewResultPage() {
  const { id } = useParams()
  const { review, isLoading, error } = useReview(id)

  const [expandedSections, setExpandedSections] = useState({
    bugs: true,
    improvements: true,
    docs: true,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading AI analysis results...</p>
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full mb-4">
          <Bug className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Failed to load review</h2>
        <p className="text-muted-foreground mb-6">{error || 'Review not found'}</p>
        <Link to="/dashboard" className="text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  const bugs = review.issues?.filter((i) => i.severity === 'high' || i.type === 'bug') || []
  const improvements = review.issues?.filter((i) => i.severity !== 'high' && i.type !== 'bug') || []

  const getSeverityBadge = (severity) => {
    const colors = {
      high: 'bg-destructive/10 text-destructive',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-info/10 text-info',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[severity] || colors.low}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  const handleExport = () => {
    let md = `# Code Review #${id}\n`
    md += `*Generated: ${new Date(review.created_at).toLocaleString()}*\n\n`
    md += `## Quality Score: ${review.quality_score}/10\n\n`
    md += `### Summary\n${review.summary}\n\n`
    
    if (bugs.length > 0) {
      md += `## Critical Bugs & Issues\n`
      bugs.forEach(bug => {
        md += `### [${bug.severity.toUpperCase()}] ${bug.title}\n`
        md += `${bug.description}\n\n`
        if (bug.original_code) {
          md += `**Issue found at line ${bug.line_number || 'unknown'}:**\n\`\`\`${review.language}\n${bug.original_code}\n\`\`\`\n\n`
        }
        if (bug.suggested_code) {
          md += `**Suggested fix:**\n\`\`\`${review.language}\n${bug.suggested_code}\n\`\`\`\n\n`
        }
      })
    }

    if (improvements.length > 0) {
      md += `## Improvement Suggestions\n`
      improvements.forEach(imp => {
        md += `### [${imp.severity.toUpperCase()}] ${imp.title}\n`
        md += `${imp.description}\n\n`
        if (imp.original_code) {
          md += `**Original code:**\n\`\`\`${review.language}\n${imp.original_code}\n\`\`\`\n\n`
        }
        if (imp.suggested_code) {
          md += `**Improvement:**\n\`\`\`${review.language}\n${imp.suggested_code}\n\`\`\`\n\n`
        }
      })
    }

    if (review.documentation) {
      md += `## Auto-Generated Documentation\n${review.documentation}\n`
    }

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-review-${id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Formatting for Markdown blocks
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" className="rounded-md my-2 text-sm" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
          {children}
        </code>
      )
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Review #{id}</h1>
            <p className="text-sm text-muted-foreground">{review.language} • {new Date(review.created_at).toLocaleString()}</p>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Export Markdown
        </button>
      </div>

      {/* Score Ring Section */}
      <div className="flex items-center gap-8 p-6 rounded-xl bg-card border border-border/50">
        <ScoreRing score={review.quality_score} size={110} strokeWidth={8} />
        <div>
          <h2 className="text-xl font-semibold mb-2">Code Quality Assessment</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            {review.summary}
          </p>
        </div>
      </div>

      {/* Bug Report Section */}
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <button
          onClick={() => toggleSection('bugs')}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bug className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-semibold">Critical Bugs & Issues</h2>
            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-medium rounded-full">
              {bugs.length} issues
            </span>
          </div>
          {expandedSections.bugs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {expandedSections.bugs && (
          <div className="px-5 pb-5 border-t border-border/50 pt-5 space-y-4">
            {bugs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No critical bugs detected. Great job!</p>
            ) : (
              bugs.map((bug, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{bug.title}</h3>
                    {getSeverityBadge(bug.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{bug.description}</p>
                  
                  {bug.original_code && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Issue found at line {bug.line_number || 'unknown'}:</p>
                      <SyntaxHighlighter style={vscDarkPlus} language={review.language} className="rounded-md text-sm">
                        {bug.original_code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {bug.suggested_code && (
                    <div className="mt-4">
                      <p className="text-xs text-success mb-1">Suggested fix:</p>
                      <SyntaxHighlighter style={vscDarkPlus} language={review.language} className="rounded-md text-sm border border-success/20">
                        {bug.suggested_code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Improvements Section */}
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <button
          onClick={() => toggleSection('improvements')}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Improvement Suggestions</h2>
            <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded-full">
              {improvements.length} suggestions
            </span>
          </div>
          {expandedSections.improvements ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {expandedSections.improvements && (
          <div className="px-5 pb-5 border-t border-border/50 pt-5 space-y-4">
            {improvements.length === 0 ? (
              <p className="text-muted-foreground text-sm">No suggestions provided.</p>
            ) : (
              improvements.map((imp, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{imp.title}</h3>
                    {getSeverityBadge(imp.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{imp.description}</p>
                  
                  {imp.original_code && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Original code:</p>
                      <SyntaxHighlighter style={vscDarkPlus} language={review.language} className="rounded-md text-sm opacity-80">
                        {imp.original_code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {imp.suggested_code && (
                    <div className="mt-4">
                      <p className="text-xs text-success mb-1">Improvement:</p>
                      <SyntaxHighlighter style={vscDarkPlus} language={review.language} className="rounded-md text-sm border border-success/20">
                        {imp.suggested_code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Documentation Section */}
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <button
          onClick={() => toggleSection('docs')}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-info" />
            <h2 className="text-lg font-semibold">Auto-Generated Documentation</h2>
          </div>
          {expandedSections.docs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {expandedSections.docs && (
          <div className="px-6 pb-6 border-t border-border/50 pt-6 prose prose-invert max-w-none">
            {review.documentation ? (
              <ReactMarkdown components={MarkdownComponents}>
                {review.documentation}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground text-sm">No documentation was generated.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

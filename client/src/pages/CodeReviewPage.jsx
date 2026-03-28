import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, GitBranch, Upload, Loader2, ChevronDown } from 'lucide-react'
import api from '../lib/api'

const LANGUAGES = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp', 'go', 'rust', 'ruby', 'php']

export default function CodeReviewPage() {
  const navigate = useNavigate()
  const [inputMode, setInputMode] = useState('paste') // 'paste' | 'github'
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [title, setTitle] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        title: title.trim(),
        sourceType: inputMode,
        language: inputMode === 'paste' ? language : undefined,
        code: inputMode === 'paste' ? code : undefined,
        githubUrl: inputMode === 'github' ? githubUrl : undefined
      }

      const { data } = await api.post('/reviews', payload)
      navigate(`/review/${data.id}`)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'An error occurred during AI analysis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">New</span> Code Review
        </h1>
        <p className="text-muted-foreground mt-1">Paste your code or enter a GitHub repository URL</p>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary rounded-lg w-fit">
        <button
          onClick={() => setInputMode('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            inputMode === 'paste'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code2 className="w-4 h-4" /> Paste Code
        </button>
        <button
          onClick={() => setInputMode('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            inputMode === 'github'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <GitBranch className="w-4 h-4" /> GitHub URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name your review */}
        <div>
          <label className="block text-sm font-medium mb-2">Review Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Authentication Module Fixes"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
        </div>

        {inputMode === 'paste' ? (
          <>
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <div className="relative w-48">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={16}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {code.length} characters · {code.split('\n').length} lines
              </p>
            </div>
          </>
        ) : (
          /* GitHub URL Input */
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Repository URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Only public repositories are supported. The AI will fetch and analyze the repo contents.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (inputMode === 'paste' ? !code.trim() : !githubUrl.trim())}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Submit for Review
            </>
          )}
        </button>
      </form>
    </div>
  )
}

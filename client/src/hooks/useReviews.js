import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../lib/api'

/**
 * Hook to fetch and manage the user's reviews
 */
export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getToken } = useAuth()

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      window.__clerk_token = await getToken()
      const { data } = await api.get('/reviews')
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reviews')
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, isLoading, error, refresh: fetchReviews }
}

/**
 * Hook to fetch a single review by ID
 */
export function useReview(id) {
  const [review, setReview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getToken } = useAuth()

  useEffect(() => {
    if (!id) return

    const fetchReview = async () => {
      try {
        setIsLoading(true)
        setError(null)
        window.__clerk_token = await getToken()
        const { data } = await api.get(`/reviews/${id}`)
        setReview(data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch review')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [id, getToken])

  return { review, isLoading, error }
}

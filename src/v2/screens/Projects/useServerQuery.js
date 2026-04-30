import { useCallback, useEffect, useRef, useState } from 'react'

const queryCache = new Map()
const pendingQueries = new Map()

function getCacheKey(queryKey) {
  return JSON.stringify(queryKey)
}

export function prefetchServerQuery(queryKey, queryFn) {
  const cacheKey = getCacheKey(queryKey)

  if (queryCache.has(cacheKey)) {
    return Promise.resolve(queryCache.get(cacheKey))
  }

  if (pendingQueries.has(cacheKey)) {
    return pendingQueries.get(cacheKey)
  }

  const pendingQuery = queryFn()
    .then((data) => {
      queryCache.set(cacheKey, data)
      pendingQueries.delete(cacheKey)
      return data
    })
    .catch((error) => {
      pendingQueries.delete(cacheKey)
      throw error
    })

  pendingQueries.set(cacheKey, pendingQuery)
  return pendingQuery
}

export function setServerQueryData(queryKey, updater) {
  const cacheKey = getCacheKey(queryKey)
  const currentData = queryCache.get(cacheKey)
  const nextData = typeof updater === 'function' ? updater(currentData) : updater
  queryCache.set(cacheKey, nextData)
  return nextData
}

export function useServerQuery({ queryKey, queryFn, enabled = true, initialData = null }) {
  const cacheKey = getCacheKey(queryKey)
  const mountedRef = useRef(false)
  const [state, setState] = useState(() => {
    if (queryCache.has(cacheKey)) {
      return { data: queryCache.get(cacheKey), status: 'success', error: null }
    }

    if (initialData !== null) {
      queryCache.set(cacheKey, initialData)
      return { data: initialData, status: 'success', error: null }
    }

    return { data: null, status: enabled ? 'loading' : 'idle', error: null }
  })

  const refetch = useCallback(() => {
    setState((current) => ({ ...current, status: current.data ? 'success' : 'loading', error: null }))

    return prefetchServerQuery(queryKey, queryFn)
      .then((data) => {
        if (mountedRef.current) {
          setState({ data, status: 'success', error: null })
        }
        return data
      })
      .catch((error) => {
        if (mountedRef.current) {
          setState({ data: null, status: 'error', error })
        }
        return null
      })
  }, [queryFn, queryKey])

  const updateData = useCallback((updater) => {
    const nextData = setServerQueryData(queryKey, updater)
    setState({ data: nextData, status: 'success', error: null })
    return nextData
  }, [queryKey])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (queryCache.has(cacheKey)) {
      setState({ data: queryCache.get(cacheKey), status: 'success', error: null })
      return
    }

    refetch()
  }, [cacheKey, enabled, refetch])

  return {
    ...state,
    isFetching: state.status === 'loading',
    refetch,
    updateData,
  }
}

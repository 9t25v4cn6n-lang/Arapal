import { useEffect, useState } from 'react'
import App from './App'
import AppV2 from './v2/AppV2'
import { defaultRouteId } from './v2/app/routeRegistry'

function readV2RouteFromHash() {
  if (typeof window === 'undefined') {
    return null
  }

  const hashValue = window.location.hash.replace(/^#/, '')
  if (!hashValue.startsWith('v2')) {
    return null
  }

  const [, routeId] = hashValue.split('/')
  return routeId || defaultRouteId
}

export default function RootApp() {
  const [v2RouteId, setV2RouteId] = useState(readV2RouteFromHash)

  useEffect(() => {
    const handleLocationChange = () => {
      setV2RouteId(readV2RouteFromHash())
    }

    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)
    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  if (v2RouteId) {
    return <AppV2 routeId={v2RouteId} />
  }

  return <App />
}

import { useEffect, useState } from 'react'
import FigmaScreen from './screens/FigmaScreen'
import SegmentsScreen from './screens/SegmentsScreen'

export default function App() {
  const getScreenFromHash = () => {
    const hash = window.location.hash.replace('#', '')
    return hash === 'segments' ? 'segments' : 'study'
  }

  const [screen, setScreen] = useState(getScreenFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      setScreen(getScreenFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setActiveScreen = (nextScreen) => {
    window.location.hash = nextScreen === 'segments' ? 'segments' : 'study'
    setScreen(nextScreen)
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'inline-flex',
          gap: 8,
          padding: 6,
          border: '1px solid rgba(203, 213, 225, 0.9)',
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveScreen('study')}
          style={{
            border: 'none',
            borderRadius: 999,
            minHeight: 34,
            padding: '0 14px',
            background: screen === 'study' ? '#0f172a' : 'transparent',
            color: screen === 'study' ? '#ffffff' : '#475569',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Study
        </button>
        <button
          type="button"
          onClick={() => setActiveScreen('segments')}
          style={{
            border: 'none',
            borderRadius: 999,
            minHeight: 34,
            padding: '0 14px',
            background: screen === 'segments' ? '#0f172a' : 'transparent',
            color: screen === 'segments' ? '#ffffff' : '#475569',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Segments
        </button>
      </div>

      {screen === 'segments' ? <SegmentsScreen /> : <FigmaScreen />}
    </>
  )
}

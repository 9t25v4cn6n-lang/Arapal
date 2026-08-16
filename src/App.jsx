import { useEffect, useState } from 'react'
import LayoutDebugOverlay from './components/debug/LayoutDebugOverlay'
import { getLayoutDebugAttrs } from './components/debug/layoutDebug'
import ExamsScreen from './screens/ExamsScreen'
import FigmaScreen from './screens/FigmaScreen'
import MakeSegmentationFlowScreen from './screens/MakeSegmentationFlowScreen'
import ProjectHomeScreen from './screens/ProjectHomeScreen'

const previewStyles = `
  .app-preview {
    min-height: 100vh;
    padding: 18px;
    background: #eef4fa;
    color: #0f172a;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .app-preview__stage {
    position: relative;
    min-height: calc(100vh - 36px);
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(203, 213, 225, 0.9);
    background: linear-gradient(180deg, rgba(248, 251, 255, 0.98) 0%, rgba(238, 244, 250, 0.98) 100%);
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  }

  .app-preview__viewport {
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(219, 228, 239, 0.92);
    background: #ffffff;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
    transform-origin: center center;
  }

  .app-preview__viewport iframe {
    display: block;
    border: 0;
    background: #ffffff;
  }

  .app-preview__dock {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 10001;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    cursor: grab;
    user-select: none;
  }

  .app-preview__dock.is-dragging {
    cursor: grabbing;
  }

  .app-preview__toggle {
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid rgba(203, 213, 225, 0.96);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    color: #334155;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.14);
  }

  .app-preview__dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #2563eb;
    opacity: 0.9;
  }

  .app-preview__panel {
    min-width: 184px;
    padding: 10px;
    border: 1px solid rgba(203, 213, 225, 0.96);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
  }

  .app-preview__panelMeta {
    margin: 0 0 8px;
    font-size: 11px;
    line-height: 1.5;
    font-weight: 600;
    color: #64748b;
  }

  .app-preview__options {
    display: grid;
    gap: 6px;
  }

  .app-preview__option {
    min-height: 34px;
    padding: 0 12px;
    border: 1px solid rgba(219, 228, 239, 0.92);
    border-radius: 12px;
    background: #ffffff;
    color: #475569;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    line-height: 1;
    font-weight: 600;
    cursor: pointer;
  }

  .app-preview__option.is-active {
    border-color: #93c5fd;
    color: #1d4ed8;
    background: rgba(239, 246, 255, 0.94);
  }

  .app-preview__option span:last-child {
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
  }
`

function ViewportPreview({ screen }) {
  const previews = [
    { id: 'tight', label: 'Tight desktop', width: 1366, height: 768 },
    { id: 'standard', label: 'Standard desktop', width: 1440, height: 900 },
    { id: 'wide', label: 'Wide desktop', width: 1920, height: 1080 },
  ]
  const [activePreviewId, setActivePreviewId] = useState('standard')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [dockPosition, setDockPosition] = useState({ right: 20, bottom: 20 })
  const dragStateRef = useRef(null)
  const activePreview = previews.find((preview) => preview.id === activePreviewId) ?? previews[1]
  const baseUrl = `${window.location.origin}${window.location.pathname}?chrome=0&intro=0#${screen}`
  const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 72 : activePreview.width
  const availableHeight = typeof window !== 'undefined' ? window.innerHeight - 72 : activePreview.height
  const scale = Math.min(availableWidth / activePreview.width, availableHeight / activePreview.height, 1)
  const frameWidth = Math.round(activePreview.width * scale)
  const frameHeight = Math.round(activePreview.height * scale)

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragStateRef.current) return

      const nextRight = Math.max(12, dragStateRef.current.windowWidth - event.clientX - dragStateRef.current.offsetX)
      const nextBottom = Math.max(12, dragStateRef.current.windowHeight - event.clientY - dragStateRef.current.offsetY)
      setDockPosition({ right: nextRight, bottom: nextBottom })
    }

    const handlePointerUp = () => {
      dragStateRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const handleDockPointerDown = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    dragStateRef.current = {
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  }

  return (
    <>
      <style>{previewStyles}</style>
      <div className="app-preview">
        <div className="app-preview__stage">
          <div
            className="app-preview__viewport"
            style={{
              width: `${frameWidth}px`,
              height: `${frameHeight}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <iframe
              title={`${screen}-${activePreview.id}`}
              src={baseUrl}
              style={{
                width: `${activePreview.width}px`,
                height: `${activePreview.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          </div>
        </div>

        <div
          className={`app-preview__dock${dragStateRef.current ? ' is-dragging' : ''}`}
          style={{ right: `${dockPosition.right}px`, bottom: `${dockPosition.bottom}px` }}
          onPointerDown={handleDockPointerDown}
        >
          {isPanelOpen ? (
            <div className="app-preview__panel" onPointerDown={(event) => event.stopPropagation()}>
              <p className="app-preview__panelMeta">Viewport preview</p>
              <div className="app-preview__options">
                {previews.map((preview) => (
                  <button
                    key={preview.id}
                    type="button"
                    className={`app-preview__option${preview.id === activePreview.id ? ' is-active' : ''}`}
                    onClick={() => setActivePreviewId(preview.id)}
                  >
                    <span>{preview.label}</span>
                    <span>
                      {preview.width}×{preview.height}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <button type="button" className="app-preview__toggle" onClick={() => setIsPanelOpen((current) => !current)}>
            <span className="app-preview__dot" />
            {activePreview.width}×{activePreview.height}
          </button>
        </div>
      </div>
    </>
  )
}

export default function App() {
  const getUiChromeVisibility = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('chrome') !== '0'
  }

  const getPreviewMode = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('preview') === '1'
  }

  const getLayoutDebugMode = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('layoutDebug') === '1'
  }

  const getScreenFromHash = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'home' || hash === 'segments' || hash === '') {
      return 'home'
    }

    // Legacy Projects is archived; its route redirects to the V2 screen so the
    // existing in-app navigation keeps working during the migration.
    if (hash === 'projects') {
      window.location.hash = 'v2/projects'
      return 'home'
    }

    if (hash === 'segmentation' || hash === 'make') {
      return 'segmentation'
    }

    if (hash === 'exams') {
      return 'exams'
    }

    return 'study'
  }

  const [screen, setScreen] = useState(getScreenFromHash)
  const [showUiChrome, setShowUiChrome] = useState(getUiChromeVisibility)
  const [previewMode, setPreviewMode] = useState(getPreviewMode)
  const [layoutDebugMode, setLayoutDebugMode] = useState(getLayoutDebugMode)
  const [screenRootNode, setScreenRootNode] = useState(null)

  useEffect(() => {
    const handleHashChange = () => {
      setScreen(getScreenFromHash())
      setShowUiChrome(getUiChromeVisibility())
      setPreviewMode(getPreviewMode())
      setLayoutDebugMode(getLayoutDebugMode())
    }

    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setActiveScreen = (nextScreen) => {
    if (nextScreen === 'home') {
      window.location.hash = 'home'
    } else if (nextScreen === 'projects') {
      window.location.hash = 'v2/projects'
    } else if (nextScreen === 'segmentation') {
      window.location.hash = 'segmentation'
    } else if (nextScreen === 'make') {
      window.location.hash = 'make'
    } else if (nextScreen === 'exams') {
      window.location.hash = 'exams'
    } else {
      window.location.hash = 'study'
    }

    setScreen(nextScreen)
  }

  let activeScreen = null
  if (!previewMode && screen === 'home') activeScreen = <ProjectHomeScreen />
  if (!previewMode && screen === 'exams') activeScreen = <ExamsScreen />
  if (!previewMode && screen === 'segmentation') activeScreen = <MakeSegmentationFlowScreen />
  if (!previewMode && screen === 'study') activeScreen = <FigmaScreen />

  return (
    <>
      {previewMode ? <ViewportPreview screen={screen} /> : null}
      {!previewMode && showUiChrome ? (
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
            Study Workspace
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('home')}
            style={{
              border: 'none',
              borderRadius: 999,
              minHeight: 34,
              padding: '0 14px',
              background: screen === 'home' ? '#0f172a' : 'transparent',
              color: screen === 'home' ? '#ffffff' : '#475569',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Project Home
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('projects')}
            style={{
              border: 'none',
              borderRadius: 999,
              minHeight: 34,
              padding: '0 14px',
              background: screen === 'projects' ? '#0f172a' : 'transparent',
              color: screen === 'projects' ? '#ffffff' : '#475569',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('exams')}
            style={{
              border: 'none',
              borderRadius: 999,
              minHeight: 34,
              padding: '0 14px',
              background: screen === 'exams' ? '#0f172a' : 'transparent',
              color: screen === 'exams' ? '#ffffff' : '#475569',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Exams
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('segmentation')}
            style={{
              border: 'none',
              borderRadius: 999,
              minHeight: 34,
              padding: '0 14px',
              background: screen === 'segmentation' ? '#0f172a' : 'transparent',
              color: screen === 'segmentation' ? '#ffffff' : '#475569',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Source + Segmentation
          </button>
        </div>
      ) : null}

      {!previewMode && activeScreen ? (
        <div
          ref={setScreenRootNode}
          data-layout-debug-root
          data-layout-debug-screen={screen}
          {...getLayoutDebugAttrs('misc', 'app_screen_mount')}
        >
          {activeScreen}
        </div>
      ) : null}

      {!previewMode ? <LayoutDebugOverlay rootNode={screenRootNode} enabled={layoutDebugMode} screenLabel={screen} /> : null}
    </>
  )
}

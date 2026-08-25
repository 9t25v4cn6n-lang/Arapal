import React from 'react'
import * as storage from './v2/data/storage.js'

/**
 * Top-level recovery boundary.
 *
 * The product previously had none: a render that threw — e.g. a selector hitting
 * wrong-shape persisted state — took the whole page to a blank screen with no
 * way back (R-019). This catches that, keeps the user oriented, and offers two
 * real recoveries: reload (transient errors) and reset saved data (corrupt local
 * state). Reset clears only Arapal's own storage keys; it never silently deletes
 * without the user choosing it.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload()
  }

  handleReset = () => {
    try {
      storage.clear()
      storage.clearContext()
    } catch {
      /* best effort — reloading onto a fresh empty state is the goal */
    }
    if (typeof window !== 'undefined') {
      window.location.hash = 'v2/projectHome'
      window.location.reload()
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div role="alert" style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.title}>Something went wrong</h1>
          <p style={styles.body}>
            Arapal hit an unexpected error while rendering. Your saved work is stored locally and
            may still be intact — try reloading first. If the problem keeps happening, the saved
            data on this device may be corrupt; resetting it starts from a clean state.
          </p>
          <div style={styles.actions}>
            <button type="button" style={styles.primary} onClick={this.handleReload}>Reload</button>
            <button type="button" style={styles.secondary} onClick={this.handleReset}>
              Reset saved data and reload
            </button>
          </div>
          {this.state.error?.message ? (
            <p style={styles.detail}>{String(this.state.error.message)}</p>
          ) : null}
        </div>
      </div>
    )
  }
}

// Inline styles only: a broken app cannot depend on the token/CSS layer having
// loaded. Neutral, legible, theme-agnostic.
const styles = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', background: '#f5f6f8', fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  card: {
    maxWidth: '520px', width: '100%', background: '#ffffff', border: '1px solid #e3e6ea',
    borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  },
  title: { margin: '0 0 12px', fontSize: '22px', color: '#0f172a' },
  body: { margin: '0 0 24px', fontSize: '15px', lineHeight: 1.55, color: '#475569' },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primary: {
    minHeight: '44px', padding: '0 20px', borderRadius: '999px', border: 'none',
    background: '#2563eb', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
  secondary: {
    minHeight: '44px', padding: '0 20px', borderRadius: '999px', border: '1px solid #cbd5e1',
    background: '#ffffff', color: '#0f172a', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
  detail: { margin: '20px 0 0', fontSize: '12px', color: '#94a3b8', fontFamily: 'ui-monospace, monospace' },
}

import { useCallback, useEffect, useRef, useState } from 'react'

const projectHomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:wght@600;700&display=swap');

  .project-home,
  .project-home * {
    box-sizing: border-box;
  }

  .project-home {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.8), transparent 26%),
      radial-gradient(circle at 88% 14%, rgba(226, 232, 240, 0.74), transparent 22%),
      linear-gradient(180deg, #f6f9fd 0%, #edf3f9 100%);
    color: #0f172a;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .project-home::before,
  .project-home::after {
    content: "";
    position: absolute;
    pointer-events: none;
    filter: blur(2px);
    opacity: 0.92;
  }

  .project-home::before {
    width: 34vw;
    height: 34vw;
    min-width: 320px;
    min-height: 320px;
    left: -10vw;
    top: -14vh;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(191, 219, 254, 0.54) 0%, rgba(191, 219, 254, 0.12) 42%, rgba(191, 219, 254, 0) 72%);
  }

  .project-home::after {
    width: 24vw;
    height: 24vw;
    min-width: 240px;
    min-height: 240px;
    right: -6vw;
    bottom: -6vh;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(226, 232, 240, 0.84) 0%, rgba(226, 232, 240, 0.2) 50%, rgba(226, 232, 240, 0) 74%);
  }

  .project-home__wrap {
    min-height: 100vh;
  }

  .project-home__intro {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    pointer-events: none;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.82) 0%, rgba(241, 245, 249, 0.48) 34%, rgba(241, 245, 249, 0) 72%);
    transition: opacity 0.72s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .project-home__intro.is-outro {
    opacity: 0;
    transform: scale(1.04);
  }

  .project-home__introCore {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    flex-direction: column;
    gap: 18px;
  }

  .project-home__stage {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    transition: opacity 0.72s ease, transform 0.72s ease, filter 0.72s ease;
  }

  .project-home__stage.is-muted {
    opacity: 0;
    transform: translateY(24px) scale(0.985);
    filter: blur(10px);
  }

  .project-home__stage.is-ready {
    opacity: 1;
    transform: none;
    filter: none;
  }

  .project-home__header {
    position: relative;
    min-height: 64px;
    border-bottom: 1px solid rgba(219, 228, 239, 0.92);
    background: rgba(255, 255, 255, 0.96);
  }

  .project-home__headerInner {
    width: calc(100vw - 48px);
    max-width: none;
    min-height: 64px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 10px 0;
  }

  .project-home__brand {
    display: block;
  }

  .project-home__actions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .project-home__navButton {
    min-height: 34px;
    padding: 0 18px;
    border: 1.333px solid rgba(219, 228, 239, 0.92);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.96);
    color: #0f172a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.01em;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .project-home__navButton:hover {
    background: #ffffff;
    border-color: #93c5fd;
    color: #1d4ed8;
  }

  .project-home__deck {
    --project-home-card-width: clamp(205px, 12.8vw, 246px);
    --project-home-card-gap: clamp(18px, 1vw, 20px);
    display: grid;
    grid-template-columns: repeat(4, minmax(0, var(--project-home-card-width)));
    gap: var(--project-home-card-gap);
    align-items: stretch;
    justify-content: center;
    width: min(
      calc((var(--project-home-card-width) * 4) + (var(--project-home-card-gap) * 3)),
      calc(100vw - 120px)
    );
    padding: 0;
    background: transparent;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .project-home__main {
    --project-home-deck-height: clamp(286px, 16.5vw, 312px);
    --project-home-hero-height: 76px;
    position: relative;
    display: block;
    flex: 1;
    height: calc(100vh - 64px);
    min-height: calc(100vh - 64px);
    padding: 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 14% 18%, rgba(219, 234, 254, 0.78), transparent 24%),
      radial-gradient(circle at 84% 18%, rgba(226, 232, 240, 0.72), transparent 22%),
      linear-gradient(180deg, #f7fbff 0%, #eef4fa 100%);
  }

  .project-home__main::before,
  .project-home__main::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .project-home__main::before {
    background:
      linear-gradient(76deg, transparent 0 17%, rgba(59, 130, 246, 0.16) 17.15%, rgba(59, 130, 246, 0.16) 17.28%, transparent 17.43%, transparent 81.5%, rgba(59, 130, 246, 0.14) 81.65%, rgba(59, 130, 246, 0.14) 81.78%, transparent 81.93%);
    opacity: 0.7;
  }

  .project-home__main::after {
    content: "Arapal";
    inset: auto 28px 12px auto;
    width: auto;
    height: auto;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: clamp(92px, 10vw, 160px);
    line-height: 0.9;
    letter-spacing: -0.04em;
    color: rgba(37, 99, 235, 0.07);
  }

  .project-home__heroRow {
    position: absolute;
    left: 50%;
    top: calc((50% - (var(--project-home-deck-height) / 2) - var(--project-home-hero-height)) / 2);
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--project-home-hero-height);
    width: min(
      calc((var(--project-home-card-width) * 4) + (var(--project-home-card-gap) * 3)),
      calc(100vw - 120px)
    );
  }

  .project-home__hero {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    justify-content: center;
  }

  .project-home__heroTitle {
    margin: 0;
    max-width: none;
    font-size: clamp(44px, 3vw, 50px);
    line-height: 0.94;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    white-space: nowrap;
  }

  .project-home__heroText {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    color: #64748b;
    max-width: clamp(420px, 28vw, 480px);
    letter-spacing: 0.01em;
  }

  .project-home__card {
    --project-home-card-height: clamp(286px, 16.5vw, 312px);
    position: relative;
    overflow: hidden;
    min-height: var(--project-home-card-height);
    padding: 0;
    border: none;
    border: 1px solid rgba(219, 228, 239, 0.92);
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(246, 249, 253, 0.96) 100%);
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
    cursor: pointer;
  }

  .project-home__card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)), radial-gradient(circle at top left, rgba(191, 219, 254, 0.2), transparent 36%);
    pointer-events: none;
    opacity: 0.7;
  }

  .project-home__card:hover {
    transform: translateY(-2px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 14px 32px rgba(15, 23, 42, 0.08);
  }

  .project-home__card--study {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.68) 0%, rgba(246, 249, 253, 0.98) 100%);
  }

  .project-home__card--review {
    background: linear-gradient(180deg, rgba(254, 255, 255, 0.68) 0%, rgba(244, 247, 251, 0.98) 100%);
  }

  .project-home__card--start {
    background: linear-gradient(180deg, rgba(250, 252, 255, 0.74) 0%, rgba(240, 245, 251, 0.98) 100%);
  }

  .project-home__card--create {
    background: linear-gradient(180deg, rgba(239, 244, 250, 0.96) 0%, rgba(229, 236, 244, 0.98) 100%);
  }

  .project-home__shell,
  .project-home__meta,
  .project-home__cardHero,
  .project-home__details,
  .project-home__detailCell,
  .project-home__createBody,
  .project-home__createTitle {
    position: relative;
    z-index: 1;
  }

  .project-home__shell {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 40px 1fr auto;
    padding: 22px;
  }

  .project-home__meta {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .project-home__language {
    min-height: 28px;
    min-width: 40px;
    padding: 0 9px;
    border-radius: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cdd8e5;
    background: rgba(255, 255, 255, 0.74);
    color: #475569;
    font-size: 10px;
    line-height: 13px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-family: "JetBrains Mono", monospace;
  }

  .project-home__metaValue {
    padding-top: 3px;
    font-size: 9px;
    line-height: 15px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .project-home__cardHero {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    padding-top: 12px;
  }

  .project-home__cardTitle {
    margin: 0;
    max-width: 5ch;
    font-size: clamp(24px, 1.7vw, 27px);
    line-height: 1.08;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .project-home__details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
    align-items: start;
    width: 100%;
    padding-top: 10px;
    border-top: 1.333px solid rgba(184, 197, 214, 0.72);
  }

  .project-home__detailCell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    text-align: left;
  }

  .project-home__detailCell.is-right {
    align-items: flex-end;
    text-align: right;
  }

  .project-home__detailLabel {
    margin: 0;
    font-size: 11px;
    line-height: 15px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #7b8da6;
    font-family: "JetBrains Mono", monospace;
  }

  .project-home__detailValue {
    margin: 0;
    font-size: 11px;
    line-height: 1.35;
    font-weight: 500;
    color: #0f172a;
  }

  .project-home__detailValue.is-mono {
    font-family: "JetBrains Mono", monospace;
    letter-spacing: 0.04em;
    line-height: 1.4;
  }

  .project-home__createBody {
    grid-row: 1 / -1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
  }

  .project-home__createPlus {
    margin: 0;
    font-size: clamp(56px, 3.8vw, 64px);
    line-height: 1;
    font-weight: 200;
    color: #94a3b8;
  }

  .project-home__createTitle {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    text-align: center;
  }

  .project-home__createLead,
  .project-home__createAccent {
    margin: 0;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    color: #0f172a;
    letter-spacing: -0.04em;
    line-height: 0.94;
  }

  .project-home__createLead {
    font-size: clamp(22px, 1.55vw, 25px);
    font-weight: 600;
  }

  .project-home__createAccent {
    font-size: clamp(22px, 1.55vw, 25px);
    font-style: italic;
    font-weight: 600;
  }

  .project-home__note {
    margin: 0;
    max-width: 24ch;
    font-size: 11px;
    line-height: 1.6;
    color: #64748b;
    text-align: center;
  }

  .project-home__identity {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .project-home__identity.is-hero {
    flex-direction: column;
    gap: 28px;
  }

  .project-home__identityMark {
    position: relative;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid #bfdbfe;
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.98) 100%);
    color: #2563eb;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }

  .project-home__identityMark::after {
    content: "";
    position: absolute;
    inset: -20%;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 34%, rgba(255, 255, 255, 0.72) 50%, rgba(255, 255, 255, 0) 66%);
    transform: translateX(-140%) rotate(10deg);
    opacity: 0;
    pointer-events: none;
  }

  .project-home__identity.is-hero .project-home__identityMark {
    width: 96px;
    height: 96px;
    flex-basis: 96px;
    border-radius: 28px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 22px 48px rgba(37, 99, 235, 0.18);
  }

  .project-home__identity.is-hero .project-home__identityMark::after {
    opacity: 0.7;
    animation: project-home-mark-sweep 1.8s 0.28s ease both;
  }

  .project-home__identityArc,
  .project-home__identityStem,
  .project-home__identityDot {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .project-home__identityArc {
    top: 8px;
    width: 18px;
    height: 9px;
    border: 2px solid currentColor;
    border-bottom: none;
    border-radius: 999px 999px 0 0;
  }

  .project-home__identityStem {
    top: 12px;
    width: 2px;
    height: 16px;
    background: currentColor;
    border-radius: 999px;
  }

  .project-home__identityDot {
    bottom: 8px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 10px 0 0 rgba(37, 99, 235, 0.28);
  }

  .project-home__identity.is-hero .project-home__identityArc {
    top: 19px;
    width: 40px;
    height: 20px;
    border-width: 3px;
  }

  .project-home__identity.is-hero .project-home__identityStem {
    top: 28px;
    width: 3px;
    height: 34px;
  }

  .project-home__identity.is-hero .project-home__identityDot {
    bottom: 17px;
    width: 10px;
    height: 10px;
    box-shadow: 18px 0 0 rgba(37, 99, 235, 0.24);
  }

  .project-home__identityText {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .project-home__identity.is-hero .project-home__identityText {
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .project-home__identityName {
    margin: 0;
    font-size: 22px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: #0f172a;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  }

  .project-home__identityMeta {
    margin: 0;
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    font-family: "JetBrains Mono", monospace;
  }

  .project-home__identity.is-hero .project-home__identityName {
    font-size: clamp(56px, 7vw, 88px);
    line-height: 0.96;
    color: #0f172a;
  }

  .project-home__identity.is-hero .project-home__identityMeta {
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.34em;
    color: #64748b;
  }

  @keyframes project-home-mark-sweep {
    0% { transform: translateX(-140%) rotate(10deg); }
    100% { transform: translateX(140%) rotate(10deg); }
  }

  @media (max-width: 1320px) {
    .project-home__heroRow {
      min-height: auto;
    }

    .project-home__heroTitle {
      font-size: clamp(52px, 5vw, 68px);
      white-space: normal;
    }

    .project-home__deck {
      grid-template-columns: repeat(2, minmax(0, 358px));
    }
  }

  @media (max-width: 900px) {
    .project-home__wrap {
      min-height: 100vh;
    }

    .project-home__stage {
      width: 100%;
    }

    .project-home__header {
      min-height: auto;
      padding: 0;
    }

    .project-home__headerInner {
      width: min(100vw - 32px, 720px);
      min-height: auto;
      padding: 18px 0;
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }

    .project-home__main {
      padding: 36px 0 48px;
      gap: 28px;
    }

    .project-home__deck {
      grid-template-columns: 1fr;
      width: min(100vw - 32px, 720px);
      padding: 0;
    }
  }
`

const homeProjects = [
  {
    id: 'jumuah',
    tone: 'study',
    language: 'AR',
    title: 'Jumuʿah',
    branchLabel: '2.1.1',
    primaryLabel: 'Condition',
    branchTitle: 'Legal Status',
    timeLabel: 'Logged',
    timeSpent: '03:20',
    nextHash: 'study',
  },
  {
    id: 'purity',
    tone: 'review',
    language: 'AR',
    title: 'Purity',
    branchLabel: '1.3',
    primaryLabel: 'Status',
    branchTitle: 'Ghusl',
    timeLabel: 'Logged',
    timeSpent: '01:45',
    nextHash: 'study',
  },
  {
    id: 'fasting',
    tone: 'start',
    language: 'AR',
    title: 'Fasting',
    branchLabel: 'BTC 03',
    primaryLabel: 'Source',
    branchTitle: 'Preserved Archive',
    timeLabel: 'Logged',
    timeSpent: '00:52',
    nextHash: 'segmentation',
  },
  {
    id: 'create',
    tone: 'create',
    title: 'Initiate',
    accentTitle: 'New Protocol',
    note: 'Deploy a pristine environment. Import initial parameters upon readiness.',
    nextHash: 'segmentation',
  },
]

function ArapalBrand({ subtitle = '', hero = false }) {
  return (
    <div className={`project-home__identity${hero ? ' is-hero' : ''}`}>
      <div className="project-home__identityMark" aria-hidden="true">
        <span className="project-home__identityArc" />
        <span className="project-home__identityStem" />
        <span className="project-home__identityDot" />
      </div>
      <div className="project-home__identityText">
        <p className="project-home__identityName">Arapal</p>
        {subtitle ? <p className="project-home__identityMeta">{subtitle}</p> : null}
      </div>
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  if (project.id === 'create') {
    return (
      <button type="button" className={`project-home__card project-home__card--${project.tone}`} onClick={() => onOpen(project.nextHash)}>
        <div className="project-home__shell">
          <div className="project-home__createBody">
            <p className="project-home__createPlus">+</p>
            <div className="project-home__createTitle">
              <p className="project-home__createLead">{project.title}</p>
              <p className="project-home__createAccent">{project.accentTitle}</p>
            </div>
            <p className="project-home__note">{project.note}</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button type="button" className={`project-home__card project-home__card--${project.tone}`} onClick={() => onOpen(project.nextHash)}>
      <div className="project-home__shell">
        <div className="project-home__meta">
          <span className="project-home__language">{project.language}</span>
          <span className="project-home__metaValue">{project.branchLabel}</span>
        </div>

        <div className="project-home__cardHero">
          <h2 className="project-home__cardTitle">{project.title}</h2>
        </div>

        <div className="project-home__details">
          <div className="project-home__detailCell">
            <p className="project-home__detailLabel">{project.primaryLabel}</p>
            <p className="project-home__detailValue">{project.branchTitle}</p>
          </div>
          <div className="project-home__detailCell is-right">
            <p className="project-home__detailLabel">{project.timeLabel}</p>
            <p className="project-home__detailValue is-mono">{project.timeSpent}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

export default function ProjectHomeScreen() {
  const shouldSkipIntro = new URLSearchParams(window.location.search).get('intro') === '0'
  const [introPhase, setIntroPhase] = useState(shouldSkipIntro ? 'done' : 'intro')
  const introTimersRef = useRef({ fade: null, finish: null })

  const clearIntroTimers = useCallback(() => {
    if (introTimersRef.current.fade) window.clearTimeout(introTimersRef.current.fade)
    if (introTimersRef.current.finish) window.clearTimeout(introTimersRef.current.finish)
  }, [])

  const startIntro = useCallback(() => {
    clearIntroTimers()
    setIntroPhase('intro')

    introTimersRef.current.fade = window.setTimeout(() => {
      setIntroPhase('outro')
    }, 1300)

    introTimersRef.current.finish = window.setTimeout(() => {
      setIntroPhase('done')
    }, 2100)
  }, [clearIntroTimers])

  useEffect(() => {
    if (shouldSkipIntro) {
      setIntroPhase('done')
      return undefined
    }

    startIntro()
    return () => clearIntroTimers()
  }, [clearIntroTimers, shouldSkipIntro, startIntro])

  const openHash = (nextHash) => {
    window.location.hash = nextHash
  }

  return (
    <>
      <style>{projectHomeStyles}</style>
      <div className="project-home">
        <div className="project-home__wrap">
          {introPhase !== 'done' ? (
          <div className={`project-home__intro${introPhase === 'outro' ? ' is-outro' : ''}`}>
              <div className="project-home__introCore">
                <ArapalBrand hero subtitle="Guided Translation Practice" />
              </div>
            </div>
          ) : null}

          <div className={`project-home__stage${introPhase === 'intro' ? ' is-muted' : ' is-ready'}`}>
            <div className="project-home__header">
              <div className="project-home__headerInner">
                <div className="project-home__brand">
                  <ArapalBrand subtitle="Segments" />
                </div>
                <div className="project-home__actions">
                  <button type="button" className="project-home__navButton" onClick={startIntro}>
                    Replay intro
                  </button>
                  <button type="button" className="project-home__navButton" onClick={() => openHash('projects')}>
                    Projects →
                  </button>
                  <button type="button" className="project-home__navButton" onClick={() => openHash('segmentation')}>
                    Segmentation →
                  </button>
                </div>
              </div>
            </div>

            <div className="project-home__main">
              <div className="project-home__heroRow">
                <div className="project-home__hero">
                  <h2 className="project-home__heroTitle">Pick up where you left off</h2>
                  <p className="project-home__heroText">Reopen the exact project state you need, jump into segmentation when structure needs work, or move directly into study.</p>
                </div>
              </div>

              <div className="project-home__deck">
                {homeProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onOpen={openHash} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

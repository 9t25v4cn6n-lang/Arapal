/**
 * Screen-local companion illustration for the Projects welcome state.
 *
 * It is intentionally a single SVG asset rather than a collection of positioned
 * DOM fragments. Layout belongs to the parent container; this component only
 * draws the illustration. If the companion becomes a cross-product identity
 * primitive, promote it to foundation then — not before it has a second owner.
 */
export default function ArapalCompanion({ title = 'Arapal reading companion' }) {
  return (
    <svg
      viewBox="0 0 220 190"
      role="img"
      aria-label={title}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <style>{`
        .arapal-companion__eyes { transform-origin: 110px 69px; animation: arapal-companion-blink 6s ease-in-out infinite; }
        .arapal-companion__wings { transform-origin: 110px 108px; animation: arapal-companion-breathe 3.8s ease-in-out infinite; }
        @keyframes arapal-companion-blink { 0%, 45%, 47%, 100% { transform: scaleY(1); } 46% { transform: scaleY(0.14); } }
        @keyframes arapal-companion-breathe { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(1.5px); } }
        @media (prefers-reduced-motion: reduce) { .arapal-companion__eyes, .arapal-companion__wings { animation: none; } }
      `}</style>
      <defs>
        <linearGradient id="arapal-companion-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F6EEA" />
          <stop offset="1" stopColor="#2946C9" />
        </linearGradient>
        <linearGradient id="arapal-companion-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDF4FF" />
        </linearGradient>
        <filter id="arapal-companion-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1D4ED8" floodOpacity="0.12" />
        </filter>
      </defs>

      <ellipse cx="110" cy="172" rx="55" ry="9" fill="#1E3A8A" opacity="0.08" />

      <g filter="url(#arapal-companion-shadow)">
        <path
          d="M56 75C56 28 79 12 110 12C141 12 164 28 164 75V130C164 158 143 172 110 172C77 172 56 158 56 130V75Z"
          fill="url(#arapal-companion-body)"
        />

        <g className="arapal-companion__wings">
          <path
            d="M50 82C36 91 31 110 38 128C42 138 50 144 59 142L69 122L67 90L50 82Z"
            fill="#DBEAFE"
            stroke="#93C5FD"
          />
          <path
            d="M170 82C184 91 189 110 182 128C178 138 170 144 161 142L151 122L153 90L170 82Z"
            fill="#DBEAFE"
            stroke="#93C5FD"
          />
        </g>

        <ellipse cx="88" cy="69" rx="31" ry="33" fill="url(#arapal-companion-face)" stroke="#BFDBFE" strokeWidth="3" />
        <ellipse cx="132" cy="69" rx="31" ry="33" fill="url(#arapal-companion-face)" stroke="#BFDBFE" strokeWidth="3" />

        <g className="arapal-companion__eyes">
          <circle cx="91" cy="71" r="11" fill="#1E3A8A" />
          <circle cx="129" cy="71" r="11" fill="#1E3A8A" />
          <circle cx="95" cy="67" r="3" fill="#FFFFFF" />
          <circle cx="133" cy="67" r="3" fill="#FFFFFF" />
        </g>

        <path d="M110 78L98 93L110 101L122 93L110 78Z" fill="#F3B329" />
        <ellipse cx="110" cy="125" rx="42" ry="36" fill="#F8FBFF" />

        <rect x="87" y="131" width="46" height="28" rx="8" fill="#FFFFFF" stroke="#BFDBFE" />
        <path
          d="M110 136V153M92 138C100 136 104 138 110 141M128 138C120 136 116 138 110 141"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path d="M86 170L78 180M94 171L96 180M126 171L124 180M134 170L142 180" stroke="#E0A11A" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

type Props = { score: number }

const ZONES = [
  { min: 0,  max: 30,  label: 'MÜDAFİƏÇİ',    color: '#F43F5E' },
  { min: 30, max: 50,  label: 'RİSK AZALTMA',  color: '#F97316' },
  { min: 50, max: 70,  label: 'EHTİYATLI',     color: '#F59E0B' },
  { min: 70, max: 85,  label: 'BULUŞÇU',       color: '#22D3EE' },
  { min: 85, max: 100, label: 'ÇOX BULUŞÇU',  color: '#00FFA3' },
]

function getZone(score: number) {
  return ZONES.find(z => score >= z.min && score <= z.max) ?? ZONES[2]
}

export default function HealthGauge({ score }: Props) {
  const zone = getZone(score)

  // SVG yarımdairə: cx=160, cy=140, r=110
  // Başlanğıc: sol (180°), son: sağ (0°) — üst yarımdairə
  const cx = 160, cy = 140, r = 110
  const circumference = Math.PI * r  // yarım dairə
  const filled = (score / 100) * circumference

  // Arc path: sol nöqtədən sağa doğru yuxarıdan
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy

  // Track arc (full half circle)
  const trackPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`

  // Fill arc — strokeDasharray trick
  const fillDash = `${filled} ${circumference}`

  // Needle angle: -180deg (sol) → 0deg (sağ), score 0→100
  const angleDeg = -180 + (score / 100) * 180
  const angleRad = (angleDeg * Math.PI) / 180
  const needleLen = 85
  const nx = cx + needleLen * Math.cos(angleRad)
  const ny = cy + needleLen * Math.sin(angleRad)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 160" className="w-full max-w-xs">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="var(--bg-card-2)" strokeWidth="18" strokeLinecap="round" />

        {/* Zone color arcs — background gradient segments */}
        {ZONES.map((z) => {
          const segStart = (z.min / 100) * circumference
          const segLen = ((z.max - z.min) / 100) * circumference
          return (
            <path
              key={z.label}
              d={trackPath}
              fill="none"
              stroke={z.color}
              strokeWidth="18"
              strokeLinecap="butt"
              strokeOpacity="0.18"
              strokeDasharray={`${segLen} ${circumference}`}
              strokeDashoffset={-segStart}
            />
          )
        })}

        {/* Fill arc */}
        <path
          d={trackPath}
          fill="none"
          stroke={zone.color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={fillDash}
          strokeDashoffset="0"
        />

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke="var(--text-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="var(--text-primary)" />

        {/* Score */}
        <text x={cx} y={cy - 18} textAnchor="middle" fill={zone.color}
          fontSize="36" fontWeight="700" fontFamily="IBM Plex Mono, monospace">
          {score}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fill={zone.color}
          fontSize="11" fontWeight="700" fontFamily="DM Sans, sans-serif" letterSpacing="2">
          {zone.label}
        </text>
      </svg>
    </div>
  )
}

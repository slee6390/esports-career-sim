import type { CareerState, TrainingStat } from '../../sim/careerEngine.js'

const TRAINING_OPTIONS: Array<{
  stat:        TrainingStat
  label:       string
  description: string
}> = [
  { stat: 'mechanics',     label: 'Mechanics',     description: 'CS consistency, reaction time, skill accuracy. Raises your KDA ceiling.' },
  { stat: 'laning',        label: 'Laning',         description: 'Wave management, trading, resource denial. Improves your lane phase results.' },
  { stat: 'gameSense',     label: 'Game Sense',     description: 'Roam timing, objective priority, map reading. Raises objective involvement.' },
  { stat: 'teamfight',     label: 'Teamfight',      description: 'Positioning under pressure, skill usage in fights. Raises fan reaction.' },
  { stat: 'communication', label: 'Communication',  description: 'Shotcalling, coordination, pinging. Raises coach trust over time.' },
]

const ratingColor = (v: number) => v >= 70 ? '#3fb950' : v >= 50 ? '#ffa657' : '#f85149'

interface Props {
  career:     CareerState
  onComplete: (stat: TrainingStat) => void
  onBack:     () => void
}

export function TrainingScreen({ career, onComplete, onBack }: Props) {
  const { player: p } = career

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: '#6e7681', fontSize: 12,
            cursor: 'pointer', padding: 0, marginBottom: 16,
          }}
        >
          ← Back
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e6edf3', margin: 0 }}>Weekly Training</h2>
        <p style={{ color: '#8b949e', fontSize: 12, marginTop: 6 }}>
          Choose one area to focus on. You'll gain +4 in that stat.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TRAINING_OPTIONS.map(({ stat, label, description }) => {
          const val = p[stat]
          return (
            <button
              key={stat}
              onClick={() => onComplete(stat)}
              style={{
                background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
                padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#58a6ff')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363d')}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#e6edf3' }}>{label}</span>
                  <span style={{ color: ratingColor(val), fontSize: 12, fontWeight: 600 }}>{val}</span>
                  <span style={{ color: '#3fb950', fontSize: 11 }}>→ {Math.min(99, val + 4)}</span>
                </div>
                <div style={{ color: '#8b949e', fontSize: 11, lineHeight: 1.4 }}>{description}</div>
              </div>
              <div style={{ width: 80 }}>
                <div style={{ height: 4, background: '#21262d', borderRadius: 2 }}>
                  <div style={{
                    width: `${val}%`, height: '100%', borderRadius: 2,
                    background: ratingColor(val),
                  }} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import type { CareerState } from '../../sim/careerEngine.js'

const bar = (v: number) => {
  const color = v >= 70 ? '#3fb950' : v >= 50 ? '#ffa657' : '#f85149'
  return (
    <div style={{ flex: 1, height: 4, background: '#21262d', borderRadius: 2 }}>
      <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.3s' }} />
    </div>
  )
}

interface Props {
  career:      CareerState
  onTrain:     () => void
  onPlayMatch: () => void
}

export function HomeScreen({ career, onTrain, onPlayMatch }: Props) {
  const { player: p, history, week, champion } = career
  const wins   = history.filter(r => r.won).length
  const losses = history.length - wins
  const recent = [...history].reverse().slice(0, 5)

  const stats: Array<{ label: string; key: keyof typeof p }> = [
    { label: 'Mechanics',     key: 'mechanics'     },
    { label: 'Laning',        key: 'laning'        },
    { label: 'Game Sense',    key: 'gameSense'     },
    { label: 'Teamfight',     key: 'teamfight'     },
    { label: 'Communication', key: 'communication' },
  ]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: '#6e7681', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Week {week}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#e6edf3', margin: 0 }}>{champion.name}</h1>
          <span style={{ color: '#8b949e', fontSize: 13 }}>{wins}W – {losses}L</span>
          {p.form !== 0 && (
            <span style={{ fontSize: 12, color: p.form > 0 ? '#3fb950' : '#f85149' }}>
              {p.form > 0 ? `↑ +${p.form} form` : `↓ ${p.form} form`}
            </span>
          )}
        </div>
      </div>

      {/* Career stats */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
        padding: '16px 20px', marginBottom: 16,
      }}>
        <div style={{ color: '#6e7681', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Player Stats
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stats.map(({ label, key }) => {
            const val = p[key] as number
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#8b949e', fontSize: 11, minWidth: 100 }}>{label}</span>
                {bar(val)}
                <span style={{ color: '#e6edf3', fontSize: 11, minWidth: 24, textAlign: 'right' }}>{val}</span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #21262d', display: 'flex', gap: 16 }}>
          <span style={{ color: '#6e7681', fontSize: 11 }}>
            Mastery <span style={{ color: '#e6edf3' }}>{p.championMastery[champion.id] ?? 0}</span>
          </span>
        </div>
      </div>

      {/* Match history */}
      {recent.length > 0 && (
        <div style={{
          background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
          padding: '16px 20px', marginBottom: 24,
        }}>
          <div style={{ color: '#6e7681', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Recent Matches
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                <span style={{
                  color: r.won ? '#3fb950' : '#f85149',
                  fontWeight: 700, minWidth: 28,
                }}>
                  {r.won ? 'W' : 'L'}
                </span>
                <span style={{ color: '#8b949e' }}>Wk {r.week}</span>
                <span style={{ color: '#e6edf3' }}>
                  {r.evaluation.kda.toFixed(1)} KDA
                </span>
                <span style={{ color: '#6e7681' }}>·</span>
                <span style={{ color: '#8b949e' }}>Coach {r.evaluation.coachRating}</span>
                <span style={{ color: '#6e7681' }}>·</span>
                <span style={{ color: '#8b949e' }}>Fan {r.evaluation.fanReaction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onTrain}
          style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 6,
            padding: '10px 20px', color: '#e6edf3', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.04em', cursor: 'pointer',
          }}
        >
          TRAIN
        </button>
        <button
          onClick={onPlayMatch}
          style={{
            background: '#238636', border: '1px solid #2ea043', borderRadius: 6,
            padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.04em', cursor: 'pointer',
          }}
        >
          PLAY MATCH
        </button>
      </div>
    </div>
  )
}

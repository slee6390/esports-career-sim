import type { MatchResult } from '../../sim/matchEngine.js'

interface StatCardProps { label: string; value: string | number; sub?: string; color?: string }

function StatCard({ label, value, sub, color = '#e6edf3' }: StatCardProps) {
  return (
    <div style={{
      background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
      padding: '14px 16px', textAlign: 'center',
    }}>
      <div style={{ color: '#6e7681', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ color: '#6e7681', fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function ratingColor(n: number) {
  return n >= 70 ? '#3fb950' : n >= 50 ? '#ffa657' : '#f85149'
}

interface Props { result: MatchResult; onPlayAgain: () => void }

export function ResultScreen({ result, onPlayAgain }: Props) {
  const { won, finalWinChance, evaluation: ev, finalPlayer: p, finalTeam: t } = result

  const outcomeColor = won ? '#3fb950' : '#f85149'
  const outcomeLabel = won ? 'VICTORY' : 'DEFEAT'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
      {/* Outcome */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontSize: 48, fontWeight: 900, color: outcomeColor,
          letterSpacing: '0.12em', lineHeight: 1,
        }}>
          {outcomeLabel}
        </div>
        <div style={{ color: '#6e7681', fontSize: 12, marginTop: 8 }}>
          Final win probability: {Math.round(finalWinChance * 100)}%
        </div>
      </div>

      {/* KDA row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        <span style={{ color: '#f85149' }}>{p.kills}</span>
        <span style={{ color: '#6e7681' }}>/</span>
        <span style={{ color: '#e6edf3' }}>{p.deaths}</span>
        <span style={{ color: '#6e7681' }}>/</span>
        <span style={{ color: '#ffa657' }}>{p.assists}</span>
        <span style={{ color: '#444c56', fontSize: 14, alignSelf: 'flex-end', marginLeft: 8, marginBottom: 4 }}>
          KDA {ev.kda.toFixed(2)}
        </span>
      </div>

      {/* Evaluation grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        <StatCard label="CS" value={ev.csTotal} sub="creep score" />
        <StatCard label="Obj. Involvement" value={`${ev.objectiveInvolvement}%`} color={ratingColor(ev.objectiveInvolvement)} />
        <StatCard label="Coach Rating" value={ev.coachRating} color={ratingColor(ev.coachRating)}
          sub={ev.coachRating >= 70 ? 'Solid performance' : ev.coachRating >= 50 ? 'Acceptable' : 'Needs improvement'} />
        <StatCard label="Fan Reaction" value={ev.fanReaction} color={ratingColor(ev.fanReaction)}
          sub={ev.fanReaction >= 70 ? 'Crowd favourite' : ev.fanReaction >= 50 ? 'Respectable' : 'Under the radar'} />
      </div>

      {/* Team state summary */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
        padding: '14px 16px', marginBottom: 28,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
      }}>
        {[
          { label: 'Gold diff', value: t.goldDiff >= 0 ? `+${t.goldDiff}` : `${t.goldDiff}`, color: t.goldDiff >= 0 ? '#3fb950' : '#f85149' },
          { label: 'Vision',    value: `${Math.round(t.visionControl)}`,  color: ratingColor(t.visionControl) },
          { label: 'Objectives',value: `${Math.round(t.objectiveControl)}`, color: ratingColor(t.objectiveControl) },
          { label: 'Synergy',   value: `${Math.round(t.teamSynergy)}`,   color: ratingColor(t.teamSynergy) },
          { label: 'Morale',    value: `${Math.round(t.morale)}`,         color: ratingColor(t.morale) },
          { label: 'Mental',    value: `${Math.round(p.mental)}`,         color: ratingColor(p.mental) },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ color: '#6e7681', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        style={{
          background: '#21262d', border: '1px solid #30363d',
          borderRadius: 6, padding: '10px 24px',
          color: '#e6edf3', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.04em', width: '100%',
        }}
      >
        PLAY AGAIN
      </button>
    </div>
  )
}

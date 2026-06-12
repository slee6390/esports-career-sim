import { useState } from 'react'
import { champions } from '../../data/champions/index.js'
import type { ChampionData } from '../../sim/types.js'

const ROLE_COLOR: Record<string, string> = {
  top: '#58a6ff', jungle: '#3fb950', mid: '#d2a8ff',
  adc: '#f85149', support: '#ffa657',
}

const PHASE_LABELS: string[] = ['Early', 'E-Mid', 'Mid', 'Late', 'Final']

function ScalingBar({ champion }: { champion: ChampionData }) {
  const phases: Array<keyof ChampionData['scalingCurve']> = ['lane', 'earlyMid', 'mid', 'late', 'finalFight']
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 8, alignItems: 'flex-end', height: 32 }}>
      {phases.map((phase, i) => {
        const val = champion.scalingCurve[phase]
        const h = Math.round((val / 100) * 28)
        const color = val >= 70 ? '#3fb950' : val >= 50 ? '#ffa657' : '#6e7681'
        return (
          <div key={phase} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', height: h, background: color, borderRadius: 2 }} />
            <span style={{ color: '#6e7681', fontSize: 9 }}>{PHASE_LABELS[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

interface Props { onStart: (champion: ChampionData) => void }

export function SetupScreen({ onStart }: Props) {
  const [selected, setSelected] = useState<ChampionData>(champions[0])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3', letterSpacing: '0.05em' }}>
          ESPORTS CAREER SIM
        </h1>
        <p style={{ color: '#8b949e', marginTop: 4 }}>
          Select your champion. Your team fields the rest.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))', gap: 12, marginBottom: 32 }}>
        {champions.map(c => {
          const isSelected = c.id === selected.id
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                background: isSelected ? '#161b22' : '#0d1117',
                border: `1px solid ${isSelected ? '#58a6ff' : '#30363d'}`,
                borderRadius: 8,
                padding: '14px 12px',
                textAlign: 'left',
                color: '#e6edf3',
                transition: 'border-color 0.15s',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                {c.roles.map(r => (
                  <span key={r} style={{
                    background: ROLE_COLOR[r] + '22',
                    color: ROLE_COLOR[r],
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 4,
                    fontWeight: 600,
                  }}>
                    {r.toUpperCase()}
                  </span>
                ))}
              </div>
              <div style={{ color: '#8b949e', fontSize: 11, lineHeight: 1.4 }}>{c.identity.split('.')[0]}.</div>
              <ScalingBar champion={c} />
            </button>
          )
        })}
      </div>

      <div style={{
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
        padding: '16px 20px', marginBottom: 24,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</div>
        <div style={{ color: '#8b949e', fontSize: 12, marginBottom: 10 }}>{selected.identity}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {selected.skills.map(s => (
            <span key={s.name} style={{
              background: '#21262d', border: '1px solid #30363d',
              borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#8b949e',
            }}>
              {s.name} <span style={{ color: '#6e7681' }}>({s.archetype})</span>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        style={{
          background: '#238636', border: '1px solid #2ea043',
          borderRadius: 6, padding: '10px 24px',
          color: '#fff', fontSize: 14, fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        START MATCH
      </button>
    </div>
  )
}

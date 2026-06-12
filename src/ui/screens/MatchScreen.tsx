import { useEffect, useRef, useState } from 'react'
import { runMatchGen } from '../../sim/matchEngine.js'
import type { MatchConfig, MatchStep, MatchResult } from '../../sim/matchEngine.js'
import type { ChoiceOption } from '../../data/choices/index.js'
import { makeRng } from '../../sim/rng.js'
import type { GameEvent } from '../../sim/events.js'
import type { EventKind } from '../../sim/events.js'

// ---------------------------------------------------------------------------
// Event display config
// ---------------------------------------------------------------------------

const EVENT_STYLE: Partial<Record<EventKind, { color: string; prefix: string; dim?: boolean }>> = {
  phaseStart:      { color: '#58a6ff', prefix: '══' },
  phaseEnd:        { color: '#30363d', prefix: '──', dim: true },
  kill:            { color: '#f85149', prefix: '✦' },
  death:           { color: '#6e3d3d', prefix: '✦' },
  assist:          { color: '#ffa657', prefix: '✦' },
  csGain:          { color: '#6e7681', prefix: '  ', dim: true },
  goldSwing:       { color: '#d2a8ff', prefix: '$' },
  towerFall:       { color: '#4ecdc4', prefix: '▲' },
  dragonTaken:     { color: '#3fb950', prefix: '◆' },
  baronTaken:      { color: '#d2a8ff', prefix: '◆' },
  visionPlaced:    { color: '#ffa657', prefix: '○' },
  visionDenied:    { color: '#6e3d3d', prefix: '✗' },
  choicePresented: { color: '#388bfd', prefix: '?' },
  choiceMade:      { color: '#58a6ff', prefix: '→' },
  winChanceUpdate: { color: '#444c56', prefix: '~', dim: true },
  matchResult:     { color: '#ffd60a', prefix: '★' },
}

function EventRow({ event }: { event: GameEvent }) {
  const style = EVENT_STYLE[event.kind] ?? { color: '#8b949e', prefix: '·' }
  if (event.kind === 'choicePresented') return null
  if (event.kind === 'csGain') return null  // CS total shown on result screen

  return (
    <div style={{
      display: 'flex', gap: 8, padding: '1px 0',
      opacity: style.dim ? 0.45 : 1,
      color: style.color,
      fontWeight: event.kind === 'phaseStart' || event.kind === 'matchResult' ? 700 : 400,
      fontSize: event.kind === 'phaseStart' ? 12 : 12,
      letterSpacing: event.kind === 'phaseStart' ? '0.08em' : 0,
    }}>
      <span style={{ minWidth: 12, textAlign: 'center', userSelect: 'none' }}>{style.prefix}</span>
      <span>{event.description}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Win chance bar
// ---------------------------------------------------------------------------

function WinBar({ pct }: { pct: number }) {
  const p = Math.round(pct * 100)
  const color = p >= 60 ? '#3fb950' : p >= 40 ? '#ffa657' : '#f85149'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 4, background: '#21262d', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${p}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.4s' }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: 12, minWidth: 38, textAlign: 'right' }}>{p}%</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Choice panel
// ---------------------------------------------------------------------------

function ChoicePanel({ step, onChoose }: { step: MatchStep; onChoose: (id: string) => void }) {
  return (
    <div style={{
      borderTop: '1px solid #21262d', padding: '16px 20px',
      background: '#0d1117',
    }}>
      <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Decision required · {step.choiceRequest.phase}
      </div>
      <div style={{ color: '#e6edf3', fontWeight: 600, marginBottom: 14, fontSize: 13 }}>
        {step.choiceRequest.situation}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {step.choiceRequest.options.map((opt: ChoiceOption) => (
          <button
            key={opt.id}
            onClick={() => onChoose(opt.id)}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 6,
              padding: '10px 14px',
              textAlign: 'left',
              color: '#e6edf3',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#58a6ff')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363d')}
          >
            <span style={{ fontWeight: 600, fontSize: 13 }}>{opt.text}</span>
            <span style={{ color: '#8b949e', fontSize: 11 }}>{opt.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

interface Props {
  config:     MatchConfig
  onComplete: (result: MatchResult) => void
}

export function MatchScreen({ config, onComplete }: Props) {
  const [log, setLog]         = useState<GameEvent[]>([])
  const [step, setStep]       = useState<MatchStep | null>(null)
  const [winPct, setWinPct]   = useState(0.5)
  const [done, setDone]       = useState(false)

  const gen       = useRef(runMatchGen(config, makeRng(config.seed)))
  const shownCount = useRef(0)
  const initialized = useRef(false)
  const logEnd    = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever log grows
  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [log])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    advance()
  }, [])

  function advance(optionId?: string) {
    const result = optionId ? gen.current.next({ optionId }) : gen.current.next()

    if (result.done) {
      const remaining = result.value.log.slice(shownCount.current)
      setLog(prev => [...prev, ...remaining])
      setStep(null)
      setDone(true)
      setWinPct(result.value.finalWinChance)
      setTimeout(() => onComplete(result.value), 1800)
    } else {
      setLog(prev => [...prev, ...result.value.newEvents])
      shownCount.current += result.value.newEvents.length
      setStep(result.value)
      setWinPct(result.value.winChance)
    }
  }

  function handleChoice(optionId: string) {
    setStep(null)
    advance(optionId)
  }

  const phaseLabel = step?.choiceRequest.phase ?? (done ? 'complete' : '…')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px', borderBottom: '1px solid #21262d',
        background: '#161b22', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span style={{ fontWeight: 700, color: '#58a6ff', letterSpacing: '0.06em' }}>
          {config.playerChampion.name.toUpperCase()}
        </span>
        <span style={{ color: '#6e7681', fontSize: 11 }}>vs</span>
        <span style={{ color: '#8b949e', fontSize: 11 }}>Ranked Match</span>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <WinBar pct={winPct} />
        </div>
        <span style={{ color: '#6e7681', fontSize: 11, minWidth: 60, textAlign: 'right' }}>
          {phaseLabel}
        </span>
      </div>

      {/* Event log */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
        {log.map((event, i) => <EventRow key={i} event={event} />)}
        {!step && !done && (
          <div style={{ color: '#444c56', marginTop: 4 }}>analyzing…</div>
        )}
        <div ref={logEnd} />
      </div>

      {/* Choice panel or result placeholder */}
      {step && !done && (
        <ChoicePanel step={step} onChoose={handleChoice} />
      )}
      {done && (
        <div style={{
          borderTop: '1px solid #21262d', padding: '12px 20px',
          color: '#6e7681', fontSize: 12,
        }}>
          Loading results…
        </div>
      )}
    </div>
  )
}

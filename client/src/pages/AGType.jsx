import {
  useState, useEffect, useRef, useCallback,
  useMemo, useLayoutEffect,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Keyboard, Trophy, RotateCcw, Loader2,
  Crown, CheckCircle2, AlertCircle,
} from 'lucide-react'
import {
  submitTypingScore,
  getTypingLeaderboard,
  getMyTypingStats,
} from '../services/api'
import { formatShortDate } from '../utils/formatDate'

// ── Constants ─────────────────────────────────────────────────────────
const DURATIONS = [15, 30, 60, 120]

const WORD_POOL = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'great', 'between', 'need',
  'large', 'often', 'hand', 'high', 'place', 'hold', 'turn', 'help',
  'start', 'point', 'city', 'play', 'small', 'number', 'off', 'always',
  'move', 'right', 'world', 'still', 'own', 'life', 'few', 'open',
  'seem', 'together', 'next', 'white', 'begin', 'got', 'walk', 'paper',
  'group', 'music', 'those', 'both', 'letter', 'until', 'mile', 'river',
  'car', 'feet', 'care', 'second', 'enough', 'plain', 'girl', 'young',
  'ready', 'above', 'ever', 'red', 'list', 'though', 'feel', 'talk',
  'bird', 'soon', 'body', 'dog', 'family', 'leave', 'song', 'door',
  'black', 'short', 'class', 'wind', 'question', 'happen', 'complete',
  'ship', 'area', 'half', 'rock', 'order', 'fire', 'south', 'problem',
  'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole', 'space',
  'heard', 'best', 'hour', 'better', 'true', 'during', 'hundred', 'five',
  'remember', 'step', 'early', 'west', 'ground', 'interest', 'reach',
  'fast', 'sing', 'listen', 'six', 'table', 'travel', 'less', 'morning',
  'ten', 'simple', 'several', 'toward', 'war', 'lay', 'against', 'slow',
  'center', 'love', 'person', 'money', 'serve', 'appear', 'road', 'map',
  'rain', 'rule', 'pull', 'cold', 'notice', 'voice', 'fall', 'power',
  'town', 'rise', 'fact', 'plan', 'floor', 'yet', 'wave', 'wide', 'free',
  'must', 'break', 'run', 'age', 'set', 'change', 'once', 'tell', 'miss',
  'found', 'call', 'front', 'keep', 'land', 'side', 'night', 'eye',
  'never', 'same', 'below', 'show', 'put', 'cut', 'face', 'watch', 'far',
  'Indian', 'real', 'almost', 'let', 'above', 'girl', 'sometimes', 'mountain',
  'cut', 'young', 'talk', 'soon', 'list', 'song', 'being', 'leave', 'family',
  'it', 'near', 'food', 'plant', 'light', 'voice', 'power', 'town', 'fine',
  'drive', 'short', 'road', 'true', 'book', 'carry', 'took', 'science',
  'eat', 'room', 'friend', 'began', 'idea', 'fish', 'mountain', 'north',
  'once', 'base', 'hear', 'horse', 'cut', 'sure', 'watch', 'color', 'face',
  'wood', 'main', 'open', 'seem', 'together', 'next', 'white', 'children',
]

function generateWords(n = 200) {
  const out = []
  for (let i = 0; i < n; i++) {
    out.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)])
  }
  return out
}

// ── Stat helpers ──────────────────────────────────────────────────────
function calcWpm(wordResults, elapsedMs) {
  if (elapsedMs < 500) return 0
  const correctChars = wordResults.reduce(
    (acc, r) => r.correct ? acc + r.target.length + 1 : acc, 0,
  )
  return Math.round((correctChars / 5) / (elapsedMs / 60000))
}

function calcAccuracy(wordResults) {
  if (!wordResults.length) return 100
  const total   = wordResults.reduce((a, r) => a + r.typed.length, 0)
  const correct = wordResults.reduce((a, r) => {
    let c = 0
    r.typed.split('').forEach((ch, i) => { if (ch === r.target[i]) c++ })
    return a + c
  }, 0)
  return total > 0 ? Math.round((correct / total) * 1000) / 10 : 100
}

function wordErrors(typed, target) {
  let e = 0
  const max = Math.max(typed.length, target.length)
  for (let i = 0; i < max; i++) {
    if ((typed[i] ?? '') !== (target[i] ?? '')) e++
  }
  return e
}

// ── Word display ──────────────────────────────────────────────────────
function WordDisplay({ words, wordIdx, inputVal, wordResults, phase, onFocus }) {
  const containerRef = useRef(null)
  const innerRef     = useRef(null)
  const activeRef    = useRef(null)
  const [translateY, setTranslateY] = useState(0)

  // Scroll active word into first visible row
  useLayoutEffect(() => {
    if (!activeRef.current || !containerRef.current) return
    const cRect = containerRef.current.getBoundingClientRect()
    const wRect = activeRef.current.getBoundingClientRect()
    const visibleTop = wRect.top - cRect.top
    const LINE = 60
    setTranslateY(prev => {
      const actualTop = visibleTop + prev
      if (actualTop <= LINE / 2) return prev
      return Math.max(0, actualTop - LINE / 2)
    })
  }, [wordIdx])

  useEffect(() => {
    if (phase === 'idle') setTranslateY(0)
  }, [phase])

  return (
    <div
      ref={containerRef}
      className="overflow-hidden h-[168px] relative cursor-text select-none"
      onClick={onFocus}
    >
      <div
        ref={innerRef}
        className="flex flex-wrap gap-x-3 gap-y-[18px] transition-transform duration-150 ease-out"
        style={{ transform: `translateY(-${translateY}px)` }}
      >
        {words.map((word, wi) => {
          const isActive  = wi === wordIdx
          const isPast    = wi < wordIdx
          const result    = wordResults[wi]

          return (
            <span
              key={wi}
              ref={isActive ? activeRef : null}
              className="relative inline-flex text-[22px] leading-none font-mono tracking-wide"
            >
              {word.split('').map((char, ci) => {
                let cls
                if (isActive) {
                  if (ci < inputVal.length) {
                    cls = inputVal[ci] === char
                      ? 'text-ink'
                      : 'text-danger'
                  } else {
                    cls = 'text-ink-subtle'
                  }
                } else if (isPast && result) {
                  if (ci < result.typed.length) {
                    cls = result.typed[ci] === char
                      ? 'text-ink/40'
                      : 'text-danger/50'
                  } else {
                    cls = 'text-danger/30'
                  }
                } else {
                  cls = 'text-ink-subtle/30'
                }

                const isCursor = isActive && ci === inputVal.length

                return (
                  <span key={ci} className={`relative ${cls}`}>
                    {isCursor && (
                      <span className="absolute left-0 top-[-2px] bottom-[-2px] w-[2px] bg-brand animate-pulse rounded-full" />
                    )}
                    {char}
                  </span>
                )
              })}

              {/* Extra chars typed beyond word length */}
              {isActive && inputVal.length > word.length &&
                inputVal.slice(word.length).split('').map((ch, ei) => (
                  <span key={`x${ei}`} className="text-danger/80">{ch}</span>
                ))
              }

              {/* Cursor at end of word */}
              {isActive && inputVal.length >= word.length && (
                <span className="absolute -right-[3px] top-[-2px] bottom-[-2px] w-[2px] bg-brand animate-pulse rounded-full" />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────
function StatItem({ label, value, highlight }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-2xl font-bold font-mono tabular-nums ${highlight ? 'text-brand' : 'text-ink'}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-ink-subtle font-medium">{label}</span>
    </div>
  )
}

// ── Duration pill ─────────────────────────────────────────────────────
function DurationPill({ seconds, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-brand text-white shadow-[0_0_12px_rgba(0,200,83,0.4)]'
          : 'text-ink-muted hover:text-ink hover:bg-white/5'
      }`}
    >
      {seconds}s
    </button>
  )
}

// ── Leaderboard table ─────────────────────────────────────────────────
const RANK_STYLE = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
}

function LeaderboardTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 size={20} className="text-brand animate-spin" />
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="py-10 text-center text-ink-muted text-sm">
        No scores yet — be the first to set a record!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-edge">
            {['#', 'Player', 'Department', 'WPM', 'Accuracy', 'Date'].map(h => (
              <th key={h} className="text-left py-2.5 px-3 text-ink-subtle font-medium text-[11px] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr
              key={row.userId}
              className="border-b border-edge/50 hover:bg-white/[0.02] transition-colors"
            >
              <td className="py-3 px-3">
                <span className={`font-bold font-mono ${RANK_STYLE[row.rank] ?? 'text-ink-muted'}`}>
                  {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className="font-medium text-ink">{row.username}</span>
              </td>
              <td className="py-3 px-3 text-ink-muted">{row.department}</td>
              <td className="py-3 px-3">
                <span className="font-bold text-brand font-mono">{row.wpm}</span>
              </td>
              <td className="py-3 px-3 text-ink-muted font-mono">{row.accuracy}%</td>
              <td className="py-3 px-3 text-ink-subtle">{formatShortDate(row.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Personal stats strip ──────────────────────────────────────────────
function PersonalStats({ stats, loading }) {
  return (
    <div className="glass border border-edge rounded-2xl p-5 flex flex-col sm:flex-row gap-6 sm:gap-0">
      {loading ? (
        <div className="flex-1 flex justify-center">
          <Loader2 size={18} className="text-brand animate-spin" />
        </div>
      ) : (
        <>
          <PersonalStat icon="⚡" label="Personal Best" value={`${stats?.bestWpm ?? 0} WPM`} />
          <div className="hidden sm:block w-px bg-edge mx-6" />
          <PersonalStat icon="🎯" label="Avg Accuracy" value={`${stats?.avgAccuracy ?? 0}%`} />
          <div className="hidden sm:block w-px bg-edge mx-6" />
          <PersonalStat icon="🎮" label="Games Played" value={stats?.totalGames ?? 0} />
        </>
      )}
    </div>
  )
}

function PersonalStat({ icon, label, value }) {
  return (
    <div className="flex-1 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-ink font-semibold text-base">{value}</p>
        <p className="text-ink-subtle text-xs">{label}</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export default function AGType() {
  const [phase,       setPhase]       = useState('idle')
  const [duration,    setDuration]    = useState(60)
  const [words,       setWords]       = useState(() => generateWords(200))
  const [wordIdx,     setWordIdx]     = useState(0)
  const [inputVal,    setInputVal]    = useState('')
  const [wordResults, setWordResults] = useState([])
  const [timeLeft,    setTimeLeft]    = useState(60)
  const [startTime,   setStartTime]   = useState(null)
  const [finalStats,  setFinalStats]  = useState(null)
  const [saveStatus,  setSaveStatus]  = useState('idle') // 'idle'|'saving'|'saved'|'error'

  const [leaderboard, setLeaderboard] = useState([])
  const [myStats,     setMyStats]     = useState(null)
  const [loadingLb,   setLoadingLb]   = useState(true)
  const [loadingMe,   setLoadingMe]   = useState(true)

  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // ── Load remote data ──────────────────────────────────────────────
  const fetchLeaderboard = useCallback(() => {
    setLoadingLb(true)
    getTypingLeaderboard()
      .then(r => setLeaderboard(r.data))
      .catch(() => {})
      .finally(() => setLoadingLb(false))
  }, [])

  const fetchMyStats = useCallback(() => {
    setLoadingMe(true)
    getMyTypingStats()
      .then(r => setMyStats(r.data))
      .catch(() => {})
      .finally(() => setLoadingMe(false))
  }, [])

  useEffect(() => {
    fetchLeaderboard()
    fetchMyStats()
  }, [fetchLeaderboard, fetchMyStats])

  // ── Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'running') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  // End game when timer hits 0
  useEffect(() => {
    if (phase === 'running' && timeLeft === 0) {
      endGame()
    }
  }, [timeLeft, phase]) // eslint-disable-line

  // ── Live stats ────────────────────────────────────────────────────
  const liveStats = useMemo(() => {
    if (phase === 'idle' || !startTime) return { wpm: 0, acc: 100, errors: 0 }
    const elapsed = Date.now() - startTime
    return {
      wpm:    calcWpm(wordResults, elapsed),
      acc:    calcAccuracy(wordResults),
      errors: wordResults.reduce((a, r) => a + r.errors, 0),
    }
  }, [wordResults, timeLeft, phase, startTime]) // timeLeft triggers every second

  // ── Game actions ──────────────────────────────────────────────────
  function startGame() {
    setPhase('running')
    setStartTime(Date.now())
  }

  function endGame() {
    clearInterval(timerRef.current)
    setPhase('finished')

    setWordResults(prev => {
      const elapsed  = duration * 1000
      const wpm      = calcWpm(prev, elapsed)
      const accuracy = calcAccuracy(prev)
      const errors   = prev.reduce((a, r) => a + r.errors, 0)

      const stats = {
        wpm,
        accuracy,
        errors,
        wordsTyped: prev.length,
        duration,
      }
      setFinalStats(stats)

      // Auto-save score
      setSaveStatus('saving')
      submitTypingScore(stats)
        .then(() => {
          setSaveStatus('saved')
          fetchLeaderboard()
          fetchMyStats()
        })
        .catch(() => setSaveStatus('error'))

      return prev
    })
  }

  function restart() {
    clearInterval(timerRef.current)
    setPhase('idle')
    setWords(generateWords(200))
    setWordIdx(0)
    setInputVal('')
    setWordResults([])
    setTimeLeft(duration)
    setStartTime(null)
    setFinalStats(null)
    setSaveStatus('idle')
  }

  function handleDurationChange(d) {
    if (phase !== 'idle') return
    setDuration(d)
    setTimeLeft(d)
  }

  // ── Input handling ────────────────────────────────────────────────
  const handleInput = useCallback((e) => {
    if (phase === 'finished') return

    const val = e.target.value

    // Start game on first character
    if (phase === 'idle' && val.trim()) {
      startGame()
    }

    if (val.endsWith(' ')) {
      const typed = val.trimEnd()
      if (!typed) { setInputVal(''); return }

      const target  = words[wordIdx]
      const correct = typed === target
      const errors  = wordErrors(typed, target)

      setWordResults(prev => [...prev, { typed, target, correct, errors }])
      setWordIdx(prev => prev + 1)
      setInputVal('')
    } else {
      setInputVal(val)
    }
  }, [phase, words, wordIdx])

  const handleKeyDown = useCallback((e) => {
    // Ctrl+R or Escape = restart
    if (e.key === 'Escape') { e.preventDefault(); restart() }
    // Tab = restart (common typing test shortcut)
    if (e.key === 'Tab')    { e.preventDefault(); restart() }
  }, []) // eslint-disable-line

  const focusInput = () => inputRef.current?.focus()

  // Auto-focus on mount
  useEffect(() => { focusInput() }, [])

  // ── Render ────────────────────────────────────────────────────────
  const isFocused = phase !== 'finished'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* ── Page header ── */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Keyboard size={20} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">AG Type</h2>
          <p className="text-ink-muted text-sm mt-0.5">Typing Championship — compete for the top spot</p>
        </div>
      </div>

      {/* ── Game card ── */}
      <div className="glass border border-edge rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">

          {/* FINISHED — results */}
          {phase === 'finished' && finalStats ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="p-8 flex flex-col items-center gap-6"
            >
              {/* Big WPM */}
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[72px] font-black font-mono leading-none text-brand tabular-nums"
                >
                  {finalStats.wpm}
                </motion.p>
                <p className="text-ink-subtle text-sm uppercase tracking-widest font-medium">words per minute</p>
              </div>

              {/* Result stats row */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="flex gap-8"
              >
                <StatItem label="Accuracy"   value={`${finalStats.accuracy}%`} />
                <StatItem label="Errors"     value={finalStats.errors} />
                <StatItem label="Words"      value={finalStats.wordsTyped} />
                <StatItem label="Duration"   value={`${finalStats.duration}s`} />
              </motion.div>

              {/* Save indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-sm"
              >
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 size={14} className="text-brand animate-spin" />
                    <span className="text-ink-muted">Saving to leaderboard…</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 size={14} className="text-brand" />
                    <span className="text-brand font-medium">Score saved!</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle size={14} className="text-danger" />
                    <span className="text-danger">Failed to save score</span>
                  </>
                )}
              </motion.div>

              {/* Play again */}
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={restart}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand/10 border border-brand/20
                           text-brand font-medium hover:bg-brand/20 transition-colors"
              >
                <RotateCcw size={15} />
                Play Again
              </motion.button>
            </motion.div>
          ) : (

            /* IDLE / RUNNING — typing area */
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6 flex flex-col gap-5"
            >
              {/* Top bar: duration picker OR live stats */}
              {phase === 'idle' ? (
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {DURATIONS.map(d => (
                      <DurationPill
                        key={d}
                        seconds={d}
                        active={duration === d}
                        onClick={() => handleDurationChange(d)}
                      />
                    ))}
                  </div>
                  <span className="text-ink-subtle text-xs">Tab or Esc to restart</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <StatItem label="WPM"      value={liveStats.wpm}    highlight />
                    <StatItem label="Accuracy" value={`${liveStats.acc}%`} />
                    <StatItem label="Errors"   value={liveStats.errors} />
                  </div>
                  {/* Timer */}
                  <div className="flex flex-col items-end gap-0.5">
                    <span className={`text-3xl font-black font-mono tabular-nums ${
                      timeLeft <= 5 ? 'text-danger animate-pulse' : 'text-brand'
                    }`}>
                      {timeLeft}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-ink-subtle">sec</span>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="divider-glow" />

              {/* Words display */}
              <div className="relative">
                <WordDisplay
                  words={words}
                  wordIdx={wordIdx}
                  inputVal={inputVal}
                  wordResults={wordResults}
                  phase={phase}
                  onFocus={focusInput}
                />

                {/* "Click to start" overlay — idle only */}
                {phase === 'idle' && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-surface/60 to-surface/90 cursor-pointer"
                    onClick={focusInput}
                  >
                    <p className="text-ink-muted text-sm select-none">
                      Click here or start typing to begin…
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden input — captures all keystrokes */}
              <input
                ref={inputRef}
                value={inputVal}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="absolute opacity-0 pointer-events-none w-0 h-0 top-0 left-0"
                aria-label="typing input"
              />

              {/* Restart hint during run */}
              {phase === 'running' && (
                <p className="text-center text-ink-subtle text-xs">
                  Tab · Esc to restart
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Personal stats ── */}
      <PersonalStats stats={myStats} loading={loadingMe} />

      {/* ── Global leaderboard ── */}
      <div className="glass border border-edge rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-edge flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Trophy size={15} className="text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Global Leaderboard</h3>
            <p className="text-ink-subtle text-[11px]">Best run per player — top 10</p>
          </div>
          <button
            onClick={fetchLeaderboard}
            className="ml-auto text-ink-subtle hover:text-ink transition-colors p-1.5 rounded-lg hover:bg-white/5"
            title="Refresh leaderboard"
          >
            <RotateCcw size={13} />
          </button>
        </div>
        <div className="px-2">
          <LeaderboardTable rows={leaderboard} loading={loadingLb} />
        </div>
      </div>
    </motion.div>
  )
}

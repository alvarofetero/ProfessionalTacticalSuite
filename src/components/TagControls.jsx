import { useState } from 'react'

const PRESET_TAGS = ['Goal', 'Assist', 'Shot', 'Foul', 'Corner', 'Offside', 'Substitution']
const ACTION_OPTIONS = ['Attack', 'Counterattack', 'Transition', 'Set piece', 'Open play']
const SIDE_OPTIONS = ['Left', 'Right', 'Center']
const DIRECTION_OPTIONS = ['For', 'Against', 'Neutral']

export default function TagControls({ currentTime = 0, tags = [], setTags, formatTime = (t) => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}`, createCutAt = null, createCutsZip = null, shapes = [] }){
  const [customTag, setCustomTag] = useState('')
  const [selectedAction, setSelectedAction] = useState('Attack')
  const [selectedSide, setSelectedSide] = useState('Right')
  const [selectedDirection, setSelectedDirection] = useState('For')
  const [selectedNotes, setSelectedNotes] = useState('')

  const addTag = (label) => {
    const newTag = {
      id: Date.now() + Math.random(),
      label,
      time: Math.round(currentTime),
      action: selectedAction,
      side: selectedSide,
      direction: selectedDirection,
      notes: selectedNotes.trim(),
    }
    setTags([...(tags || []), newTag])
  }

  const removeTag = (id) => {
    setTags((tags || []).filter(t => t.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tags</div>

      <div className="grid gap-2">
        {PRESET_TAGS.map((t) => (
          <button key={t} onClick={() => addTag(t)} className="text-left rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">{t}</button>
        ))}
      </div>

      <div className="pt-2 space-y-2">
        <div className="flex gap-2">
          <input value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder="Custom tag" className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200" />
          <button onClick={() => { if (customTag.trim()) { addTag(customTag.trim()); setCustomTag('') } }} className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold">Add</button>
        </div>

        <div className="grid gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Action</label>
          <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200">
            {ACTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Side</label>
            <select value={selectedSide} onChange={(e) => setSelectedSide(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200">
              {SIDE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Direction</label>
            <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200">
              {DIRECTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Notes</label>
          <input value={selectedNotes} onChange={(e) => setSelectedNotes(e.target.value)} placeholder="e.g. Cross to the far post" className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200" />
        </div>
      </div>

      <div className="pt-2">
        <div className="text-xs font-semibold text-slate-400">Assigned Tags</div>
        <div className="space-y-2 pt-1">
          {(tags || []).map(t => (
            <div key={t.id} className="rounded-lg bg-slate-900 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-slate-200">{t.label} <span className="ml-2 text-xs text-slate-400">{formatTime(t.time)}</span></div>
                <div className="flex items-center gap-2">
                  {createCutAt && <button onClick={() => createCutAt(t.time, t.label)} className="text-xs text-amber-300">Cut</button>}
                  <button onClick={() => removeTag(t.id)} className="text-xs text-rose-400">Remove</button>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {t.action && <span className="mr-2">{t.action}</span>}
                {t.side && <span className="mr-2">{t.side}</span>}
                {t.direction && <span className="mr-2">{t.direction}</span>}
                {t.notes && <span className="text-slate-300">• {t.notes}</span>}
              </div>
            </div>
          ))}
          {(!(tags || []).length) && <div className="text-sm text-slate-500">No tags yet</div>}
        </div>
      </div>

      {createCutsZip && (tags || []).length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => createCutsZip((tags || []).map(t => ({ time: t.time, label: t.label })), 'tags-cuts.zip')}
            className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white"
          >Export tags as ZIP</button>
        </div>
      )}

      {createCutsZip && shapes?.length > 0 && (
        <div className="pt-3 border-t border-slate-800 mt-3">
          <div className="text-xs font-semibold text-slate-400">Drawings</div>
          <div className="pt-2">
            <button
              onClick={() => createCutsZip(shapes.map((s, index) => ({ time: s.timestamp || s.time || 0, label: `shape-${index + 1}` })), 'drawings-cuts.zip')}
              className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white"
            >Export drawings as ZIP</button>
          </div>
        </div>
      )}
    </div>
  )
}

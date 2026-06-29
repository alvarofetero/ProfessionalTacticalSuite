import { useState } from 'react'

const PRESET_TAGS = ['Goal', 'Assist', 'Shot', 'Foul', 'Corner', 'Offside', 'Substitution']

export default function TagControls({ currentTime = 0, tags = [], setTags, formatTime = (t) => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}` }){
  const [customTag, setCustomTag] = useState('')

  const addTag = (label) => {
    const newTag = { id: Date.now() + Math.random(), label, time: Math.round(currentTime) }
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

      <div className="pt-2">
        <div className="flex gap-2">
          <input value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder="Custom tag" className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-200" />
          <button onClick={() => { if (customTag.trim()) { addTag(customTag.trim()); setCustomTag('') } }} className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold">Add</button>
        </div>
      </div>

      <div className="pt-2">
        <div className="text-xs font-semibold text-slate-400">Assigned Tags</div>
        <div className="space-y-2 pt-1">
          {(tags || []).map(t => (
            <div key={t.id} className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg">
              <div className="text-sm text-slate-200">{t.label} <span className="ml-2 text-xs text-slate-400">{formatTime(t.time)}</span></div>
              <button onClick={() => removeTag(t.id)} className="text-xs text-rose-400">Remove</button>
            </div>
          ))}
          {(!(tags || []).length) && <div className="text-sm text-slate-500">No tags yet</div>}
        </div>
      </div>
    </div>
  )
}

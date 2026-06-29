export default function VideoControls({duration, 
  currentTime, 
  isPlaying, 
  analysisTimestamps, 
  tags = [],
  togglePlayPause, 
  skipTime, 
  handleSeekChange, 
  formatTime}
){
const minuteScale = 5
const tickStep = minuteScale * 60
const labelStep = minuteScale * 60
const timelineMarks = Array.from({ length: Math.floor(duration / tickStep) + 1 }, (_, index) => index * tickStep)
const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

return(
     <div className="rounded-2xl border border-slate-800 bg-slate-950 p-1.5 shadow-xl space-y-1 lg:p-2">
            <div className="space-y-0.5">
              <div className="relative w-full flex items-center h-8 pt-1.5">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-700/70" />
                {duration > 0 && analysisTimestamps.map((ts) => (
                  <div key={`mark-${ts}`} className="absolute top-0 bottom-0 w-[4px] bg-sky-400 shadow-[0_0_8px_#38bdf8] z-20 rounded-full pointer-events-none" style={{ left: `${(ts / duration) * 100}%` }} />
                ))}
                {duration > 0 && (tags || []).map((tg) => (
                  <div key={`tag-${tg.id}`} className="absolute top-0 bottom-0 w-px bg-amber-400 z-15 pointer-events-none" style={{ left: `${(tg.time / Math.max(1,duration)) * 100}%` }}>
                    <div className="absolute -top-3 text-[10px] text-amber-300 whitespace-nowrap -translate-x-1/2">{tg.label}</div>
                  </div>
                ))}
                {duration > 0 && timelineMarks.map((time) => (
                  <div
                    key={`time-mark-${time}`}
                    className="absolute top-0 bottom-0 flex flex-col items-center"
                    style={{ left: `${(time / duration) * 100}%` }}
                  >
                    <div className="w-px h-3 bg-slate-500/80" />
                    <span className="mt-1 text-[10px] font-medium text-slate-400">{Math.floor(time / 60)}m</span>
                  </div>
                ))}
                <div
                  data-testid="timeline-progress-indicator"
                  className="absolute top-1/2 z-30 h-0 w-0 -translate-y-1/2 border-x-[7px] border-b-[10px] border-x-transparent border-b-sky-500 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)] pointer-events-none"
                  style={{ left: `calc(${Math.max(0, Math.min(100, progressPercent))}% - 7px)` }}
                />
                <input id="seek" type="range" min="0" max={duration || 100} step="0.01" value={currentTime} onChange={handleSeekChange} className="w-full h-2 appearance-none rounded-full bg-transparent accent-sky-500 cursor-pointer relative z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:w-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:w-0" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => skipTime(-5)} className="rounded-xl bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800">⏮ -5s</button>
                <button type="button" onClick={togglePlayPause} className={`rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-200 ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-sky-500 hover:bg-sky-400'}`}>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</button>
                <button type="button" onClick={() => skipTime(5)} className="rounded-xl bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800">+5s ⏭</button>
              </div>
              <div className="text-sm font-mono font-bold text-sky-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 w-fit">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
);
}

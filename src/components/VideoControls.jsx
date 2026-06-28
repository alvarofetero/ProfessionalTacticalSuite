export default function VideoControls({duration, 
    currentTime, 
    isPlaying, 
    analysisTimestamps, 
    togglePlayPause, 
    skipTime, 
    handleSeekChange, 
    formatTime}
){
return(
     <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl space-y-3">
            <div className="space-y-1">
              <div className="relative w-full flex items-center h-6">
                {duration > 0 && analysisTimestamps.map((ts) => (
                  <div key={`mark-${ts}`} className="absolute top-0 bottom-0 w-[4px] bg-sky-400 shadow-[0_0_8px_#38bdf8] z-10 rounded-full pointer-events-none" style={{ left: `${(ts / duration) * 100}%` }} />
                ))}
                <input id="seek" type="range" min="0" max={duration || 100} step="0.01" value={currentTime} onChange={handleSeekChange} className="w-full h-2 appearance-none rounded-full bg-slate-800 accent-sky-500 cursor-pointer relative z-20" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => skipTime(-5)} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">⏮ -5s</button>
                <button type="button" onClick={togglePlayPause} className={`rounded-xl px-6 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-sky-500 hover:bg-sky-400'}`}>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</button>
                <button type="button" onClick={() => skipTime(5)} className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">+5s ⏭</button>
              </div>
              <div className="text-sm font-mono font-bold text-sky-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
);
}

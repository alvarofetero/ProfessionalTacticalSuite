export default function Header({isRecording, handleToggleRecord, handleLoadVideo}){
    return(
       <header className="w-full border-b border-slate-800 bg-slate-950 px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Professional Tactical Suite v1.0.1</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">Video Drawing Studio HD</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="ToggleRecordButton"
              className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow transition-all duration-200 ${
                isRecording ? 'bg-red-600 hover:bg-red-500 animate-pulse ring-4 ring-red-950' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              onClick={handleToggleRecord}
            >
              {isRecording ? 'Stop & Export HD' : 'Export Video (16:9 HD)'}
            </button>
            <button type="button"  data-testid="LoadVideoButton" className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-sky-400 transition-colors"
             onClick={handleLoadVideo}>
              Load Match Video
            </button>
          </div>
        </div>
      </header>

    )
}
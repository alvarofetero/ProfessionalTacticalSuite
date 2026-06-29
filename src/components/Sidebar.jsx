        
    const ICONS = {
      select: <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />,
      arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
      line: <path d="M5 19L19 5" />,
      text: <path d="M4 7V4h16v3M9 20h6M12 4v16" />,
      rectangle: <path d="M4 4h16v16H4z" />,
      circle: <circle cx="12" cy="12" r="9" />,
     cylinder: (
      <g>
        <ellipse cx="12" cy="6" rx="9" ry="3" />
        <path d="M3 6v12c0 1.66 4 3 9 3s9-1.34 9-3V6" />
      </g>
    )
    };
    
    
    const tools = [
      { id: 'select', label: 'Select', iconKey: 'select' },
      { id: 'arrow', label: 'Arrow', iconKey: 'arrow' },
      { id: 'line', label: 'Line', iconKey: 'line' },
      { id: 'text', label: 'Text', iconKey: 'text' },
      { id: 'rectangle', label: 'Area', iconKey: 'rectangle' },
      { id: 'circle', label: 'Circle', iconKey: 'circle' },
      { id: 'cylinder', label: 'Cylinder', iconKey: 'cylinder' }
    ];
    
    export default function Sidebar({
        activeTool, setActiveTool,
        strokeColor, setStrokeColor,
        lineStyle, setLineStyle,
        bgColor, setBgColor,
        fillPattern, setFillPattern,
        opacity, setOpacity
        })
    {
    return(
    <aside className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-xl space-y-4 h-fit overflow-y-auto max-h-[85vh] lg:p-3">
      
          {/* Tools section */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Analysis Toolset</div>
            <div className="grid gap-1.5">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id)}
                  // className={`rounded-xl px-4 py-2 text-left text-xs font-semibold transition-all duration-150 ${
                     className={`flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTool === tool.id ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[tool.iconKey]}
                  </svg>
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Styles section */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Border & Line Style</div>
            
            <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-300">Color:</span>
              <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-7 h-7 rounded bg-transparent cursor-pointer border-0"/>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Stroke Type:</span>
              <select 
                value={lineStyle} 
                onChange={(e) => setLineStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="solid">━━━━ Sólida (Solid)</option>
                <option value="dashed">---- Discontinua (Dashed)</option>
                <option value="dotted">•••• Punteada (Dotted)</option>
              </select>
            </div>
          </div>

          {/* Fill and Patterns section */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fill & Area Pattern</div>
            
            <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-300">Fill Color:</span>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-7 h-7 rounded bg-transparent cursor-pointer border-0"/>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Internal Pattern:</span>
              <select 
                value={fillPattern} 
                onChange={(e) => setFillPattern(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="none">Color Liso Completo</option>
                <option value="grid">⚃ Cuadriculado Táctico</option>
                <option value="stripes">▤ Rayado / Listado</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>Opacity:</span>
                <span className="font-mono text-sky-400">{Math.round(opacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 accent-sky-500 rounded-lg cursor-pointer"/>
            </div>
          </div>
        </aside>
    );
    }
        
    
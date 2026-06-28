import { useRef, useState } from 'react'
import VideoPlayer from './components/VideoPlayer'
import CanvasOverlay from './components/CanvasOverlay'
import features from './config/features.json'
import Sidebar from './components/Sidebar';
import VideoControls from './components/VideoControls';



const milliseconds_to_wait = 8000

export default function App() {
  const [activeTool, setActiveTool] = useState('select')
  const [shapes, setShapes] = useState([])
  // CORRECCIÓN: Ajustamos la resolución nativa interna a un ratio real de 16:9 HD
  const [videoSize] = useState({ width: 1280, height: 720 })
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // ESTADOS DE ESTILO Y PERSONALIZACIÓN TRADICIONAL
  const [strokeColor, setStrokeColor] = useState('#f43f5e') 
  const [bgColor, setBgColor] = useState('#000000')         
  const [opacity, setOpacity] = useState(0.3)                

  // NUEVOS ESTADOS DE ESTILO AVANZADO
  const [lineStyle, setLineStyle] = useState('solid') // solid, dashed, dotted
  const [fillPattern, setFillPattern] = useState('none') // none (solid color), grid, stripes

  const isCurrentlyFrozenRef = useRef(false)
  const playerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  const handleTimeUpdate = (time) => {
    setCurrentTime(time)
    const hasShapeInThisFrame = shapes.some(s => Math.abs(s.timestamp - time) < 0.12)
    if (hasShapeInThisFrame && !isCurrentlyFrozenRef.current) {
      const videoElement = document.querySelector('video')
      if (videoElement && !videoElement.paused) {
        isCurrentlyFrozenRef.current = true
        videoElement.pause()
        setIsPlaying(false)

        setTimeout(() => {
          isCurrentlyFrozenRef.current = false
          if (videoElement) {
            videoElement.play().catch(() => {})
            setIsPlaying(true)
          }
        }, milliseconds_to_wait)
      }
    }
  }

  const togglePlayPause = () => {
    const videoElement = document.querySelector('video')
    if (!videoElement) return
    if (videoElement.paused) {
      videoElement.play().catch((err) => console.error(err))
      setIsPlaying(true)
    } else {
      videoElement.pause()
      setIsPlaying(false)
    }
  }

  const skipTime = (amount) => {
    const videoElement = document.querySelector('video')
    if (!videoElement) return
    isCurrentlyFrozenRef.current = false
    const nextTime = Math.max(0, Math.min(duration, videoElement.currentTime + amount))
    videoElement.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const handleSeekChange = (e) => {
    const targetTime = parseFloat(e.target.value)
    isCurrentlyFrozenRef.current = false
    playerRef.current?.seekTo?.(targetTime)
    setCurrentTime(targetTime)
  }

  const handleLoadVideo = () => {
    playerRef.current?.openFilePicker()
  }

  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60).toString().padStart(2, '0')
    const secs = Math.floor(timeInSeconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleToggleRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      recordedChunksRef.current = []
      const canvas = document.querySelector('canvas')
      if (!canvas) return alert('Workspace canvas not found.')

      const stream = canvas.captureStream(30)
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'analisis_tactico_avanzado.webm'
        a.click()
        URL.revokeObjectURL(url)
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      document.querySelector('video')?.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const analysisTimestamps = Array.from(new Set(shapes.map(s => Math.floor(s.timestamp))))

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-900 text-slate-100 antialiased">
      <header className="w-full border-b border-slate-800 bg-slate-950 px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Professional Tactical Suite v1.0</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">Video Drawing Studio HD</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow transition-all duration-200 ${
                isRecording ? 'bg-red-600 hover:bg-red-500 animate-pulse ring-4 ring-red-950' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              onClick={handleToggleRecord}
            >
              {isRecording ? 'Stop & Export HD' : 'Export Video (16:9 HD)'}
            </button>
            <button type="button" className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-sky-400 transition-colors" onClick={handleLoadVideo}>
              Load Match Video
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-[1600px] grid gap-5 p-5 lg:grid-cols-[320px_1fr]">
          <Sidebar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        lineStyle={lineStyle}
        setLineStyle={setLineStyle}
        bgColor={bgColor}
        setBgColor={setBgColor}
        fillPattern={fillPattern}
        setFillPattern={setFillPattern}
        opacity={opacity}
        setOpacity={setOpacity}
      />

        <section className="flex flex-col gap-1 h-full w-full min-w-0">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-xl flex items-center justify-center">
            {/* CORRECCIÓN: Forzamos el contenedor visual a mantener un estricto ratio 16:9 panorámico estándar */}
            <div className="relative w-full aspect-video max-h-[75vh] overflow-hidden rounded-xl bg-black border border-slate-900">
              <VideoPlayer ref={playerRef} width={videoSize.width} height={videoSize.height} onTimeUpdate={handleTimeUpdate} onDurationChange={setDuration} onPlayStateChange={setIsPlaying} />
              <CanvasOverlay
                videoWidth={videoSize.width}
                videoHeight={videoSize.height}
                activeTool={activeTool}
                shapes={shapes}
                setShapes={setShapes}
                currentTime={currentTime}
                strokeColor={strokeColor}
                bgColor={bgColor}
                opacity={opacity}
                lineStyle={lineStyle}
                fillPattern={fillPattern}
              />
            </div>
          </div>

         <VideoControls 
            duration={duration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            analysisTimestamps={analysisTimestamps}
            togglePlayPause={togglePlayPause}
            skipTime={skipTime}
            handleSeekChange={handleSeekChange}
            formatTime={formatTime}
         />
        </section>
      </main>
    </div>
  )
}
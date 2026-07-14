import { useRef, useState } from 'react'
import JSZip from 'jszip'
import VideoPlayer from './components/VideoPlayer'
import CanvasOverlay from './components/CanvasOverlay'
import features from './config/features.json'
import Sidebar from './components/Sidebar';
import TagControls from './components/TagControls';
import VideoControls from './components/VideoControls';
import Header from './components/Header';



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
      const playPromise = document.querySelector('video')?.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      setIsPlaying(true)
    }
  }

  const analysisTimestamps = Array.from(new Set(shapes.map(s => Math.floor(s.timestamp))))
  const [tags, setTags] = useState([])

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const createCutAt = async (time, label, options = {}) => {
    const { download = true } = options
    const videoElement = document.querySelector('video')
    const canvas = document.querySelector('canvas')
    if (!videoElement) {
      alert('No video loaded')
      return null
    }
    if (!canvas) {
      alert('No canvas available to capture')
      return null
    }
    if (!duration || duration <= 0) {
      alert('Video duration unknown')
      return null
    }

    const start = Math.max(0, time - 4)
    const end = Math.min(duration, time + 4)
    const wasPlaying = !videoElement.paused

    await new Promise((resolve) => {
      const onSeeked = () => {
        videoElement.removeEventListener('seeked', onSeeked)
        resolve()
      }
      videoElement.addEventListener('seeked', onSeeked)
      try { videoElement.currentTime = start } catch { resolve() }
    })

    try { await videoElement.play() } catch (e) {}

    const stream = canvas.captureStream(30)
    let recorder
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
    } catch (e) {
      try {
        recorder = new MediaRecorder(stream)
      } catch (err) {
        alert('Recording not supported in this browser')
        return null
      }
    }

    const recorded = []
    recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) recorded.push(ev.data) }

    const stopPromise = new Promise((resolve) => {
      recorder.onstop = () => resolve()
    })

    recorder.start()
    const ms = Math.round((end - start) * 1000)
    await sleep(ms + 300)
    recorder.stop()
    await stopPromise

    const blob = new Blob(recorded, { type: 'video/webm' })

    if (download) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(label || 'cut').replace(/[^a-z0-9-_]+/gi, '_')}_${Math.round(start)}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }

    if (!wasPlaying) videoElement.pause()
    return blob
  }

  const createCutsZip = async (cuts, zipName = 'video-cuts.zip') => {
    const zip = new JSZip()
    const blobs = []

    for (const cut of cuts) {
      const blob = await createCutAt(cut.time, cut.label, { download: false })
      if (blob) blobs.push({ blob, label: cut.label, time: cut.time })
    }

    blobs.forEach((item, index) => {
      const safeName = `${(item.label || 'cut').replace(/[^a-z0-9-_]+/gi, '_')}_${Math.round(item.time)}_${index + 1}.webm`
      zip.file(safeName, item.blob)
    })

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = zipName
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-900 text-slate-100 antialiased">
    
      <Header isRecording = {isRecording} handleToggleRecord={handleToggleRecord} handleLoadVideo={handleLoadVideo} />

      <main className="flex-1 w-full grid gap-2 p-1.5 sm:p-2 lg:grid-cols-[280px_minmax(0,1fr)_220px] lg:gap-3 lg:p-3">
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
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-1 shadow-xl flex items-center justify-center sm:p-1.5 lg:p-2">
            {/* CORRECCIÓN: Forzamos el contenedor visual a mantener un estricto ratio 16:9 panorámico estándar */}
            <div className="relative w-full aspect-video max-h-[72vh] sm:max-h-[70vh] lg:max-h-[68vh] overflow-hidden rounded-xl bg-black border border-slate-900">
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
          tags={tags}
            togglePlayPause={togglePlayPause}
            skipTime={skipTime}
            handleSeekChange={handleSeekChange}
            formatTime={formatTime}
         />
        </section>

        {/* <aside className="rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-xl h-fit hidden lg:block">
          <TagControls currentTime={currentTime} tags={tags} setTags={setTags} formatTime={formatTime} createCutAt={createCutAt} createCutsZip={createCutsZip} shapes={shapes} />
        </aside> */}
      </main>
    </div>
  )
}
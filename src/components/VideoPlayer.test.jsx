import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import VideoPlayer from './VideoPlayer'

describe('VideoPlayer Component', () => {
  const defaultProps = {
    onTimeUpdate: vi.fn(),
    onDurationChange: vi.fn(),
    onPlayStateChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock global de URL.createObjectURL para que no explote en Node.js/JSDOM
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-video-url')
  })

  it('debe mostrar el mensaje de marcador de posición si no hay video cargado', () => {
    render(<VideoPlayer {...defaultProps} />)
    
    expect(
      screen.getByText(/No video loaded. Click "Load Match Video" above./i)
    ).toBeInTheDocument()
  })

  it('debe exponer openFilePicker a través de useImperativeHandle', () => {
    const playerRef = createRef()

    // 1. Renderizamos y extraemos el 'container' propio de este test
    const { container } = render(<VideoPlayer {...defaultProps} ref={playerRef} />)

    // 2. CORRECCIÓN: Buscamos el input dentro de 'container', NO en 'document'
    const input = container.querySelector('input[type="file"]')

    // Aseguramos que el input realmente existe antes de espiarlo
    expect(input).not.toBeNull()

    
    // Espiamos el método click nativo del input de archivos
    const clickSpy = vi.spyOn(input, 'click')

    
    // Ejecutamos la función que expone el ref imperativo
    playerRef.current.openFilePicker()

    expect(clickSpy).toHaveBeenCalled()
  })

  it('debe cargar el archivo de video e invocar onPlayStateChange(false)', () => {
    
    // 1. Extraemos 'container' al renderizar
    const { container } = render(<VideoPlayer {...defaultProps} />)
    
    // 2. CORRECCIÓN: Buscamos el input dentro de 'container' de forma local
    const input = container.querySelector('input[type="file"]')

    // Aseguramos que no sea null antes de lanzar el evento
    expect(input).not.toBeNull()

    const fakeFile = new File(['(video-content)'], 'partido_tactico.mp4', { type: 'video/mp4' })

    // Simulamos que el usuario selecciona un archivo
    fireEvent.change(input, { target: { files: [fakeFile] } })

    const video = screen.getByTestId('main-video-element')
    
    expect(video.src).toContain('blob:http://localhost/fake-video-url')
    expect(defaultProps.onPlayStateChange).toHaveBeenCalledWith(false)
    
    // El texto informativo de "No video loaded" debe desaparecer
    expect(
      screen.queryByText(/No video loaded. Click "Load Match Video" above./i)
    ).not.toBeInTheDocument()
  })

  it('debe exponer seekTo a través de useImperativeHandle y cambiar el currentTime', () => {
    const playerRef = createRef()
    render(<VideoPlayer {...defaultProps} ref={playerRef} />)

    const video = screen.getByTestId('main-video-element')

    // Forzamos el salto de tiempo a los 45 segundos usando el ref
    playerRef.current.seekTo(45)

    expect(video.currentTime).toBe(45)
  })

  it('debe disparar los eventos onPlay, onPause y onTimeUpdate del elemento HTML video', () => {
    render(<VideoPlayer {...defaultProps} />)
    
    const video = screen.getByTestId('main-video-element')

    // 1. Simular Evento de Reproducción
    fireEvent.play(video)
    expect(defaultProps.onPlayStateChange).toHaveBeenCalledWith(true)

    // 2. Simular Evento de Pausa
    fireEvent.pause(video)
    expect(defaultProps.onPlayStateChange).toHaveBeenCalledWith(false)

    // 3. Simular Evento de actualización de tiempo (forzando una posición de tiempo)
    video.currentTime = 12.5
    fireEvent.timeUpdate(video)
    expect(defaultProps.onTimeUpdate).toHaveBeenCalledWith(12.5)
  })
})
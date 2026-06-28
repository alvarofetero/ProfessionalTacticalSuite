import { render, screen, fireEvent } from '@testing-library/react'
import {describe, it, expect, beforeEach} from 'vitest'
import App from './App'


// Mock global de MediaRecorder para la lógica de grabación de App.jsx
beforeEach(() => {
  vi.stubGlobal('MediaRecorder', vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    ondataavailable: vi.fn(),
    onstop: vi.fn()
  })))
  
  // Simulamos que el elemento canvas capturado tiene stream
  HTMLCanvasElement.prototype.captureStream = vi.fn(() => ({}))
})


describe('App Integration', ()=> {

  it('should change the active tool when a button is clicked on the Sidebar', () => {
      render(<App />);
      
      // 1. Search for a tool button on the Sidebar
      const arrowButton = screen.getByText('Arrow');
      
      // 2. Simulate a click
      fireEvent.click(arrowButton);
      
      // 3. Verify  that the change is reflcted (ex.: button styl changed)
      // Now the button has the class "active"
      expect(arrowButton.className).toContain('bg-sky-500');
    });

  it('should activate the Recording status when the Record button in the header is clicked', () => {
    render(<App />)
    
    // 1. Localizamos el botón del Header recién extraído
    const recordButton = screen.getByTestId('ToggleRecordButton')
    
    // 2. Simulamos la acción del usuario
    fireEvent.click(recordButton);
    
    // 3. Verificamos la integración: el botón debe mutar al estado activo (red/pulse)
    expect(screen.getByText('Stop & Export HD')).toBeInTheDocument()
  })


});
 



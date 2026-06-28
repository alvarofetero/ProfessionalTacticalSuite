import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 1. Mock completo del Contexto de Canvas
// Esto soluciona errores como 'quadraticCurveTo is not a function'
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(), 
  clearRect: vi.fn(), 
  beginPath: vi.fn(),
  moveTo: vi.fn(), 
  lineTo: vi.fn(), 
  stroke: vi.fn(),
  fill: vi.fn(), 
  closePath: vi.fn(), 
  setLineDash: vi.fn(),
  drawImage: vi.fn(), 
  strokeText: vi.fn(), 
  fillText: vi.fn(),
  arc: vi.fn(), 
  ellipse: vi.fn(),
  quadraticCurveTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  // Propiedades de estilo para evitar errores al intentar setearlas
  set strokeStyle(value) {},
  set lineWidth(value) {},
  set fillStyle(value) {},
  set lineCap(value) {},
  set lineJoin(value) {}
}));

// 2. Mock del getBoundingClientRect
// Fundamental para que los cálculos de coordenadas (getCanvasCoords) no den 0
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 640, 
  height: 480, 
  top: 0, 
  left: 0, 
  bottom: 480, 
  right: 640
}));

// 3. Mocks para el ciclo de renderizado (RequestAnimationFrame)
// Esto evita que el loop de dibujo se ejecute infinitamente y consuma memoria en el test
vi.stubGlobal('requestAnimationFrame', vi.fn());
vi.stubGlobal('cancelAnimationFrame', vi.fn());

// 4. Mock adicional por si tu componente usa el objeto global de Video
// Opcional: si usas 'document.querySelector('video')', esto evita errores
document.querySelector = vi.fn().mockImplementation((selector) => {
  if (selector === 'video') {
    return {
      readyState: 4,
      paused: false,
      play: vi.fn(),
      pause: vi.fn()
    };
  }
  return null;
});
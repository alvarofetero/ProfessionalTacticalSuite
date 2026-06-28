import '@testing-library/jest-dom'
import { vi } from 'vitest'

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(),
  moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
  fill: vi.fn(), closePath: vi.fn(), setLineDash: vi.fn(),
  drawImage: vi.fn(),
  // Mock para el texto si lo usas
  fillText: vi.fn(),
}));

// Mock for getBoundingClientRect that is necesary for coordinates calcul
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 640, height: 480, top: 0, left: 0, bottom: 0, right: 0
}));
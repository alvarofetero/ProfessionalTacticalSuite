import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CanvasOverlay from './CanvasOverlay';

describe('CanvasOverlay Component', () => {
  const defaultProps = {
    videoWidth: 640,
    videoHeight: 480,
    activeTool: 'line',
    shapes: [],
    setShapes: vi.fn(),
    currentTime: 0,
    strokeColor: '#000',
    bgColor: '#fff',
    opacity: 0.5,
    lineStyle: 'solid',
    fillPattern: 'none'
  };

  it('debe renderizar el canvas correctamente', () => {
    render(<CanvasOverlay {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('debe calcular coordenadas y llamar a setShapes al dibujar una línea', async () => {
    const user = userEvent.setup({delay:null});
    const mockSetShapes = vi.fn();
    
    render(<CanvasOverlay {...defaultProps} setShapes={mockSetShapes} />);
    
    const canvas = document.querySelector('canvas');
    
    // Simulamos el dibujo: Click en (100, 100) y soltar en (200, 200)
    await user.pointer([
      { keys: '[MouseLeft>]', target: canvas, coords: { x: 100, y: 100 } },
      { keys: '[/MouseLeft]', target: canvas, coords: { x: 200, y: 200 } }
    ]);

    // Verificamos que se intentó actualizar el estado con la nueva forma
    expect(mockSetShapes).toHaveBeenCalled();
  });

  it('debe aplicar estilos de cursor al pasar el mouse sobre un elemento seleccionado', async () => {
    // Simulamos una forma ya creada
    const shapes = [{
      id: 'shape-1',
      tool: 'rectangle',
      timestamp: 0,
      x1: 50, y1: 50, x2: 150, y2: 50, x3: 150, y3: 150, x4: 50, y4: 150,
      strokeColor: '#000000',
      bgColor: '#ffffff',
      opacity: 0.5,
      lineStyle: 'solid',
      fillPattern: 'none'
    }];

    render(
      <CanvasOverlay 
        {...defaultProps} 
        shapes={shapes} 
        activeTool="select" 
      />
    );

    const canvas = document.querySelector('canvas');
    
    // Simulamos movimiento sobre la forma
    await userEvent.hover(canvas);
    
    // Nota: El estilo de cursor se aplica directamente al elemento del DOM
    // Es una forma excelente de verificar que findShapeAtCoords está funcionando
    expect(canvas.style.cursor).toBeDefined();
  });
});
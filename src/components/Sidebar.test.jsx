import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import Sidebar from './Sidebar'

describe('Sidebar Component',
    ()=>{

        it('should show the correct opacity value', ()=>{
            render(<Sidebar opacity={0.5} />);
        expect(screen.getByText('50%')).toBeDefined();
        })

        it('should call setActiveTool when a tool button is clicked', () => {
            const mockSetActiveTool = vi.fn(); // create a spy function to check if it is called inside de component.
            render(<Sidebar activeTool="select" setActiveTool={mockSetActiveTool} />);
    
             const arrowButton = screen.getByText('Arrow');
            fireEvent.click(arrowButton);
    
        expect(mockSetActiveTool).toHaveBeenCalledWith('arrow');
  })
    }
 )
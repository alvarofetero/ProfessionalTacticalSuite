import { render, screen, fireEvent } from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import App from './App'


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

});
 



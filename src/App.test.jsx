import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

describe('App layout', () => {
   it('renders the top bar with the app title', () => {
     render(<App />)
     expect(screen.getByText(/Video Drawing Studio HD/i)).toBeInTheDocument()
   })

  // it('renders the main video workspace', () => {
  //   render(<App />)
  //   expect(screen.getByRole('region', { name: /video workspace/i })).toBeInTheDocument()
  // })

 

  
})

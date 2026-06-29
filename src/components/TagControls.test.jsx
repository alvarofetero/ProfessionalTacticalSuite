import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TagControls from './TagControls'

describe('TagControls Component', () => {
  it('calls setTags when preset tag is clicked', () => {
    const setTags = vi.fn()
    render(<TagControls currentTime={30} tags={[]} setTags={setTags} formatTime={(t) => `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}`} />)
    const button = screen.getByText('Goal')
    fireEvent.click(button)
    expect(setTags).toHaveBeenCalled()
  })

  it('adds a custom tag when Add clicked', () => {
    const setTags = vi.fn()
    render(<TagControls currentTime={45} tags={[]} setTags={setTags} />)
    const input = screen.getByPlaceholderText('Custom tag')
    fireEvent.change(input, { target: { value: 'Counter' } })
    const addBtn = screen.getByText('Add')
    fireEvent.click(addBtn)
    expect(setTags).toHaveBeenCalled()
  })
})

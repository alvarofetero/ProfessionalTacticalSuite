import {describe, it, expect, vi} from 'vitest'
import { render, screen, fireEvent} from '@testing-library/react'
import Header from './Header'
describe('Header Component', ()=>{

    const defaultProps = {
        isRecording: false,
        handleToggleRecord: vi.fn(),
        handleLoadVideo: vi.fn()
    }

    const TitleSuite = 'Professional Tactical Suite'
    const TitleSubModule = 'Video Drawing Studio HD'

    it('should render titles correctly', () => {
        render(<Header {...defaultProps} />)
    expect(screen.getByText(TitleSubModule)).toBeInTheDocument()
    expect(screen.getByText(/Professional Tactical Suite/i)).toBeInTheDocument()
    })

    it('should show eport button with normal style when it is not recording', () => {
        render(<Header {...defaultProps} isRecording={false} />)
    expect(screen.getByText('Export Video (16:9 HD)')).toBeInTheDocument()
    })

    it('should change the button text when isRecording is true', () => {
        render(<Header {...defaultProps} isRecording={true} />)
    expect(screen.getByText('Stop & Export HD')).toBeInTheDocument()
    })

    it('should call onLoadVideo method when "Load Match Video" button is clicked', () => {
    render(<Header {...defaultProps} />)
        const loadButton = screen.getByTestId('LoadVideoButton')
        fireEvent.click(loadButton)
    expect(defaultProps.handleLoadVideo).toHaveBeenCalledTimes(1)
    })

    it('should call onToggleRecord when the button Export/Record is clicked', () => {
        render(<Header {...defaultProps} />)
        const recordButton = screen.getByTestId('ToggleRecordButton')
        fireEvent.click(recordButton)
    expect(defaultProps.handleToggleRecord).toHaveBeenCalledTimes(1)
    })


})
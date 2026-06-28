import {render, screen, fireEvent} from '@testing-library/react'
import {deescrib, it, expect, vi, describe} from 'vitest'
import VideoControls from './VideoControls'
describe('VideoControls Component', ()=>
    {
        const mockAnalysisTimestapmps = [5, 10, 15];

        const defaultProps ={
            duration: 120,
            currentTime:30,
            isPlaying: false,
            analysisTimestamps: mockAnalysisTimestapmps,
            togglePlayPause: vi.fn(), 
            skipTime: vi.fn(), 
            handleSeekChange: vi.fn(), 
            formatTime: (time) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`
        };

        it('should render the currentTime and duration correctly', () => {
            render(<VideoControls {...defaultProps} />);
            // Verify the format to be "0:30 / 2:00"
        expect(screen.getByText(/0:30 \/ 2:00/)).toBeDefined();
        });

        it('should call togglePlayPause when Play/Pause button is clicked', () => {
            render(<VideoControls {...defaultProps} />);
            const playButton = screen.getByText(/PLAY/i);
            fireEvent.click(playButton);
        expect(defaultProps.togglePlayPause).toHaveBeenCalledTimes(1);
        });


        it('renders the playback controls at the bottom', () => {
             render(<VideoControls {...defaultProps} />)
             //screen.debug()
             //screen.logTestingPlaygroundURL()
        expect(screen.getByRole('button', { name: /-5s/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\+5s/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
        expect(screen.getByRole('slider')).toBeInTheDocument()
        });
    }
)
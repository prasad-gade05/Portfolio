import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TissueOverlay from './TissueOverlay'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style }) => (
    <div data-testid="tissue-canvas" style={style}>
      {children}
    </div>
  ),
}))

vi.mock('./TissuePaper', () => ({
  default: ({ isPinMode, onPinUsed, onPinReturned, resetKey }) => (
    <div>
      <span>{`pin-mode:${String(isPinMode)}`}</span>
      <span>{`reset:${resetKey}`}</span>
      <button type="button" onClick={onPinUsed}>
        Use Pin
      </button>
      <button type="button" onClick={onPinReturned}>
        Return Pin
      </button>
    </div>
  ),
}))

describe('TissueOverlay', () => {
  it('tracks theme, pin tray state, reset flow, and exit handling', { timeout: 10000 }, async () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const onExit = vi.fn()

    render(<TissueOverlay textureUrl="texture.png" onExit={onExit} />)

    expect(screen.getByTestId('tissue-canvas')).toHaveStyle({ background: '#0a0a0a' })
    expect(screen.getByText('pin-mode:false')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '📌' })).toHaveLength(4)

    fireEvent.click(screen.getAllByRole('button', { name: '📌' })[0])
    expect(screen.getByText('Click anywhere to place a pin')).toBeInTheDocument()
    expect(screen.getByText('pin-mode:true')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Use Pin' }))
    expect(screen.getByText('pin-mode:false')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '📌' })).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: 'Return Pin' }))
    expect(screen.getAllByRole('button', { name: '📌' })).toHaveLength(4)

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByText('reset:1')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '📌' })).toHaveLength(4)

    document.documentElement.setAttribute('data-theme', 'dark')
    await waitFor(() => {
      expect(screen.getByTestId('tissue-canvas')).toHaveStyle({ background: '#d4d4d4' })
    })

    fireEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })
})

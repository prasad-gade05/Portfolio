import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const { captureDOMMock, confettiMock } = vi.hoisted(() => ({
  captureDOMMock: vi.fn(),
  confettiMock: vi.fn(),
}))

vi.mock('canvas-confetti', () => ({
  default: confettiMock,
}))

vi.mock('./utils/domCapture', () => ({
  captureDOM: captureDOMMock,
}))

vi.mock('./components/Hero', () => ({
  default: ({ onStartDoodle }) => (
    <div>
      <button onClick={onStartDoodle}>Start doodle</button>
      <div>Hero mock</div>
    </div>
  ),
}))

vi.mock('./components/NeuralBackground', () => ({
  default: () => <div>Neural background mock</div>,
}))

vi.mock('./components/tissue/TissueOverlay', () => ({
  default: ({ textureUrl, onExit }) => (
    <div>
      <span>Tissue overlay mock</span>
      <span>{textureUrl}</span>
      <button onClick={onExit}>Exit tissue</button>
    </div>
  ),
}))

describe('App', () => {
  const originalGetElementById = document.getElementById.bind(document)

  beforeEach(() => {
    captureDOMMock.mockReset()
    confettiMock.mockReset()
  })

  afterEach(() => {
    document.getElementById = originalGetElementById
  })

  it('renders the main interactive surface', async () => {
    render(<App />)

    expect(screen.getByText('Hero mock')).toBeInTheDocument()
    expect(await screen.findByText('Neural background mock')).toBeInTheDocument()
    expect(screen.getByLabelText('Interactive portfolio')).toBeInTheDocument()
  })

  it('opens tissue mode after a successful DOM capture and closes on escape', async () => {
    captureDOMMock.mockResolvedValueOnce('data:image/png;base64,test')

    render(<App />)
    fireEvent.click(screen.getByText('Start doodle'))

    expect(captureDOMMock).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Tissue overlay mock')).toBeInTheDocument()
    expect(screen.getByText('data:image/png;base64,test')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Tissue overlay mock')).not.toBeInTheDocument()
    })
  })

  it('does nothing when the app content node is missing', async () => {
    document.getElementById = vi.fn((id) => {
      if (id === 'app-content') return null
      return originalGetElementById(id)
    })

    render(<App />)
    fireEvent.click(screen.getByText('Start doodle'))

    await waitFor(() => {
      expect(captureDOMMock).not.toHaveBeenCalled()
    })
    expect(screen.queryByText('Tissue overlay mock')).not.toBeInTheDocument()
  })

  it('fires confetti when the konami code is entered', () => {
    render(<App />)

    const sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]

    sequence.forEach((key) => fireEvent.keyDown(window, { key }))

    expect(confettiMock).toHaveBeenCalledTimes(5)
  })
})

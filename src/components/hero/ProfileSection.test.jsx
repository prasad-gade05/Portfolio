import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ProfileSection from './ProfileSection'

vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react')

  const makeComponent = (tag) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    )

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: (_, tag) => makeComponent(tag),
      },
    ),
  }
})

vi.mock('react-type-animation', () => ({
  TypeAnimation: () => <span>Typing Roles Mock</span>,
}))

vi.mock('./AnimatedName', () => ({
  default: () => <div>Animated Name Mock</div>,
}))

vi.mock('./CurrentTime', () => ({
  default: () => <div>Current Time Mock</div>,
}))

vi.mock('./HelpModal', () => ({
  default: ({ onClose }) => (
    <button onClick={onClose} type="button">
      Help Modal Mock
    </button>
  ),
}))

describe('ProfileSection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens and closes the help and profile modals', async () => {
    render(<ProfileSection />)

    expect(screen.getByText('Animated Name Mock')).toBeInTheDocument()
    expect(screen.getByText('Current Time Mock')).toBeInTheDocument()
    expect(screen.getByText('Typing Roles Mock')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /open help guide/i }))
    expect(screen.getByText('Help Modal Mock')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Help Modal Mock')).not.toBeInTheDocument()

    fireEvent.click(screen.getByAltText('Prasad Gade'))
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '×' }))
    expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument()
  })
})

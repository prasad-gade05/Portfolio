import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Hero from './Hero'

const selectTabByIndex = vi.fn()
const cycleTheme = vi.fn()

vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react')

  const makeComponent = (tag) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    )

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, { get: (_, tag) => makeComponent(tag) }),
  }
})

vi.mock('./ClickSparkle', () => ({
  default: () => <div>Click Sparkle Mock</div>,
}))

vi.mock('./hero/ProfileSection', () => ({
  default: ({ onOpenHelp, showHelpModal }) => (
    <div>
      <button type="button" onClick={onOpenHelp}>
        Open Help
      </button>
      {showHelpModal ? <div>Help Modal Mock</div> : null}
    </div>
  ),
}))

vi.mock('./hero/CodeCard', () => ({
  default: ({ onOpenResume }) => (
    <button type="button" onClick={onOpenResume}>
      Open Resume
    </button>
  ),
}))

vi.mock('./hero/SocialLinks', () => ({
  default: () => <div>Social Links Mock</div>,
}))

vi.mock('./hero/ContentTabs', () => ({
  default: ({ onOpenMinecraft, onStartDoodle, onBlogsActiveChange, onShortcutApiReady }) => {
    onShortcutApiReady?.({ cycleTheme, isBlocked: false, selectTabByIndex })

    return (
      <div>
        <button type="button" onClick={onOpenMinecraft}>
          Open Minecraft
        </button>
        <button type="button" onClick={onStartDoodle}>
          Start Doodle
        </button>
        <button type="button" onClick={() => onBlogsActiveChange(true)}>
          Activate Blogs
        </button>
      </div>
    )
  },
}))

vi.mock('./ResumeViewer', () => ({
  default: ({ pdfUrl, onClose }) => (
    <div>
      <span>{pdfUrl}</span>
      <button type="button" onClick={onClose}>
        Close Resume
      </button>
    </div>
  ),
}))

vi.mock('./MinecraftSkinViewer', () => ({
  default: ({ skinUrl }) => <div>{skinUrl}</div>,
}))

describe('Hero', () => {
  it('opens managed modals, handles escape, and updates blog mode classes', async () => {
    selectTabByIndex.mockReset()
    cycleTheme.mockReset()

    const onStartDoodle = vi.fn()
    const { container } = render(<Hero onStartDoodle={onStartDoodle} />)

    expect(screen.getByText('Click Sparkle Mock')).toBeInTheDocument()
    expect(screen.getByText('Open Help')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Activate Blogs'))
    expect(container.querySelector('.hero-grid')).toHaveClass('blogs-mode')
    expect(container.querySelector('.hero-left')).toHaveClass('blogs-hidden')

    fireEvent.click(screen.getByText('Open Resume'))
    expect(await screen.findByText('/Prasad_Gade_Resume.pdf')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close Resume'))
    expect(screen.queryByText('/Prasad_Gade_Resume.pdf')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Open Minecraft'))
    expect(await screen.findByText('/minecraft-skin.png')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('/minecraft-skin.png')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Start Doodle'))
    expect(onStartDoodle).toHaveBeenCalledTimes(1)
  })

  it('handles global keyboard shortcuts and ignores them while typing', async () => {
    selectTabByIndex.mockReset()
    cycleTheme.mockReset()

    render(<Hero onStartDoodle={vi.fn()} />)

    fireEvent.keyDown(document, { key: '?' })
    expect(screen.getByText('Help Modal Mock')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Help Modal Mock')).not.toBeInTheDocument()

    fireEvent.keyDown(document, { key: '2' })
    fireEvent.keyDown(document, { key: '0' })
    expect(selectTabByIndex).toHaveBeenNthCalledWith(1, 1)
    expect(selectTabByIndex).toHaveBeenNthCalledWith(2, 9)

    fireEvent.keyDown(document, { key: 'r' })
    expect(await screen.findByText('/Prasad_Gade_Resume.pdf')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('/Prasad_Gade_Resume.pdf')).not.toBeInTheDocument()

    fireEvent.keyDown(document, { key: 't' })
    expect(cycleTheme).toHaveBeenCalledTimes(1)

    const input = document.createElement('input')
    document.body.appendChild(input)

    fireEvent.keyDown(input, { key: '3' })
    fireEvent.keyDown(input, { key: '?' })

    expect(selectTabByIndex).toHaveBeenCalledTimes(2)
    expect(screen.queryByText('Help Modal Mock')).not.toBeInTheDocument()

    input.remove()
  })
})

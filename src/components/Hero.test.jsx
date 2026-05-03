import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Hero from './Hero'

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
  default: () => <div>Profile Section Mock</div>,
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
  default: ({ onOpenMinecraft, onStartDoodle, onBlogsActiveChange }) => (
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
  ),
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
    const onStartDoodle = vi.fn()
    const { container } = render(<Hero onStartDoodle={onStartDoodle} />)

    expect(screen.getByText('Click Sparkle Mock')).toBeInTheDocument()
    expect(screen.getByText('Profile Section Mock')).toBeInTheDocument()

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
})

import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ClickSparkle from './ClickSparkle'

vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react')

  const makeComponent = (tag) =>
    React.forwardRef(({ children, onAnimationComplete, ...props }, ref) =>
      React.createElement(
        tag,
        { ref, onAnimationEnd: onAnimationComplete, onMouseEnter: onAnimationComplete, ...props },
        children,
      ),
    )

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, { get: (_, tag) => makeComponent(tag) }),
  }
})

describe('ClickSparkle', () => {
  it('adds a sparkle on click and removes it after animation completion', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(123)
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const { container } = render(<ClickSparkle />)

    fireEvent.click(window, { clientX: 42, clientY: 84 })
    const sparkle = container.querySelector('.click-sparkle-container')

    expect(sparkle).toBeTruthy()
    expect(container.querySelectorAll('.click-sparkle-container')).toHaveLength(1)

    fireEvent.mouseEnter(sparkle)
    await waitFor(() => {
      expect(container.querySelector('.click-sparkle-container')).toBeNull()
    })
  })
})

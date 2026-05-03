import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import AnimatedName from './AnimatedName'

const { animateMock } = vi.hoisted(() => ({
  animateMock: vi.fn((from, to, options = {}) => {
    options.onUpdate?.(typeof to === 'number' ? to : 0)
    return {
      then: (callback) => Promise.resolve().then(callback),
      stop: vi.fn(),
    }
  }),
}))

vi.mock('framer-motion', async () => {
  const React = await vi.importActual('react')

  const makeComponent = (tag) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    )

  const createMotionValue = (initial = 0) => {
    let current = initial
    return {
      get: () => current,
      set: (next) => {
        current = next
      },
    }
  }

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy({}, { get: (_, tag) => makeComponent(tag) }),
    useMotionValue: createMotionValue,
    useSpring: (value) => value,
    animate: animateMock,
  }
})

describe('AnimatedName', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('cycles languages, responds to pointer movement, and starts idle animation', async () => {
    const { container } = render(<AnimatedName />)
    const nameContainer = container.querySelector('.animated-name-container')

    Object.defineProperty(nameContainer, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
      }),
    })

    expect(screen.getByText('GADE')).toBeInTheDocument()

    fireEvent.mouseMove(nameContainer, { clientX: 30, clientY: 20 })
    fireEvent.mouseLeave(nameContainer)

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    expect(screen.getByText('गडे')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(4000)
      await Promise.resolve()
    })

    expect(animateMock).toHaveBeenCalled()
    expect(container.querySelector('.ghost-cursor')).toBeInTheDocument()
  })
})

import { fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import NeuralBackground from './NeuralBackground'

describe('NeuralBackground', () => {
  let context

  beforeEach(() => {
    context = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      clearRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
    }

    HTMLCanvasElement.prototype.getContext = vi.fn(() => context)
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    window.innerWidth = 320
    window.innerHeight = 200
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('initializes the canvas, reacts to pointer events, and cleans up animation', () => {
    const { container, unmount } = render(<NeuralBackground />)

    const canvas = container.querySelector('canvas')
    expect(canvas.width).toBe(320)
    expect(canvas.height).toBe(200)
    expect(context.clearRect).toHaveBeenCalled()
    expect(context.arc).toHaveBeenCalled()

    fireEvent.mouseMove(window, { clientX: 50, clientY: 60 })
    fireEvent.mouseLeave(window)
    fireEvent(window, new Event('resize'))

    expect(requestAnimationFrame).toHaveBeenCalled()

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
  })
})

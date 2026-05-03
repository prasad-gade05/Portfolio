import { describe, expect, it } from 'vitest'

import { handleCardTilt, resetCardTilt } from './cardTilt'

describe('cardTilt utilities', () => {
  it('applies a perspective transform based on pointer position', () => {
    const card = {
      getBoundingClientRect: () => ({
        left: 10,
        top: 20,
        width: 200,
        height: 100,
      }),
      style: {},
    }

    handleCardTilt({
      clientX: 190,
      clientY: 40,
      currentTarget: card,
    })

    expect(card.style.transform).toContain('perspective(600px)')
    expect(card.style.transform).toContain('rotateX(15deg)')
    expect(card.style.transform).toContain('rotateY(20deg)')
    expect(card.style.transform).toContain('scale3d(1.03, 1.03, 1.03)')
  })

  it('clears the transform on reset', () => {
    const card = {
      style: {
        transform: 'something',
      },
    }

    resetCardTilt({
      currentTarget: card,
    })

    expect(card.style.transform).toBe('')
  })
})

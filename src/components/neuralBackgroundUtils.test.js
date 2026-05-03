import { describe, expect, it, vi } from 'vitest'
import {
  buildSpatialGrid,
  CONNECTION_DISTANCE,
  forEachNearbyPair,
  getParticleCount,
  MAX_PARTICLES,
} from './neuralBackgroundUtils'

describe('neuralBackgroundUtils', () => {
  it('caps particle count at the configured maximum', () => {
    expect(getParticleCount(0, 0)).toBe(0)
    expect(getParticleCount(400, 400)).toBe(8)
    expect(getParticleCount(8000, 8000)).toBe(MAX_PARTICLES)
  })

  it('groups particles into spatial cells', () => {
    const grid = buildSpatialGrid(
      [
        { x: 10, y: 10 },
        { x: 50, y: 50 },
        { x: 150, y: 10 },
      ],
      CONNECTION_DISTANCE,
    )

    expect(grid.get('0,0')).toEqual([0, 1])
    expect(grid.get('1,0')).toEqual([2])
  })

  it('iterates nearby pairs without emitting distant ones', () => {
    const callback = vi.fn()
    const particles = [
      { x: 0, y: 0 },
      { x: 60, y: 20 },
      { x: 110, y: 30 },
      { x: 300, y: 300 },
    ]

    forEachNearbyPair(particles, CONNECTION_DISTANCE, callback)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(particles[0], particles[1], expect.any(Number))
    expect(callback).toHaveBeenCalledWith(particles[0], particles[2], expect.any(Number))
    expect(callback).toHaveBeenCalledWith(particles[1], particles[2], expect.any(Number))
  })
})

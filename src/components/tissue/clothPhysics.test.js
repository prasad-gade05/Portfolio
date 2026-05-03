import { describe, expect, it } from 'vitest'

import { ClothSimulation } from './clothPhysics'

describe('ClothSimulation', () => {
  it('initializes the grid, bounds, and nearest-point lookup', () => {
    const sim = new ClothSimulation(4, 4, 2, 2)

    expect(sim.cols).toBe(3)
    expect(sim.rows).toBe(3)
    expect(sim.particleCount).toBe(9)
    expect(sim.constraintCount).toBeGreaterThan(0)
    expect(Array.from(sim.positions.slice(0, 3))).toEqual([-2, 2, 0])
    expect(sim.findNearest(-2, 2, 0)).toBe(0)
  })

  it('updates free particles, respects bounds, and resets state', () => {
    const sim = new ClothSimulation(4, 4, 1, 1)

    sim.setPosition(0, 10, 10, 0)
    sim.prevPositions[0] = 10
    sim.prevPositions[1] = 10
    sim.prevPositions[2] = 0

    sim.update()

    expect(sim.positions[0]).not.toBe(10)
    expect(sim.positions[1]).not.toBe(10)
    expect(Number.isFinite(sim.positions[0])).toBe(true)
    expect(Number.isFinite(sim.positions[1])).toBe(true)

    sim.pin(0)
    const pinnedY = sim.positions[1]
    sim.update()
    expect(sim.positions[1]).toBe(pinnedY)

    sim.unpin(0)
    sim.unpinAll()
    expect(Array.from(sim.pinned)).toEqual([0, 0, 0, 0])

    sim.reset()
    expect(Array.from(sim.positions.slice(0, 3))).toEqual([-2, 2, 0])
    expect(Array.from(sim.pinned)).toEqual([0, 0, 0, 0])
  })

  it('solves constraints for pinned and unpinned particles without crashing on zero distance', () => {
    const sim = new ClothSimulation(2, 2, 1, 1)

    sim.setPosition(0, -5, 1, 0)
    sim.setPosition(1, 5, 1, 0)
    sim.prevPositions.set(sim.positions)

    sim.pin(0)
    sim.update()
    expect(sim.positions[3]).toBeLessThan(5)

    sim.pin(1)
    const lockedX = sim.positions[3]
    sim.update()
    expect(sim.positions[3]).toBe(lockedX)

    sim.unpin(0)
    sim.unpin(1)
    sim.setPosition(0, 0, 0, 0)
    sim.setPosition(1, 0, 0, 0)
    sim.prevPositions.set(sim.positions)

    expect(() => sim.update()).not.toThrow()
  })
})

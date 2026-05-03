import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import TissuePaper from './TissuePaper'

const { clothInstances, frameCallbacks, domElement } = vi.hoisted(() => ({
  clothInstances: [],
  frameCallbacks: [],
  domElement: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
    }),
  },
}))

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    viewport: { width: 4, height: 4 },
    camera: {},
    gl: { domElement },
  }),
  useFrame: (callback) => {
    frameCallbacks.push(callback)
  },
}))

vi.mock('./clothPhysics', () => ({
  ClothSimulation: class MockClothSimulation {
    constructor() {
      this.positions = new Float32Array(12)
      this.prevPositions = new Float32Array(12)
      this.pinned = new Uint8Array(4)
      this.reset = vi.fn()
      this.update = vi.fn()
      this.findNearest = vi.fn(() => 0)
      this.pin = vi.fn((index) => {
        this.pinned[index] = 1
      })
      this.unpin = vi.fn((index) => {
        this.pinned[index] = 0
      })
      this.setPosition = vi.fn()
      clothInstances.push(this)
    }
  },
}))

describe('TissuePaper', () => {
  beforeEach(() => {
    frameCallbacks.length = 0
    clothInstances.length = 0
    domElement.addEventListener.mockClear()
    domElement.removeEventListener.mockClear()

    globalThis.Image = class {
      set src(value) {
        this._src = value
        this.onload?.()
      }
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads the texture, handles pin placement, and updates mesh geometry during frames', async () => {
    const onPinUsed = vi.fn()
    const onPinReturned = vi.fn()
    const { container, rerender, unmount } = render(
      <TissuePaper
        textureUrl="/texture.png"
        isPinMode
        onPinUsed={onPinUsed}
        onPinReturned={onPinReturned}
        resetKey={0}
      />,
    )

    await waitFor(() => {
      expect(container.querySelectorAll('mesh').length).toBeGreaterThan(1)
    })

    const cloth = clothInstances[0]
    const meshes = container.querySelectorAll('mesh')
    const paperMesh = meshes[1]

    fireEvent.pointerDown(paperMesh, {
      intersections: [{ point: { x: 0.5, y: 0.5, z: 0 } }],
      stopPropagation: vi.fn(),
    })

    paperMesh.geometry = {
      index: { array: new Uint16Array([0, 1, 2]) },
      attributes: {
        position: { array: new Float32Array(12), needsUpdate: false },
        normal: { array: new Float32Array(12), needsUpdate: false },
      },
    }

    await act(async () => {
      frameCallbacks.at(-1)?.()
    })

    expect(paperMesh.geometry.attributes.position.needsUpdate).toBe(true)
    expect(paperMesh.geometry.attributes.normal.needsUpdate).toBe(true)

    rerender(
      <TissuePaper
        textureUrl="/texture.png"
        isPinMode={false}
        onPinUsed={onPinUsed}
        onPinReturned={onPinReturned}
        resetKey={1}
      />,
    )

    expect(cloth.reset).toHaveBeenCalled()

    fireEvent(window, new PointerEvent('pointerup'))
    expect(onPinReturned).toHaveBeenCalledTimes(0)

    unmount()
    expect(domElement.removeEventListener).toHaveBeenCalled()
  })
})

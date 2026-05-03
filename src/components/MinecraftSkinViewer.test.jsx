import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import MinecraftSkinViewer from './MinecraftSkinViewer'

const { viewerInstances } = vi.hoisted(() => ({
  viewerInstances: [],
}))

vi.mock('skinview3d', () => {
  class IdleAnimation {
    update = vi.fn()
  }

  class FunctionAnimation {
    constructor(callback) {
      this.callback = callback
    }
  }

  class SkinViewer {
    constructor(options) {
      this.options = options
      this.camera = {
        position: {
          x: 0,
          z: 50,
          set: vi.fn(),
        },
      }
      this.controls = {}
      this.dispose = vi.fn()
      this.animation = null
      this.autoRotate = false
      this.autoRotateSpeed = 0
      this.fov = 0
      this.zoom = 0
      viewerInstances.push(this)
    }
  }

  return {
    SkinViewer,
    IdleAnimation,
    FunctionAnimation,
  }
})

describe('MinecraftSkinViewer', () => {
  it('creates the skin viewer, runs animation logic, and disposes on unmount', () => {
    const { unmount } = render(
      <MinecraftSkinViewer skinUrl="/skin.png" width={280} height={400} />,
    )

    const viewer = viewerInstances.at(-1)
    expect(viewer.options).toMatchObject({
      width: 280,
      height: 400,
      skin: '/skin.png',
    })
    expect(viewer.camera.position.set).toHaveBeenCalledWith(0, 0, 50)
    expect(viewer.controls).toMatchObject({
      enableRotate: true,
      enableZoom: true,
      enablePan: false,
    })
    expect(viewer.autoRotate).toBe(true)

    const jumpButton = screen.getByRole('button', { name: 'Jump!' })
    fireEvent.mouseEnter(jumpButton)
    expect(jumpButton.style.backgroundColor).toBe('rgba(0, 0, 0, 0.8)')
    fireEvent.mouseLeave(jumpButton)
    expect(jumpButton.style.backgroundColor).toBe('rgba(0, 0, 0, 0.6)')

    const player = {
      position: { y: 0 },
      parent: { rotation: { y: 0 } },
      skin: {
        leftLeg: { rotation: {} },
        rightLeg: { rotation: {} },
        leftArm: { rotation: {} },
        rightArm: { rotation: {} },
      },
    }

    viewer.animation.callback(player, 1, 0.1)
    expect(player.skin.rightArm.rotation.z).not.toBe(0)

    fireEvent.click(jumpButton)
    viewer.animation.callback(player, 2, 0.1)
    viewer.animation.callback(player, 2.5, 0.1)
    expect(player.position.y).toBeGreaterThan(0)

    unmount()
    expect(viewer.dispose).toHaveBeenCalledTimes(1)
  })
})

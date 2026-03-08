/**
 * Verlet-integration cloth physics engine.
 * Models a grid of particles connected by structural, shear, and bend constraints.
 */
export class ClothSimulation {
  constructor(width, height, segmentsX, segmentsY) {
    this.segmentsX = segmentsX
    this.segmentsY = segmentsY
    this.cols = segmentsX + 1
    this.rows = segmentsY + 1
    this.particleCount = this.cols * this.rows

    this.positions = new Float32Array(this.particleCount * 3)
    this.prevPositions = new Float32Array(this.particleCount * 3)
    this.pinned = new Uint8Array(this.particleCount)
    this.constraints = []

    this.gravity = -0.0015
    this.damping = 0.985
    this.iterations = 5
    this.floorY = -height / 2
    this.ceilY = height / 2
    this.wallL = -width / 2
    this.wallR = width / 2

    this._init(width, height)
  }

  _init(width, height) {
    const stepX = width / this.segmentsX
    const stepY = height / this.segmentsY

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const idx = (j * this.cols + i) * 3
        this.positions[idx] = (i - this.segmentsX / 2) * stepX
        this.positions[idx + 1] = (this.segmentsY / 2 - j) * stepY
        this.positions[idx + 2] = 0

        this.prevPositions[idx] = this.positions[idx]
        this.prevPositions[idx + 1] = this.positions[idx + 1]
        this.prevPositions[idx + 2] = this.positions[idx + 2]
      }
    }

    // Structural constraints (horizontal + vertical neighbors)
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const idx = j * this.cols + i

        if (i < this.cols - 1) {
          this.constraints.push({ a: idx, b: idx + 1, rest: stepX })
        }
        if (j < this.rows - 1) {
          this.constraints.push({ a: idx, b: idx + this.cols, rest: stepY })
        }

        // Shear constraints (diagonals)
        if (i < this.cols - 1 && j < this.rows - 1) {
          const diagDist = Math.sqrt(stepX * stepX + stepY * stepY)
          this.constraints.push({ a: idx, b: idx + this.cols + 1, rest: diagDist })
          this.constraints.push({ a: idx + 1, b: idx + this.cols, rest: diagDist })
        }

        // Bend constraints (skip one neighbor for stiffness)
        if (i < this.cols - 2) {
          this.constraints.push({ a: idx, b: idx + 2, rest: stepX * 2 })
        }
        if (j < this.rows - 2) {
          this.constraints.push({ a: idx, b: idx + this.cols * 2, rest: stepY * 2 })
        }
      }
    }
  }

  update() {
    // Verlet integration step
    for (let i = 0; i < this.particleCount; i++) {
      if (this.pinned[i]) continue

      const idx = i * 3

      const vx = (this.positions[idx] - this.prevPositions[idx]) * this.damping
      const vy = (this.positions[idx + 1] - this.prevPositions[idx + 1]) * this.damping
      const vz = (this.positions[idx + 2] - this.prevPositions[idx + 2]) * this.damping

      this.prevPositions[idx] = this.positions[idx]
      this.prevPositions[idx + 1] = this.positions[idx + 1]
      this.prevPositions[idx + 2] = this.positions[idx + 2]

      this.positions[idx] += vx
      this.positions[idx + 1] += vy + this.gravity
      this.positions[idx + 2] += vz
    }

    // Boundary collision — keep every particle inside the viewport
    for (let i = 0; i < this.particleCount; i++) {
      if (this.pinned[i]) continue
      const idx = i * 3

      if (this.positions[idx + 1] < this.floorY) {
        this.positions[idx + 1] = this.floorY
        this.prevPositions[idx + 1] = this.floorY
      }
      if (this.positions[idx + 1] > this.ceilY) {
        this.positions[idx + 1] = this.ceilY
        this.prevPositions[idx + 1] = this.ceilY
      }
      if (this.positions[idx] < this.wallL) {
        this.positions[idx] = this.wallL
        this.prevPositions[idx] = this.wallL
      }
      if (this.positions[idx] > this.wallR) {
        this.positions[idx] = this.wallR
        this.prevPositions[idx] = this.wallR
      }
    }

    // Constraint resolution
    for (let k = 0; k < this.iterations; k++) {
      for (let c = 0; c < this.constraints.length; c++) {
        const constraint = this.constraints[c]
        const ia = constraint.a * 3
        const ib = constraint.b * 3

        const dx = this.positions[ib] - this.positions[ia]
        const dy = this.positions[ib + 1] - this.positions[ia + 1]
        const dz = this.positions[ib + 2] - this.positions[ia + 2]

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 0.0001) continue

        const diff = (dist - constraint.rest) / dist
        const pinnedA = this.pinned[constraint.a]
        const pinnedB = this.pinned[constraint.b]

        if (pinnedA && pinnedB) continue

        if (pinnedA) {
          this.positions[ib] -= dx * diff
          this.positions[ib + 1] -= dy * diff
          this.positions[ib + 2] -= dz * diff
        } else if (pinnedB) {
          this.positions[ia] += dx * diff
          this.positions[ia + 1] += dy * diff
          this.positions[ia + 2] += dz * diff
        } else {
          const half = diff * 0.5
          this.positions[ia] += dx * half
          this.positions[ia + 1] += dy * half
          this.positions[ia + 2] += dz * half
          this.positions[ib] -= dx * half
          this.positions[ib + 1] -= dy * half
          this.positions[ib + 2] -= dz * half
        }
      }
    }
  }

  setPosition(index, x, y, z) {
    const idx = index * 3
    this.positions[idx] = x
    this.positions[idx + 1] = y
    this.positions[idx + 2] = z
  }

  pin(index) {
    this.pinned[index] = 1
  }

  unpin(index) {
    this.pinned[index] = 0
  }

  unpinAll() {
    this.pinned.fill(0)
  }

  reset() {
    const w = this.wallR - this.wallL
    const h = this.ceilY - this.floorY
    const stepX = w / this.segmentsX
    const stepY = h / this.segmentsY

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const idx = (j * this.cols + i) * 3
        this.positions[idx] = (i - this.segmentsX / 2) * stepX
        this.positions[idx + 1] = (this.segmentsY / 2 - j) * stepY
        this.positions[idx + 2] = 0

        this.prevPositions[idx] = this.positions[idx]
        this.prevPositions[idx + 1] = this.positions[idx + 1]
        this.prevPositions[idx + 2] = this.positions[idx + 2]
      }
    }
    this.pinned.fill(0)
  }

  findNearest(x, y, z) {
    let minDist = Infinity
    let minIdx = -1

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3
      const dx = this.positions[idx] - x
      const dy = this.positions[idx + 1] - y
      const dz = this.positions[idx + 2] - z
      const dist = dx * dx + dy * dy + dz * dz

      if (dist < minDist) {
        minDist = dist
        minIdx = i
      }
    }

    return minIdx
  }
}

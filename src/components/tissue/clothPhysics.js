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
    // SoA constraint storage — flat typed arrays for cache-friendly hot-loop access
    const structH = segmentsX * (segmentsY + 1)
    const structV = (segmentsX + 1) * segmentsY
    const shearC = segmentsX * segmentsY * 2
    const bendH = Math.max(0, segmentsX - 1) * (segmentsY + 1)
    const bendV = (segmentsX + 1) * Math.max(0, segmentsY - 1)
    const maxConstraints = structH + structV + shearC + bendH + bendV
    this.constraintA = new Uint16Array(maxConstraints)
    this.constraintB = new Uint16Array(maxConstraints)
    this.constraintRest = new Float32Array(maxConstraints)
    this.constraintCount = 0

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

    const diagDist = Math.sqrt(stepX * stepX + stepY * stepY)
    const cA = this.constraintA
    const cB = this.constraintB
    const cR = this.constraintRest
    const cols = this.cols
    let ci = 0

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i

        if (i < cols - 1) {
          cA[ci] = idx; cB[ci] = idx + 1; cR[ci] = stepX; ci++
        }
        if (j < this.rows - 1) {
          cA[ci] = idx; cB[ci] = idx + cols; cR[ci] = stepY; ci++
        }
        if (i < cols - 1 && j < this.rows - 1) {
          cA[ci] = idx; cB[ci] = idx + cols + 1; cR[ci] = diagDist; ci++
          cA[ci] = idx + 1; cB[ci] = idx + cols; cR[ci] = diagDist; ci++
        }
        if (i < cols - 2) {
          cA[ci] = idx; cB[ci] = idx + 2; cR[ci] = stepX * 2; ci++
        }
        if (j < this.rows - 2) {
          cA[ci] = idx; cB[ci] = idx + cols * 2; cR[ci] = stepY * 2; ci++
        }
      }
    }
    this.constraintCount = ci
  }

  update() {
    const pos = this.positions
    const prev = this.prevPositions
    const pinned = this.pinned
    const count = this.particleCount
    const gravity = this.gravity
    const damping = this.damping
    const floorY = this.floorY
    const ceilY = this.ceilY
    const wallL = this.wallL
    const wallR = this.wallR

    // Merged Verlet integration + boundary collision (single pass)
    for (let i = 0; i < count; i++) {
      if (pinned[i]) continue

      const idx = i * 3

      const vx = (pos[idx] - prev[idx]) * damping
      const vy = (pos[idx + 1] - prev[idx + 1]) * damping
      const vz = (pos[idx + 2] - prev[idx + 2]) * damping

      prev[idx] = pos[idx]
      prev[idx + 1] = pos[idx + 1]
      prev[idx + 2] = pos[idx + 2]

      let px = pos[idx] + vx
      let py = pos[idx + 1] + vy + gravity
      let pz = pos[idx + 2] + vz

      if (py < floorY) { py = floorY; prev[idx + 1] = floorY }
      else if (py > ceilY) { py = ceilY; prev[idx + 1] = ceilY }
      if (px < wallL) { px = wallL; prev[idx] = wallL }
      else if (px > wallR) { px = wallR; prev[idx] = wallR }

      pos[idx] = px
      pos[idx + 1] = py
      pos[idx + 2] = pz
    }

    // SoA constraint resolution
    const cA = this.constraintA
    const cB = this.constraintB
    const cR = this.constraintRest
    const cCount = this.constraintCount
    const iterations = this.iterations

    for (let k = 0; k < iterations; k++) {
      for (let c = 0; c < cCount; c++) {
        const a = cA[c]
        const b = cB[c]
        const ia = a * 3
        const ib = b * 3

        const dx = pos[ib] - pos[ia]
        const dy = pos[ib + 1] - pos[ia + 1]
        const dz = pos[ib + 2] - pos[ia + 2]

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 0.0001) continue

        const diff = (dist - cR[c]) / dist
        const pA = pinned[a]
        const pB = pinned[b]

        if (pA && pB) continue

        if (pA) {
          pos[ib] -= dx * diff
          pos[ib + 1] -= dy * diff
          pos[ib + 2] -= dz * diff
        } else if (pB) {
          pos[ia] += dx * diff
          pos[ia + 1] += dy * diff
          pos[ia + 2] += dz * diff
        } else {
          const half = diff * 0.5
          pos[ia] += dx * half
          pos[ia + 1] += dy * half
          pos[ia + 2] += dz * half
          pos[ib] -= dx * half
          pos[ib + 1] -= dy * half
          pos[ib + 2] -= dz * half
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
    const pos = this.positions
    const count = this.particleCount
    let minDist = Infinity
    let minIdx = -1

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const dx = pos[idx] - x
      const dy = pos[idx + 1] - y
      const dz = pos[idx + 2] - z
      const dist = dx * dx + dy * dy + dz * dz

      if (dist < minDist) {
        minDist = dist
        minIdx = i
      }
    }

    return minIdx
  }
}

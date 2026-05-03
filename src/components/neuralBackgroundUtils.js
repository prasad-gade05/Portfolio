export const CONNECTION_DISTANCE = 120
export const PARTICLE_AREA_RATIO = 20000
export const MAX_PARTICLES = 140

export const getParticleCount = (width, height) => {
  const count = Math.floor((width * height) / PARTICLE_AREA_RATIO)
  return Math.max(0, Math.min(MAX_PARTICLES, count))
}

const getCellKey = (x, y, cellSize) => {
  const cellX = Math.floor(x / cellSize)
  const cellY = Math.floor(y / cellSize)
  return `${cellX},${cellY}`
}

export const buildSpatialGrid = (particles, cellSize) => {
  const grid = new Map()

  particles.forEach((particle, index) => {
    const key = getCellKey(particle.x, particle.y, cellSize)
    const existing = grid.get(key)

    if (existing) {
      existing.push(index)
      return
    }

    grid.set(key, [index])
  })

  return grid
}

const FORWARD_NEIGHBOR_OFFSETS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 1],
]

export const forEachNearbyPair = (particles, maxDistance, callback) => {
  const grid = buildSpatialGrid(particles, maxDistance)
  const maxDistanceSquared = maxDistance * maxDistance

  grid.forEach((indices, key) => {
    for (let i = 0; i < indices.length; i += 1) {
      const particleIndex = indices[i]
      const particle = particles[particleIndex]

      for (let j = i + 1; j < indices.length; j += 1) {
        const otherParticle = particles[indices[j]]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distanceSquared = dx * dx + dy * dy

        if (distanceSquared < maxDistanceSquared) {
          callback(particle, otherParticle, Math.sqrt(distanceSquared))
        }
      }
    }

    const [cellX, cellY] = key.split(',').map(Number)

    FORWARD_NEIGHBOR_OFFSETS.forEach(([offsetX, offsetY]) => {
      const neighborKey = `${cellX + offsetX},${cellY + offsetY}`
      const neighborIndices = grid.get(neighborKey)

      if (!neighborIndices) {
        return
      }

      indices.forEach((particleIndex) => {
        const particle = particles[particleIndex]

        neighborIndices.forEach((neighborIndex) => {
          const otherParticle = particles[neighborIndex]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distanceSquared = dx * dx + dy * dy

          if (distanceSquared < maxDistanceSquared) {
            callback(particle, otherParticle, Math.sqrt(distanceSquared))
          }
        })
      })
    })
  })
}

import { useEffect, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import confetti from 'canvas-confetti'
import './App.css'

// Components
import Hero from './components/Hero'

const NeuralBackground = lazy(() => import('./components/NeuralBackground'))

function App() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ]
    const hesoyamCode = ['h', 'e', 's', 'o', 'y', 'a', 'm']
    let keys = []

    const handleKeyDown = (e) => {
      keys.push(e.key)
      if (keys.length > konamiCode.length) {
        keys.shift()
      }

      const checkCode = (code) => {
        if (keys.length < code.length) return false
        const recentKeys = keys.slice(-code.length)
        return recentKeys.every((key, index) => key.toLowerCase() === code[index].toLowerCase())
      }

      if (checkCode(konamiCode) || checkCode(hesoyamCode)) {
        const count = 200
        const defaults = { origin: { y: 0.7 } }

        const fire = (particleRatio, opts) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          })
        }

        fire(0.25, { spread: 26, startVelocity: 55 })
        fire(0.2, { spread: 60 })
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
        fire(0.1, { spread: 120, startVelocity: 45 })

        keys = []
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app">
      <motion.div
        key="content"
        className="content-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cursor glow effect */}
        <motion.div 
          className="cursor-glow"
          style={{
            left: cursorX,
            top: cursorY,
          }}
        />
        
        {/* Neural Network Background */}
        <Suspense fallback={null}>
          <NeuralBackground />
        </Suspense>
        
        {/* Main Content - Single View */}
        <main>
          <Hero />
        </main>
      </motion.div>
    </div>
  )
}

export default App

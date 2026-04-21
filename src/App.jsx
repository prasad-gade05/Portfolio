import { useEffect, useState, lazy, Suspense, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import confetti from 'canvas-confetti'
import { captureDOM } from './utils/domCapture'
import './App.css'

// Components
import Hero from './components/Hero'

const NeuralBackground = lazy(() => import('./components/NeuralBackground'))
const TissueOverlay = lazy(() => import('./components/tissue/TissueOverlay'))

function App() {
  const [isTissueMode, setIsTissueMode] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY])

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ]
    const hesoyamCode = ['h', 'e', 's', 'o', 'y', 'a', 'm']
    let keys = []

    const handleKeyDown = (e) => {
      // Exit tissue mode on Escape
      if (e.key === 'Escape' && isTissueMode) {
        setIsTissueMode(false)
        setCapturedImage(null)
        return
      }

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
  }, [isTissueMode])

  const handlePeel = useCallback(async () => {
    if (isCapturing || isTissueMode) return
    setIsCapturing(true)

    const appContent = document.getElementById('app-content')
    if (!appContent) {
      setIsCapturing(false)
      return
    }

    const dataUrl = await captureDOM(appContent)
    if (dataUrl) {
      setCapturedImage(dataUrl)
      setIsTissueMode(true)
    }
    setIsCapturing(false)
  }, [isCapturing, isTissueMode])

  const handleExitTissue = useCallback(() => {
    setIsTissueMode(false)
    setCapturedImage(null)
  }, [])

  return (
    <div className="app">
      <motion.div
        key="content"
        id="app-content"
        className="content-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTissueMode ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isTissueMode ? 'none' : 'auto' }}
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
        
        {/* Main content lives in the root HTML landmark; this section labels the interactive surface. */}
        <section aria-label="Interactive portfolio">
          <Hero onStartDoodle={handlePeel} />
        </section>
      </motion.div>

      {/* Tissue Paper Physics Mode */}
      <AnimatePresence>
        {isTissueMode && capturedImage && (
          <motion.div
            key="tissue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 10000 }}
          >
            <Suspense fallback={null}>
              <TissueOverlay textureUrl={capturedImage} onExit={handleExitTissue} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

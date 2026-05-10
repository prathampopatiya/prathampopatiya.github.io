'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters - mix of hex digits, binary, and some symbols
    const chars = '0123456789ABCDEF<>{}[]!@#$%^&*()xor\\/|'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(8, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green text
      ctx.fillStyle = '#22c55e'
      ctx.font = `${fontSize}px "Geist Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Occasionally use different colors for variety
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#f97316' // Orange accent
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = '#4ade80' // Brighter green
        } else {
          ctx.fillStyle = '#22c55e' // Primary green
        }

        ctx.fillText(char, x, y)

        // Reset drop to top with random chance
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      aria-hidden="true"
    />
  )
}

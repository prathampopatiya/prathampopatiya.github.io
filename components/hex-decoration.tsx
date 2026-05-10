'use client'

import { useEffect, useState } from 'react'

export function HexDecoration() {
  const [hexLines, setHexLines] = useState<string[]>([])

  useEffect(() => {
    const generateHex = () => {
      const lines: string[] = []
      for (let i = 0; i < 8; i++) {
        const address = (0x00400000 + i * 16).toString(16).toUpperCase().padStart(8, '0')
        const bytes = Array.from({ length: 16 }, () => 
          Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
        ).join(' ')
        lines.push(`${address}  ${bytes}`)
      }
      setHexLines(lines)
    }

    generateHex()
    const interval = setInterval(generateHex, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="font-mono text-xs text-muted-foreground/30 select-none overflow-hidden">
      {hexLines.map((line, i) => (
        <div key={i} className="whitespace-nowrap">
          {line}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

interface Point {
  x: number
  y: number
  timestamp: number
}

export function CursorTrail() {
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }

      setPoints((prev) => [...prev.slice(-20), newPoint])
    }

    const cleanup = () => {
      setPoints((prev) => prev.filter((point) => Date.now() - point.timestamp < 1000))
    }

    const interval = setInterval(cleanup, 50)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {points.map((point, index) => {
        const age = Date.now() - point.timestamp
        const opacity = Math.max(0, 1 - age / 1000)
        const scale = Math.max(0.1, 1 - age / 1000)

        return (
          <div
            key={`${point.x}-${point.y}-${point.timestamp}`}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
            style={{
              left: point.x - 4,
              top: point.y - 4,
              opacity,
              transform: `scale(${scale})`,
              boxShadow: `0 0 ${10 * opacity}px rgba(59, 130, 246, ${opacity})`,
              transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
            }}
          />
        )
      })}
    </div>
  )
}

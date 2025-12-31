"use client"

import type { ReactNode } from "react"
import Silk from "./Silk"

interface BackgroundWrapperProps {
  children: ReactNode
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen">
      {/* Always use dark background */}
      <div className="fixed inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#5227FF"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Dark Overlay */}
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-black/30 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

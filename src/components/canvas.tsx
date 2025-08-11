'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { ThemeToggle } from './theme-toggle'
import { ControlPanel } from './control-panel'
import { ViewPanel } from './view-panel'
import { useMemo } from 'react'
import controls from '@/constants/controls'
import { CanvasProvider } from '@/contexts/CanvasContext'

import Experience from './Experience'

export function SimpleCanvas(): React.ReactElement {
  // Keyboard controls for shortcut key
  const map = useMemo(
    () => [
      { name: controls.FRONT, keys: ["1"] },
      { name: controls.BACK, keys: ["6"] },
      { name: controls.LEFT, keys: ["4"] },
      { name: controls.RIGHT, keys: ["3"] },
      { name: controls.BOTTOM, keys: ["5"] },
      { name: controls.TOP, keys: ["2"] },
      { name: controls.ORTHO, keys: ["0"] },
      { name: controls.TRANSFORM, keys: ["m"] }, 
    ],
    []
  )

  return (
    <CanvasProvider>
      <KeyboardControls map={map}>
        <div className="w-full h-full">
          <Canvas>
            <Experience />
          </Canvas>
          <ViewPanel />
          <ThemeToggle />
          <ControlPanel />
        </div>
      </KeyboardControls>
    </CanvasProvider>
  )
}

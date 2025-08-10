'use client'

import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { NavigationToolbar } from './navigation-toolbar'
import { ThemeToggle } from './theme-toggle'
import { FloatingCard } from './control-panel'
import { useMemo, useState } from 'react'
import controls from '@/constants/controls'

import Experience from './Experience'

export function SimpleCanvas(): JSX.Element {
  const [useOrtho, setUseOrtho] = useState<boolean>(false)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([3, 3, 3])
  const [isTransform, setIsTransform] = useState<boolean>(false)
  const [isChangePivot, setIsChangePivot] = useState<boolean>(false)

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
    <KeyboardControls map={map}>
      <div className="w-full h-full">
        <Canvas>
          <Experience useOrtho={useOrtho} cameraPosition={cameraPosition} isTransform={isTransform} isChangePivot={isChangePivot} setIsChangePivot={setIsChangePivot} />
        </Canvas>
        <NavigationToolbar setCameraPosition={setCameraPosition} setUseOrtho={setUseOrtho} isTransform={isTransform} isChangePivot={isChangePivot} setIsTransform={setIsTransform} setIsChangePivot={setIsChangePivot} />
        {/* <ControlPanel /> */}
        <ThemeToggle />
        <FloatingCard />
      </div>
    </KeyboardControls>
  )
}

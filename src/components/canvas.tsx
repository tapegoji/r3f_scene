'use client'

import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { NavigationToolbar } from './navigation-toolbar'
import { useMemo, useState } from 'react'
import controls from '@/constants/controls'

import Experience from './Experience'

export function SimpleCanvas(): JSX.Element {
  const [useOrtho, setUseOrtho] = useState<boolean>(false)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([3, 3, 3])
  const [isMove, setIsMove] = useState<boolean>(false)
  const [isRotate, setIsRotate] = useState<boolean>(false)
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
      { name: controls.ORTHO, keys: ["o"] },
      { name: controls.MOVE, keys: ["g"] }, 
      { name: controls.ROTATE, keys: ["r"] },
    ],
    []
  )

  return (
    <KeyboardControls map={map}>
      <div className="w-full h-full">
        <Canvas>
          <Experience useOrtho={useOrtho} cameraPosition={cameraPosition} isMove={isMove} isRotate={isRotate} isChangePivot={isChangePivot} setIsChangePivot={setIsChangePivot} />
        </Canvas>
        <NavigationToolbar setCameraPosition={setCameraPosition} setUseOrtho={setUseOrtho} isMove={isMove} isRotate={isRotate} isChangePivot={isChangePivot} setIsMove={setIsMove} setIsRotate={setIsRotate} setIsChangePivot={setIsChangePivot} />
      </div>
    </KeyboardControls>
  )
}

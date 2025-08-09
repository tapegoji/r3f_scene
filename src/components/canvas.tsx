'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport, Grid } from '@react-three/drei'
import { NavigationToolbar, NavigationControls } from './navigation-toolbar'
import { useState, useEffect } from 'react'

function SafeGizmo() {
  const { camera, controls } = useThree()
  const [isReady, setIsReady] = useState(false)
  
  useFrame(() => {
    if (controls && !isReady) {
      setIsReady(true)
    }
  })

  if (!isReady || !controls) return null

  return (
    <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={1}>
      <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
    </GizmoHelper>
  )
}

function SceneContent() {
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    const handleGridToggle = (event: CustomEvent) => {
      if (event.detail.action.type === 'toggle' && event.detail.action.feature === 'grid') {
        setShowGrid(prev => !prev)
      }
    }

    window.addEventListener('navigation-action', handleGridToggle as EventListener)
    return () => window.removeEventListener('navigation-action', handleGridToggle as EventListener)
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {showGrid && (
        <Grid 
          args={[10, 10]} 
          cellSize={1} 
          cellThickness={1} 
          cellColor="#6f6f6f" 
          sectionSize={5} 
          sectionThickness={1.5} 
          sectionColor="#9d4b4b" 
          fadeDistance={25} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true}
        />
      )}

      <OrbitControls enableDamping={false} minDistance={1} maxDistance={10} makeDefault />
      <SafeGizmo />
      <NavigationControls />
    </>
  )
}

export function SimpleCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <SceneContent />
      </Canvas>
      <NavigationToolbar />
    </div>
  )
}
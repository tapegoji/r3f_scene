'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { NavigationToolbar, NavigationControls } from './navigation-toolbar'

export function SimpleCanvas() {
  return (
    <div className="w-full h-full bg-{theme === 'light' ? 'white' : 'black'} relative">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        <OrbitControls enableDamping={false} minDistance={1} maxDistance={10} />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
        <NavigationControls />
      </Canvas>
      <NavigationToolbar />
    </div>
  )
}
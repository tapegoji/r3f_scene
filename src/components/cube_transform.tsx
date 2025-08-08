'use client'
import { Suspense, useRef, useState } from "react"
import { Canvas } from '@react-three/fiber'
import { GizmoHelper,
      GizmoViewport,
      Edges, 
      Points,
      OrbitControls,
      PivotControls ,
      Grid,
      useCursor } from "@react-three/drei"
import { useControls } from 'leva'

function Model({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  useCursor(isHovered)
  
   return (
    <>
      {/* Main mesh with material */}
      <PivotControls 
        enabled={isSelected} 
        rotation={[0, 0, 0]} 
        anchor={[1, 1, -1]} 
        scale={100} 
        depthTest={false} 
        fixed 
        lineWidth={5}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}>
        <mesh ref={ref} position={position}
          onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
          onPointerLeave={() => setIsHovered(false)}
          onClick={() => {
            if (!isDragging) {
              setIsSelected(!isSelected);
            }
          }}          
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial  color={isSelected ? "lightblue" : color}
          transparent opacity={isHovered && !isSelected ? 0.8 : 1} />
          <Edges
            linewidth={4}
            color="white"
            visible={isHovered || isSelected}
          />
          <Points
          />
        </mesh>
      </PivotControls>
    </>
  )
}


export function ThreeScene() {
  const { color, showGrid } = useControls({
    color: "orange",
    showGrid: false,
  });

  return (
    <div className="w-full h-full bg-secondary">
      <Canvas orthographic dpr={[1, 2]} camera={{ position: [0, 0, 20], zoom: 100 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <group>
            <Model position={[0, 1, 0]} color={color} />
            <Model position={[2, 1, 0]} color={color} />
            {showGrid && <Grid position={[0, -0.01, 0]} infiniteGrid cellColor="#333333" sectionColor="#444444" />}
          </group>          
        </Suspense>
        <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={1}>
          <GizmoViewport axisColors={["hotpink", "aquamarine", "#3498DB"]} labelColor="black" />
        </GizmoHelper>
        <OrbitControls enableDamping={false} enableZoom={true} enablePan={true} makeDefault />
      </Canvas>
    </div>
  )
}
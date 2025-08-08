'use client'
import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from '@react-three/fiber'
import { GizmoHelper, GizmoViewport, Edges, Points} from "@react-three/drei"
import { OrbitControls} from "@react-three/drei"
import { PivotControls } from "@react-three/drei"
import { useCursor } from "@react-three/drei"
import { useControls } from 'leva'
import { useThree } from '@react-three/fiber'

function Box() {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isTransformable, setIsTransformable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { gl } = useThree();
  const { color } = useControls({
    color: "orange",
  });
  useCursor(isHovered)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'M' || event.key === 'm') {
        setIsTransformable(true);
      } else if (event.key === 'Escape') {
        setIsTransformable(false);
        setIsSelected(false);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.tabIndex = 1; // Make canvas focusable
    canvas.focus();
    
    return () => canvas.removeEventListener('keydown', handleKeyDown);
  }, [gl]);
  
   return (
    <>
      {/* Main mesh with material */}
      <PivotControls 
        enabled={isTransformable && isSelected} 
        rotation={[0, 0, 0]} 
        anchor={[1, 1, -1]} 
        scale={100} 
        depthTest={false} 
        fixed 
        lineWidth={5}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}>
        <mesh ref={ref}
          onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
          onPointerLeave={() => setIsHovered(false)}
          onClick={(e) => {
            if (!isDragging) {
              setIsSelected(!isSelected);
            }
          }}
          
        >
          <boxGeometry args={[2, 2, 2]} />
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
  return (
    <div className="w-full h-full bg-secondary">
      <Canvas orthographic dpr={[1, 2]} camera={{ position: [0, 0, 20], zoom: 100 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <group>
            <Box/>
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
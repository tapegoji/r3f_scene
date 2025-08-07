"use client";
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, Edges, Points } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { PivotControls } from "@react-three/drei";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "M" || event.key === "m") {
        setIsTransformable(true);
      } else if (event.key === "Escape") {
        setIsTransformable(false);
        setIsSelected(false);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener("keydown", handleKeyDown);
    canvas.tabIndex = 1; // Make canvas focusable
    canvas.focus();

    return () => canvas.removeEventListener("keydown", handleKeyDown);
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
        onDragEnd={() => setIsDragging(false)}
      >
        <mesh
          ref={ref}
          onPointerEnter={(event) => (
            event.stopPropagation(), setIsHovered(true)
          )}
          onPointerLeave={() => setIsHovered(false)}
          onClick={(e) => {
            if (!isDragging) {
              setIsSelected(!isSelected);
            }
          }}
        >
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color={isSelected ? "lightblue" : color}
            transparent
            opacity={isHovered && !isSelected ? 0.8 : 1}
          />
          <Edges
            linewidth={4}
            color="white"
            visible={isHovered || isSelected}
          />
          <Points />
        </mesh>
      </PivotControls>
    </>
  );
}

export function ThreeScene() {
  const cameraRef = useRef();
  const controlsRef = useRef();

  const handleView = (position: any) => {
    const cam = cameraRef.current;
    if (cam) {
      cam.position.set(...position);
      cam.lookAt(0, 0, 0);
      controlsRef.current?.update();
    }
  };

  return (
    <div className="w-full h-full bg-secondary">
      {/* UI Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2 bg-white/80 p-2 rounded shadow">
        <button onClick={() => handleView([0, 0, 10])}>🔳 Front</button>
        <button onClick={() => handleView([0, 0, -10])}>🔙 Back</button>
        <button onClick={() => handleView([10, 0, 0])}>➡️ Right</button>
        <button onClick={() => handleView([-10, 0, 0])}>⬅️ Left</button>
        <button onClick={() => handleView([0, 10, 0])}>🔼 Top</button>
        <button onClick={() => handleView([0, -10, 0])}>🔽 Bottom</button>
      </div>
      <Canvas
        orthographic
        dpr={[1, 2]}
        camera={{ position: [0, 0, 20], zoom: 100 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <group>
            <Box />
          </group>
        </Suspense>
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          renderPriority={1}
        >
          <GizmoViewport
            axisColors={["hotpink", "aquamarine", "#3498DB"]}
            labelColor="black"
          />
        </GizmoHelper>
        <OrbitControls
          enableDamping={false}
          enableZoom={true}
          enablePan={true}
          makeDefault
        />
      </Canvas>
    </div>
  );
}

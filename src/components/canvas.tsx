'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useState } from 'react'
import Image from 'next/image'

interface ControlsInterfaceProps {
  setCameraPosition: (pos: [number, number, number]) => void
  setUseOrtho: (use: boolean) => void
}

interface CameraButtonConfig {
  icon: string
  alt: string
  position: [number, number, number]
  useOrtho: boolean
}

const cameraButtons: CameraButtonConfig[] = [
  {
    icon: '/icons/light/right.svg',
    alt: '+X (Right)',
    position: [5, 0, 0],
    useOrtho: false,
  },
  {
    icon: '/icons/light/left.svg',
    alt: '-X (Left)',
    position: [-5, 0, 0],
    useOrtho: false,
  },
  {
    icon: '/icons/light/top.svg',
    alt: '+Y (Top)',
    position: [0, 5, 0],
    useOrtho: false,
  },
  {
    icon: '/icons/light/bottom.svg',
    alt: '-Y (Bottom)',
    position: [0, -5, 0],
    useOrtho: false,
  },
  {
    icon: '/icons/light/front.svg',
    alt: '+Z (Front)',
    position: [0, 0, 5],
    useOrtho: false,
  },
  {
    icon: '/icons/light/rear.svg',
    alt: '-Z (Back)',
    position: [0, 0, -5],
    useOrtho: false,
  },
  {
    icon: '/icons/light/angle.svg',
    alt: 'Isometric View',
    position: [5, 5, 5],
    useOrtho: true,
  },
]

const ControlsInterface: React.FC<ControlsInterfaceProps> = ({ setCameraPosition, setUseOrtho }) => {
  return (
    <div className='absolute w-4/5 top-5 left-5 bg-blue-200 text-black p-4 rounded shadow flex flex-wrap gap-4 z-10'>
      {cameraButtons.map((btn, index) => (
        <button
          key={index}
          onClick={() => {
            setUseOrtho(btn.useOrtho)
            setCameraPosition(btn.position)
          }}
        >
          <Image src={btn.icon} alt={btn.alt} width={50} height={50} />
        </button>
      ))}
    </div>
  )
}

export function SimpleCanvas(): JSX.Element {
  const [useOrtho, setUseOrtho] = useState<boolean>(false)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([3, 3, 3])

  return (
    <div className="w-full h-full">
      <ControlsInterface setCameraPosition={setCameraPosition} setUseOrtho={setUseOrtho} />
      <Canvas>
        {useOrtho ? (
          <OrthographicCamera
            makeDefault
            position={cameraPosition}
            zoom={100}
            near={0.1}
            far={1000}
          />
        ) : (
          <PerspectiveCamera
            makeDefault
            position={cameraPosition}
            fov={50}
            near={0.1}
            far={1000}
          />
        )}

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        <OrbitControls />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}

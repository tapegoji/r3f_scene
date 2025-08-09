import { OrbitControls, GizmoHelper, GizmoViewport, OrthographicCamera, PerspectiveCamera, PivotControls, Edges } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

interface ExperienceProps {
    useOrtho: boolean
    cameraPosition: [number, number, number]
    isMove: boolean
    isRotate: boolean
    isChangePivot: boolean
    setIsChangePivot: React.Dispatch<React.SetStateAction<boolean>>
}

type PivotAnchor = { name: string, position: [number, number, number], rotation: [number, number, number] }

export const pivotData: PivotAnchor[] = [
    {
        "name": "center",
        "position": [0, 0, 0],
        "rotation": [0, Math.PI / 2, 0]
    },
    {
        "name": "corner",
        "position": [-1, -1, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "corner",
        "position": [1, -1, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "corner",
        "position": [-1, 1, -1],
        "rotation": [0, Math.PI / 2, 0] // done 2
    },
    {
        "name": "corner",
        "position": [1, 1, -1],
        "rotation": [0, Math.PI / 2, 0] // done 3
    },
    {
        "name": "corner",
        "position": [-1, -1, 1],
        "rotation": [0, Math.PI / 2, 0] // done 4
    },
    {
        "name": "corner",
        "position": [1, -1, 1],
        "rotation": [0, Math.PI / 2, 0] // done 5
    },
    {
        "name": "corner",
        "position": [-1, 1, 1],
        "rotation": [0, Math.PI / 2, 0] // done 6
    },
    {
        "name": "corner",
        "position": [1, 1, 1],
        "rotation": [0, Math.PI / 2, 0] // done 7
    },
    {
        "name": "edge",
        "position": [0, -1, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "edge",
        "position": [-1, 0, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "edge",
        "position": [-1, -1, 0],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "edge",
        "position": [1, 0, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "edge",
        "position": [1, -1, 0],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 12
    },
    {
        "name": "edge",
        "position": [0, 1, -1],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 13
    },
    {
        "name": "edge",
        "position": [-1, 1, 0],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 14
    },
    {
        "name": "edge",
        "position": [1, 1, 0],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "edge",
        "position": [0, -1, 1],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 16
    },
    {
        "name": "edge",
        "position": [-1, 0, 1],
        "rotation": [0, Math.PI / 2, 0] // done 17
    },
    {
        "name": "edge",
        "position": [1, 0, 1],
        "rotation": [0, Math.PI / 2, 0] // done 18
    },
    {
        "name": "edge",
        "position": [0, 1, 1],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 19
    },
    {
        "name": "face",
        "position": [0, 0, 1],
        "rotation": [0, 0, 0] // done 20
    },
    {
        "name": "face",
        "position": [0, 1, 0],
        "rotation": [0, Math.PI / 2, 0] // done 21
    },
    {
        "name": "face",
        "position": [1, 0, 0],
        "rotation": [Math.PI, Math.PI / 2, Math.PI / 2] // done 22
    },
    {
        "name": "face",
        "position": [0, 0, -1],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "face",
        "position": [0, -1, 0],
        "rotation": [0, Math.PI * 0, 0]
    },
    {
        "name": "face",
        "position": [-1, 0, 0],
        "rotation": [0, Math.PI * 0, 0]
    },
]
 

const Experience = ({ useOrtho, cameraPosition, isMove, isRotate, isChangePivot, setIsChangePivot }: ExperienceProps) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [pivotDataPreviousIndex, setPivotDataPreviousIndex] = useState<number>(0)
    const [pivotDataIndex, setPivotDataIndex] = useState<number>(0)

    const raycaster = useMemo(() => new THREE.Raycaster(), [])
    const mouse = useMemo(() => new THREE.Vector2(), [])

    useEffect(() => {
        const handleClick = () => {
            if (isChangePivot) {
                setIsChangePivot(false);
                setPivotDataPreviousIndex(pivotDataIndex);
            }
        };
    
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isChangePivot && event.code === 'Escape') {
                setIsChangePivot(false);
                setPivotDataIndex(pivotDataPreviousIndex);
            }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", handleClick);
    
        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isChangePivot, pivotDataIndex, pivotDataPreviousIndex]);    

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (!meshRef.current || !isChangePivot) return

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, event.camera)
        const intersects = raycaster.intersectObject(meshRef.current)

        if (intersects.length > 0) {
            const hitPoint = intersects[0].point

            // Find the nearest pivot anchor
            let minDist = Infinity
            let closestIndex = 0

            pivotData.forEach((pivot, index) => {
                if (pivot.name === 'center') return 

                const worldPos = new THREE.Vector3(...pivot.position)
                // Apply box world transform to pivot position
                worldPos.applyMatrix4(meshRef.current!.matrixWorld)

                const dist = pivot.name === "corner"
                    ? hitPoint.distanceTo(worldPos)
                    : pivot.name === "edge" ? hitPoint.distanceTo(worldPos) + 0.25
                    : hitPoint.distanceTo(worldPos) + 0.5

                if (dist < minDist) {
                    minDist = dist
                    closestIndex = index
                }
            })

            setPivotDataIndex(closestIndex)
        }
    }

    return (
        <>
            {useOrtho ? (
                <OrthographicCamera makeDefault position={cameraPosition} zoom={100} near={0.1} far={1000} />
            ) : (
                <PerspectiveCamera makeDefault position={cameraPosition} fov={50} near={0.1} far={1000} />
            )}

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <PivotControls
                anchor={pivotData[pivotDataIndex].position}
                rotation={pivotData[pivotDataIndex].rotation}
                depthTest={false}
                disableAxes={!isMove}
                disableSliders={!isMove}
                disableRotations={!isRotate}
                disableScaling
                scale={0.5}
            >
                <mesh
                    ref={meshRef}
                    onPointerMove={handlePointerMove}
                    onClick={() => setIsSelected(!isSelected)}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={isSelected ? "#34cdff" : "orange"} />
                    <Edges linewidth={4} color="white" visible={isSelected} />
                </mesh>
            </PivotControls>

            <OrbitControls makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport />
            </GizmoHelper>
        </>
    )
}

export default Experience

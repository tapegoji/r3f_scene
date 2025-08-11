import { OrbitControls, GizmoHelper, GizmoViewport, OrthographicCamera, PerspectiveCamera, Grid, useKeyboardControls } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import Model from './Model'
import { useCanvas } from '@/contexts/CanvasContext'
import controls from '@/constants/controls'

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

const Experience = () => {
    const { 
        useOrtho, 
        cameraPosition, 
        isChangePivot, 
        setIsChangePivot, 
        showGrid, 
        setFitToScreen,
        setCameraPosition,
        setUseOrtho,
        setIsTransform
    } = useCanvas()
    
    const orthoRef = useRef<THREE.OrthographicCamera>(null)
    const perspectiveRef = useRef<THREE.PerspectiveCamera>(null)
    const orbitControlsRef = useRef<any>(null)

    const meshRef = useRef<THREE.Mesh>(null)

    // Keyboard controls 
    const frontShortcutKey = useKeyboardControls((state) => state[controls.FRONT])
    const backShortcutKey = useKeyboardControls((state) => state[controls.BACK])
    const leftShortcutKey = useKeyboardControls((state) => state[controls.LEFT])
    const rightShortcutKey = useKeyboardControls((state) => state[controls.RIGHT])
    const topShortcutKey = useKeyboardControls((state) => state[controls.TOP])
    const bottomShortcutKey = useKeyboardControls((state) => state[controls.BOTTOM])
    const orthoShortcutKey = useKeyboardControls((state) => state[controls.ORTHO])
    const transformShortcutKey = useKeyboardControls((state) => state[controls.TRANSFORM])

    // Handle keyboard shortcuts
    useEffect(() => {
        if (frontShortcutKey) {
            setCameraPosition([0, 0, 5])
            setUseOrtho(false)
        } else if (backShortcutKey) {
            setCameraPosition([0, 0, -5])
            setUseOrtho(false)
        } else if (leftShortcutKey) {
            setCameraPosition([-5, 0, 0])
            setUseOrtho(false)
        } else if (rightShortcutKey) {
            setCameraPosition([5, 0, 0])
            setUseOrtho(false)
        } else if (topShortcutKey) {
            setCameraPosition([0, 5, 0])
            setUseOrtho(false)
        } else if (bottomShortcutKey) {
            setCameraPosition([0, -5, 0])
            setUseOrtho(false)
        } else if (orthoShortcutKey) {
            setCameraPosition([3, 3, 3])
            setUseOrtho((prev) => !prev)
        }

        if (transformShortcutKey) {
            setIsTransform((prev) => !prev)
        }
    }, [
        frontShortcutKey,
        backShortcutKey,
        leftShortcutKey,
        rightShortcutKey,
        topShortcutKey,
        bottomShortcutKey,
        orthoShortcutKey,
        transformShortcutKey,
        setCameraPosition,
        setUseOrtho,
        setIsTransform
    ])

    useEffect(() => {
        if (useOrtho) {
          orthoRef.current?.lookAt(0, 0, 0)
        } else {
          perspectiveRef.current?.lookAt(0, 0, 0)
        }
    }, [useOrtho, cameraPosition])

    // Set up fit-to-screen functionality
    useEffect(() => {
        const fitToScreenFunc = () => {
            if (!meshRef.current || !orbitControlsRef.current) return

            // Calculate bounding box of all objects in scene
            const box = new THREE.Box3()
            
            // Add the mesh to the bounding box
            box.expandByObject(meshRef.current)
            
            // Get the center and size of the bounding box
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            
            // Calculate the distance needed to fit the object
            const maxDim = Math.max(size.x, size.y, size.z)
            const fov = useOrtho ? 1 : (perspectiveRef.current?.fov || 50) * (Math.PI / 180)
            let cameraZ = useOrtho ? maxDim * 2 : Math.abs(maxDim / (2 * Math.tan(fov / 2)))
            
            // Add some padding
            cameraZ *= 3
            
            // Position camera at a good angle to see the object
            const idealPosition = new THREE.Vector3(
                center.x + cameraZ * 0.5,
                center.y + cameraZ * 0.5, 
                center.z + cameraZ * 0.5
            )
            
            // Update OrbitControls target and camera position smoothly
            if (orbitControlsRef.current) {
                orbitControlsRef.current.target.copy(center)
                
                if (useOrtho && orthoRef.current) {
                    orthoRef.current.position.copy(idealPosition)
                    orthoRef.current.lookAt(center)
                    orthoRef.current.updateProjectionMatrix()
                } else if (!useOrtho && perspectiveRef.current) {
                    perspectiveRef.current.position.copy(idealPosition)
                    perspectiveRef.current.lookAt(center)
                    perspectiveRef.current.updateProjectionMatrix()
                }
                
                orbitControlsRef.current.update()
            }
        }

        setFitToScreen(() => fitToScreenFunc)
    }, [meshRef, orbitControlsRef, useOrtho, setFitToScreen])

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
                <OrthographicCamera ref={orthoRef} makeDefault position={cameraPosition} zoom={100} near={0.1} far={1000} />
            ) : (
                <PerspectiveCamera ref={perspectiveRef} makeDefault position={cameraPosition} fov={50} near={0.1} far={1000} />
            )}

            <OrbitControls ref={orbitControlsRef} enableDamping={false} minDistance={1} maxDistance={10} makeDefault />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {showGrid && <Grid infiniteGrid />}

            <Suspense fallback={null}>
                <Model name="Curly" position={[-0.5, -0.3, -0.5]} rotation={[2, 0, -0]} scale={0.1}/>
                <Model name="Headphones" position={[0.5, 0.3, 1.3]} rotation={[1, 0, -1]} scale={0.1}/>
                <Model name="Notebook" position={[-3, 0, -1]} rotation={[2, 0, 1]} scale={0.1}/>
            </Suspense>

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport />
            </GizmoHelper>
        </>
    )
}

export default Experience

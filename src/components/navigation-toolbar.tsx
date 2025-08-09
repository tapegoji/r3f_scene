'use client'

import { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Vector3, PerspectiveCamera, OrthographicCamera } from 'three'
import { useTheme } from 'next-themes'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'

type ButtonAction = 
  | { type: 'position', position: [number, number, number] }
  | { type: 'fit' }
  | { type: 'reset' }
  | { type: 'toggle', feature: string }

const getViewButtons = (theme: string): Array<{ id: string, icon: string, action: ButtonAction, tooltip: string }> => [
  { id: 'orthographic', icon: `/icons/${theme}/iso.svg`, action: { type: 'position', position: [3, 3, 3] }, tooltip: 'Orthographic View' },
  { id: 'front', icon: `/icons/${theme}/front.svg`, action: { type: 'position', position: [0, 0, 5] }, tooltip: 'Front View' },
  { id: 'rear', icon: `/icons/${theme}/rear.svg`, action: { type: 'position', position: [0, 0, -5] }, tooltip: 'Rear View' },
  { id: 'left', icon: `/icons/${theme}/left.svg`, action: { type: 'position', position: [-5, 0, 0] }, tooltip: 'Left View' },
  { id: 'right', icon: `/icons/${theme}/right.svg`, action: { type: 'position', position: [5, 0, 0] }, tooltip: 'Right View' },
  { id: 'top', icon: `/icons/${theme}/top.svg`, action: { type: 'position', position: [0, 5, 0] }, tooltip: 'Top View' },
  { id: 'bottom', icon: `/icons/${theme}/bottom.svg`, action: { type: 'position', position: [0, -5, 0] }, tooltip: 'Bottom View' },
  { id: 'fit', icon: `/icons/${theme}/resize.svg`, action: { type: 'fit' }, tooltip: 'Fit to Screen' },
  { id: 'transparent', icon: `/icons/${theme}/transparent.svg`, action: { type: 'toggle', feature: 'transparent' }, tooltip: 'Toggle Transparency' },
  { id: 'wireframe', icon: `/icons/${theme}/black_edges.svg`, action: { type: 'toggle', feature: 'wireframe' }, tooltip: 'Toggle Wireframe' },
  { id: 'grid', icon: `/icons/${theme}/grid.svg`, action: { type: 'toggle', feature: 'grid' }, tooltip: 'Toggle Grid' },
  { id: 'axes', icon: `/icons/${theme}/axes.svg`, action: { type: 'toggle', feature: 'axes' }, tooltip: 'Toggle Axes' },
  { id: 'axes0', icon: `/icons/${theme}/axes0.svg`, action: { type: 'toggle', feature: 'axes0' }, tooltip: 'Toggle Origin Axes' },
  { id: 'perspective', icon: `/icons/${theme}/perspective.svg`, action: { type: 'toggle', feature: 'perspective' }, tooltip: 'Toggle Perspective' },
  { id: 'extrude', icon: `/icons/${theme}/plane.svg`, action: { type: 'toggle', feature: 'extrude' }, tooltip: 'Extrude Mode' },
]

// External toolbar component that renders outside Canvas
export function NavigationToolbar() {
  const { theme, setTheme } = useTheme()
  const currentTheme = theme === 'light' ? 'light' : 'dark'
  const viewButtons = getViewButtons(currentTheme)

  const handleAction = useCallback((action: ButtonAction) => {
    // Dispatch custom event to communicate with Canvas
    window.dispatchEvent(new CustomEvent('navigation-action', { detail: { action } }))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <Rnd
      default={{
        x: typeof window !== 'undefined' ? window.innerWidth - 80 : 800,
        y: 16,
        width: 66,
        height: 'auto',
      }}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <div className="w-full h-auto shadow-lg p-1 drag-handle cursor-move border border-border/50 rounded-lg bg-card">
        <div className="flex flex-col space-y-1 items-center justify-center">
          {/* Theme Toggle Button - at the top, spans both columns */}
          <div className="w-full flex justify-center">
            <button
              className="w-6 h-6 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Navigation Buttons in 2-column grid */}
          <div className="grid grid-cols-2 gap-1">
            {viewButtons.map((button) => (
              <button
                key={button.id}
                className="w-7 h-7 p-0 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
                onClick={() => handleAction(button.action)}
                title={button.tooltip}
              >
                <Image
                  src={button.icon}
                  alt={button.id}
                  width={22}
                  height={22}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Rnd>
  )
}

// Component to be used inside Canvas
export function NavigationControls() {
  const { camera, scene, gl, size, set } = useThree()
  const [sceneState, setSceneState] = useState({
    wireframe: false,
    transparent: false,
    showGrid: false,
    showAxes: false,
    showOriginAxes: false,
    isPerspective: camera instanceof PerspectiveCamera
  })

  const fitCameraToScene = useCallback(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2))

    cameraZ *= 2.5 // Add some padding

    camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()
  }, [camera, scene])

  const resetCamera = useCallback(() => {
    camera.position.set(3, 3, 3)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  const togglePerspective = useCallback(() => {
    const currentPosition = camera.position.clone()
    const currentTarget = new Vector3(0, 0, 0) // Assuming we're looking at origin
    
    let newCamera
    
    if (camera instanceof PerspectiveCamera) {
      // Switch to Orthographic
      const distance = currentPosition.distanceTo(currentTarget)
      const aspect = size.width / size.height
      const zoom = 1
      
      newCamera = new OrthographicCamera(
        -distance * aspect,
        distance * aspect,
        distance,
        -distance,
        0.1,
        1000
      )
      newCamera.zoom = zoom
    } else {
      // Switch to Perspective
      newCamera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
    }
    
    newCamera.position.copy(currentPosition)
    newCamera.lookAt(currentTarget)
    newCamera.updateProjectionMatrix()
    
    set({ camera: newCamera })
    setSceneState(prev => ({ ...prev, isPerspective: newCamera instanceof PerspectiveCamera }))
  }, [camera, set, size])

  const handleToggle = useCallback((feature: string) => {
    setSceneState(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof prev]
    }))

    // Apply toggle effects to scene objects
    scene.traverse((child) => {
      // Skip helper objects like grids, axes helpers, etc.
      // Only apply to user-created mesh objects
      if (child.isMesh && 
          child.type !== 'GridHelper' && 
          !child.userData.isGrid && 
          !child.userData.isHelper &&
          child.name !== 'grid' &&
          !child.parent?.name?.includes('grid')) {
        switch (feature) {
          case 'wireframe':
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.wireframe = !mat.wireframe
              })
            } else {
              child.material.wireframe = !child.material.wireframe
            }
            break
          case 'transparent':
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.transparent = !mat.transparent
                mat.opacity = mat.transparent ? 0.5 : 1
              })
            } else {
              child.material.transparent = !child.material.transparent
              child.material.opacity = child.material.transparent ? 0.5 : 1
            }
            break
        }
      }
    })
  }, [scene])

  const handleNavigationAction = useCallback((event: CustomEvent) => {
    const { action } = event.detail

    switch (action.type) {
      case 'position':
        camera.position.set(action.position[0], action.position[1], action.position[2])
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
        break
      case 'fit':
        fitCameraToScene()
        break
      case 'reset':
        resetCamera()
        break
      case 'toggle':
        if (action.feature === 'perspective') {
          togglePerspective()
        } else {
          handleToggle(action.feature)
        }
        break
    }
  }, [camera, fitCameraToScene, resetCamera, handleToggle, togglePerspective])

  // Listen for navigation actions from the external toolbar
  useEffect(() => {
    window.addEventListener('navigation-action', handleNavigationAction as EventListener)
    return () => window.removeEventListener('navigation-action', handleNavigationAction as EventListener)
  }, [handleNavigationAction])

  return null
}
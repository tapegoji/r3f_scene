'use client'

import { useCallback, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'

const getViewButtons = (theme: string) => [
  { id: 'orthographic', icon: `/icons/${theme}/iso.svg`, position: [3, 3, 3] as [number, number, number], tooltip: 'Orthographic View' },
  { id: 'front', icon: `/icons/${theme}/front.svg`, position: [0, 0, 5] as [number, number, number], tooltip: 'Front View' },
  { id: 'rear', icon: `/icons/${theme}/rear.svg`, position: [0, 0, -5] as [number, number, number], tooltip: 'Rear View' },
  { id: 'left', icon: `/icons/${theme}/left.svg`, position: [-5, 0, 0] as [number, number, number], tooltip: 'Left View' },
  { id: 'right', icon: `/icons/${theme}/right.svg`, position: [5, 0, 0] as [number, number, number], tooltip: 'Right View' },
  { id: 'top', icon: `/icons/${theme}/top.svg`, position: [0, 5, 0] as [number, number, number], tooltip: 'Top View' },
  { id: 'bottom', icon: `/icons/${theme}/bottom.svg`, position: [0, -5, 0] as [number, number, number], tooltip: 'Bottom View' },
  { id: 'reset', icon: `/icons/${theme}/reset.svg`, position: [3, 3, 3] as [number, number, number], tooltip: 'Reset View' },
  { id: 'fit', icon: `/icons/${theme}/resize.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Fit to Screen' },
  { id: 'transparent', icon: `/icons/${theme}/transparent.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Transparency' },
  { id: 'wireframe', icon: `/icons/${theme}/black_edges.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Wireframe' },
  { id: 'grid', icon: `/icons/${theme}/grid.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Grid' },
  { id: 'axes', icon: `/icons/${theme}/axes.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Axes' },
  { id: 'axes0', icon: `/icons/${theme}/axes0.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Origin Axes' },
  { id: 'perspective', icon: `/icons/${theme}/perspective.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Toggle Perspective' },
  { id: 'extrude', icon: `/icons/${theme}/plane.svg`, position: [0, 0, 0] as [number, number, number], tooltip: 'Extrude Mode' },
]

// External toolbar component that renders outside Canvas
export function NavigationToolbar() {
  const { theme, setTheme } = useTheme()
  const currentTheme = theme === 'light' ? 'light' : 'dark'
  const viewButtons = getViewButtons(currentTheme)

  const handleViewChange = useCallback((position: [number, number, number]) => {
    // Dispatch custom event to communicate with Canvas
    window.dispatchEvent(new CustomEvent('camera-view-change', { detail: { position } }))
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
                onClick={() => handleViewChange(button.position)}
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
  const { camera } = useThree()

  // Listen for camera view changes from the external toolbar
  useEffect(() => {
    const handleCameraChange = (event: CustomEvent) => {
      const { position } = event.detail
      camera.position.set(position[0], position[1], position[2])
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }

    window.addEventListener('camera-view-change', handleCameraChange as EventListener)
    return () => window.removeEventListener('camera-view-change', handleCameraChange as EventListener)
  }, [camera])

  return null
}
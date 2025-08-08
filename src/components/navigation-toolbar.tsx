'use client'

import { useCallback, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'

const getViewButtons = (theme: string) => [
  { id: 'front', icon: `/icons/${theme}/front.svg`, position: [0, 0, 5] as [number, number, number] },
  { id: 'rear', icon: `/icons/${theme}/rear.svg`, position: [0, 0, -5] as [number, number, number] },
  { id: 'left', icon: `/icons/${theme}/left.svg`, position: [-5, 0, 0] as [number, number, number] },
  { id: 'right', icon: `/icons/${theme}/right.svg`, position: [5, 0, 0] as [number, number, number] },
  { id: 'top', icon: `/icons/${theme}/top.svg`, position: [0, 5, 0] as [number, number, number] },
  { id: 'bottom', icon: `/icons/${theme}/bottom.svg`, position: [0, -5, 0] as [number, number, number] },
  { id: 'perspective', icon: `/icons/${theme}/perspective.svg`, position: [3, 3, 3] as [number, number, number] },
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
        x: typeof window !== 'undefined' ? window.innerWidth - 60 : 800,
        y: 16,
        width: 40,
        height: 320,
      }}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <Card className="w-full h-full shadow-lg p-1 drag-handle cursor-move">
        <div className="flex flex-col space-y-1">
          {/* Theme Toggle Button - at the top */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 p-1 hover:bg-accent"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          {/* Separator */}
          <div className="h-px bg-border mx-1" />
          
          {/* Navigation Buttons */}
          {viewButtons.map((button) => (
            <Button
              key={button.id}
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-1 hover:bg-accent"
              onClick={() => handleViewChange(button.position)}
            >
              <Image
                src={button.icon}
                alt={button.id}
                width={20}
                height={20}
                className={currentTheme === 'light' ? '' : 'invert'}
              />
            </Button>
          ))}
        </div>
      </Card>
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
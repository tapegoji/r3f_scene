'use client'

import { useCallback, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import { useKeyboardControls } from '@react-three/drei'
import controls from '@/constants/controls'

interface ControlsInterfaceProps {
  setCameraPosition: (pos: [number, number, number]) => void
  setUseOrtho: (use: boolean) => void
  isMove: boolean
  isRotate: boolean
  isChangePivot: boolean
  setIsMove: React.Dispatch<React.SetStateAction<boolean>>
  setIsRotate: React.Dispatch<React.SetStateAction<boolean>>
  setIsChangePivot: React.Dispatch<React.SetStateAction<boolean>>
}

const getViewButtons = (theme: string) => [
  { id: 'front', icon: `/icons/${theme}/front.svg`, position: [0, 0, 5] as [number, number, number], useOrtho: false },
  { id: 'rear', icon: `/icons/${theme}/rear.svg`, position: [0, 0, -5] as [number, number, number], useOrtho: false },
  { id: 'left', icon: `/icons/${theme}/left.svg`, position: [-5, 0, 0] as [number, number, number], useOrtho: false },
  { id: 'right', icon: `/icons/${theme}/right.svg`, position: [5, 0, 0] as [number, number, number], useOrtho: false },
  { id: 'top', icon: `/icons/${theme}/top.svg`, position: [0, 5, 0] as [number, number, number], useOrtho: false },
  { id: 'bottom', icon: `/icons/${theme}/bottom.svg`, position: [0, -5, 0] as [number, number, number], useOrtho: false },
  { id: 'perspective', icon: `/icons/${theme}/perspective.svg`, position: [3, 3, 3] as [number, number, number], useOrtho: true },
]

const getTransformButtons = (theme: string) => [
  { id: 'move', icon: `/icons/${theme}/axes.svg` },
  { id: 'rotate', icon: `/icons/${theme}/angle.svg` },
  { id: 'changePivot', icon: `/icons/${theme}/axes0.svg` },
]


// External toolbar component that renders outside Canvas
export const NavigationToolbar: React.FC<ControlsInterfaceProps> = ({ setCameraPosition, setUseOrtho, isMove, isRotate, isChangePivot, setIsMove, setIsRotate, setIsChangePivot }) =>  {
  const { theme, setTheme } = useTheme()
  const currentTheme = theme === 'light' ? 'light' : 'dark'
  const viewButtons = getViewButtons(currentTheme)
  const transformButtons = getTransformButtons(currentTheme)

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // Keyboard controls 
  const frontShortcutKey = useKeyboardControls((state) => state[controls.FRONT])
  const backShortcutKey = useKeyboardControls((state) => state[controls.BACK])
  const leftShortcutKey = useKeyboardControls((state) => state[controls.LEFT])
  const rightShortcutKey = useKeyboardControls((state) => state[controls.RIGHT])
  const topShortcutKey = useKeyboardControls((state) => state[controls.TOP])
  const bottomShortcutKey = useKeyboardControls((state) => state[controls.BOTTOM])
  const orthoShortcutKey = useKeyboardControls((state) => state[controls.ORTHO])
  const moveShortcutKey = useKeyboardControls((state) => state[controls.MOVE])
  const rotateShortcutKey = useKeyboardControls((state) => state[controls.ROTATE])

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
      setUseOrtho(true)
    }

    if (moveShortcutKey) {
      setIsMove((prev) => !prev)
    }

    if (rotateShortcutKey) {
      setIsRotate((prev) => !prev)
    }
  }, [
    frontShortcutKey,
    backShortcutKey,
    leftShortcutKey,
    rightShortcutKey,
    topShortcutKey,
    bottomShortcutKey,
    orthoShortcutKey,
    moveShortcutKey,
    rotateShortcutKey,
    setCameraPosition,
    setUseOrtho,
    setIsMove,
    setIsRotate,
  ])

  return (
    <Rnd
      default={{
        x: typeof window !== 'undefined' ? window.innerWidth - 60 : 800,
        y: 16,
        width: 56,
        height: 'auto',
      }}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <Card className="w-full h-auto shadow-lg p-2 drag-handle cursor-move border-border/50">
        <div className="flex flex-col space-y-2">
          {/* Theme Toggle Button - at the top */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 p-2 hover:bg-accent rounded-lg"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </Button>
          
          {/* Separator */}
          <div className="h-px bg-border/30 mx-2 rounded-full" />
          
          {/* Navigation Buttons */}
          {viewButtons.map((button) => (
            <Button
              key={button.id}
              variant="ghost"
              size="icon"
              className="w-12 h-12 p-2 hover:bg-accent rounded-lg"
              onClick={() => {
                setUseOrtho(button.useOrtho)
                setCameraPosition(button.position)
              }}
            >
              <Image
                src={button.icon}
                alt={button.id}
                width={32}
                height={32}
              />
            </Button>
          ))}

          {transformButtons.map((button) => {
            const isActive =
              (button.id === 'move' && isMove) ||
              (button.id === 'rotate' && isRotate) ||
              (button.id === 'changePivot' && isChangePivot);

            return (
              <Button
                key={button.id}
                variant="ghost"
                size="icon"
                className={`w-12 h-12 p-2 hover:bg-white rounded-lg ${
                  isActive ? 'bg-white' : ''
                }`}
                onClick={() => {  
                  if (button.id === 'move') {
                    setIsMove((prev) => !prev);
                  } else if (button.id === 'rotate') {
                    setIsRotate((prev) => !prev);
                  } else {
                    setIsChangePivot((prev) => !prev);
                  }
                }}
              >
                <Image
                  src={button.icon}
                  alt={button.id}
                  width={32}
                  height={32}
                />
              </Button>
            );
          })}

        </div>
      </Card>
    </Rnd>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { useTheme } from 'next-themes'

import { PanelLeftClose,
         Menu,
         Grip } from 'lucide-react'


interface ViewPanelProps {
  x?: number
  y?: number
  width?: number
  height?: number
}

export function ViewPanel({
  x,
  y = 350,
  width = 60,
  height = 400
}: ViewPanelProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const { theme } = useTheme()

  const dynamicX = x ?? (windowWidth - width - 16)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const viewItems = [
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
  ]

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 p-2 bg-card border rounded-lg shadow-lg hover:bg-muted/50 transition-colors z-50"
      >
        <Menu className="h-4 w-4 text-muted-foreground" />
      </button>
    )
  }
  return (
    <Rnd
      default={{ x: dynamicX, y, width, height }}
      enableResizing={{
        bottomRight: true
      }}
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <div className="h-full w-full bg-card/50 border rounded-lg shadow-lg backdrop-blur-sm">
        <div className="h-8 bg-muted/30 rounded-t-lg border-b px-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground"></span>
          <div className="drag-handle cursor-move px-3 py-1 hover:bg-muted/50 rounded transition-colors flex items-center justify-center">
            <Grip className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground" />
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-muted/50 rounded transition-colors"
          >
            <PanelLeftClose className="h-3 w-3 text-muted-foreground/60" />
          </button>
        </div>
        <div className="p-0 h-[calc(100%-2rem)] overflow-auto">
          <div className="grid grid-cols-2 gap-1">
            {viewItems.map((item) => (
              <div key={item.id} className="flex items-center justify-center p-1 hover:bg-muted/30 rounded transition-colors cursor-pointer">
                <img src={item.icon} alt={item.tooltip} className="h-6 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Rnd>
  )
}
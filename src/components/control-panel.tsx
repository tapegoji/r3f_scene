'use client'

import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'

import { PanelLeftClose,
         ChevronRight,
         Box,
         Grid3X3,
         Play,
         BarChart3,
         Menu,
         Grip } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const ControlPanelSections = [
  {
    title: "Geometry",
    icon: Box,
    isActive: true,
    items: [
      { title: "Import CAD", url: "#" },
      { title: "Create Geometry", url: "#" },
      { title: "Edit Geometry", url: "#" },
      { title: "View 3D", url: "#" },
    ],
  },
  {
    title: "Mesh",
    icon: Grid3X3,
    items: [
      { title: "Generate Mesh", url: "#" },
      { title: "Mesh Quality", url: "#" },
      { title: "Refinement", url: "#" },
      { title: "Boundary Conditions", url: "#" },
    ],
  },
  {
    title: "Simulation",
    icon: Play,
    items: [
      { title: "Material Properties", url: "#" },
      { title: "Load Conditions", url: "#" },
      { title: "Solver Settings", url: "#" },
      { title: "Run Analysis", url: "#" },
    ],
  },
  {
    title: "Analysis",
    icon: BarChart3,
    items: [
      { title: "Displacement", url: "#" },
      { title: "Stress", url: "#" },
      { title: "Strain", url: "#" },
      { title: "Export Data", url: "#" },
    ],
  },
]

interface ControlPanelProps {
  x?: number
  y?: number
  width?: number
  height?: number
  heightOffset?: number
}

export function ControlPanel({
  x = 16,
  y = 16,
  width = 300,
  height,
  heightOffset = 500
}: ControlPanelProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)
  
  const calculatedHeight = height ?? windowHeight - heightOffset

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 p-2 bg-card border rounded-lg shadow-lg hover:bg-muted/50 transition-colors z-50"
      >
        <Menu className="h-4 w-4 text-muted-foreground" />
      </button>
    )
  }
  return (
    <Rnd
      default={{ x, y, width, height: calculatedHeight }}
      enableResizing={{
        bottomRight: true
      }}
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <div className="h-full w-full bg-card/50 border rounded-lg shadow-lg backdrop-blur-sm">
        <div className="h-8 bg-muted/30 rounded-t-lg border-b px-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Control Panel</span>
          <div className="drag-handle cursor-move px-3 py-1 hover:bg-muted/50 rounded transition-colors flex items-center justify-center">
            <Grip className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground" />
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-muted/50 rounded transition-colors"
          >
            <PanelLeftClose className="h-4 w-4 text-muted-foreground/60" />
          </button>
        </div>
        <div className="p-4 h-[calc(100%-2rem)] overflow-auto">
          {ControlPanelSections.map((section) => (
            <Collapsible
              key={section.title}
              title={section.title}
              defaultOpen
              className="group/collapsible"
            >
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              {section.title}
              <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className="w-full justify-start px-2 py-1.5 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors block"
                >
                  {item.title}
                </a>
              ))}
            </CollapsibleContent>
          </Collapsible>
          ))}
        </div>
      </div>
    </Rnd>
  )
}
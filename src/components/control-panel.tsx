"use client"

import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { X, Menu, CornerDownLeft } from "lucide-react"
import {
  Box,
  Grid3X3,
  Play,
  BarChart3,
} from "lucide-react"
import { Rnd } from 'react-rnd'
import Link from 'next/link'

type Project = {
  id: number
  name: string
  slug: string
  description: string | null
  status: string
  relativePath: string
  createdAt: Date
  updatedAt: Date
}

type ControlPanelProps = {
  project?: Project | null
}

const controlSections = [
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

export function ControlPanel({ project }: ControlPanelProps) {
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(true)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Geometry": true, // Default open based on isActive
    "Mesh": false,
    "Simulation": false,
    "Analysis": false,
  })

  // Update expanded state based on mobile/desktop on mount
  useEffect(() => {
    setIsExpanded(!isMobile)
  }, [isMobile])

  if (!isExpanded) {
    return (
      <Rnd
        default={{
          x: 16,
          y: 16,
          width: 40,
          height: 40,
        }}
        enableResizing={false}
        bounds="parent"
        dragHandleClassName="drag-handle"
        style={{ zIndex: 100 }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="w-10 h-10 rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground drag-handle cursor-move border border-border flex items-center justify-center transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Rnd>
    )
  }

  return (
    <Rnd
      default={{
        x: 16,
        y: 16,
        width: 320,
        height: 600,
      }}
      minWidth={250}
      minHeight={200}
      maxWidth={600}
      maxHeight={800}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{ zIndex: 100 }}
    >
      <div className="w-full h-full shadow-lg relative flex flex-col border border-border bg-card rounded-lg">
        <div className="drag-handle cursor-move p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {project && (
                <Link href="/dashboard" className="p-1 hover:bg-accent rounded transition-colors">
                  <CornerDownLeft className="h-4 w-4" />
                </Link>
              )}
              <h3 className="text-sm font-medium">
                {project ? project.name : 'Control Panel'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 h-6 w-6 hover:bg-accent rounded transition-colors flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-0 flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {controlSections.map((section) => (
                  <div key={section.title}>
                    <button
                      className="w-full px-2 py-2 hover:bg-accent rounded-md flex items-center justify-between transition-colors"
                      onClick={() => setOpenSections(prev => ({...prev, [section.title]: !prev[section.title]}))}
                    >
                      <div className="flex items-center">
                        <section.icon className="h-4 w-4 mr-2" />
                        <span className="text-left font-medium">{section.title}</span>
                      </div>
                      <span className={`transform transition-transform ${openSections[section.title] ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {openSections[section.title] && (
                      <div className="pl-6 space-y-1 pb-2">
                        {section.items.map((item) => (
                          <a
                            key={item.title}
                            href={item.url}
                            className="w-full justify-start px-2 py-1.5 h-auto text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors block"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Rnd>
  )
}
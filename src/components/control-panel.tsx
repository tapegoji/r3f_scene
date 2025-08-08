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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
        <Button
          onClick={() => setIsExpanded(true)}
          size="icon"
          variant="outline"
          className="w-10 h-10 rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground drag-handle cursor-move"
        >
          <Menu className="h-5 w-5" />
        </Button>
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
      <Card className="w-full h-full shadow-lg relative flex flex-col">
        <CardHeader className="drag-handle cursor-move">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {project && (
                <Button variant="ghost" size="sm" asChild className="p-1">
                  <Link href="/dashboard">
                    <CornerDownLeft className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <CardTitle className="text-sm font-medium">
                {project ? project.name : 'Control Panel'}
              </CardTitle>
            </div>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 pb-4">
              <Accordion 
                type="multiple" 
                value={Object.keys(openSections).filter(key => openSections[key])}
                onValueChange={(values) => {
                  const newOpenSections: Record<string, boolean> = {}
                  controlSections.forEach(section => {
                    newOpenSections[section.title] = values.includes(section.title)
                  })
                  setOpenSections(newOpenSections)
                }}
                className="space-y-1"
              >
                {controlSections.map((section) => (
                  <AccordionItem key={section.title} value={section.title} className="border-b-0">
                    <AccordionTrigger className="hover:no-underline px-2 py-2 hover:bg-accent rounded-md">
                      <div className="flex items-center">
                        <section.icon className="h-4 w-4 mr-2" />
                        <span className="text-left font-medium">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-6 space-y-1 pb-2">
                      {section.items.map((item) => (
                        <Button
                          key={item.title}
                          variant="ghost"
                          className="w-full justify-start px-2 py-1.5 h-auto text-sm text-muted-foreground hover:text-foreground"
                          asChild
                        >
                          <a href={item.url}>
                            {item.title}
                          </a>
                        </Button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </Rnd>
  )
}
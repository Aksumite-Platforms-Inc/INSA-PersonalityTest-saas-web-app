"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  Search,
  X,
  Maximize,
  Minimize,
  MoreHorizontal,
} from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  allowDownload?: boolean
  allowPrint?: boolean
}

export function PDFViewer({ pdfUrl, allowDownload = true, allowPrint = true }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5) // Mock value, would be set by PDF library
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  // In a real implementation, we would use a PDF library like react-pdf
  // For this demo, we'll just simulate the PDF viewer UI

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSearch = () => {
    if (!searchTerm) return

    // In a real implementation, this would search the PDF content
    // For this demo, we'll just simulate search results
    setSearchResults([1, 3, 5])
    setCurrentSearchIndex(0)
    setCurrentPage(1) // Go to first result
  }

  const navigateSearchResults = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return

    const newIndex =
      direction === "next"
        ? (currentSearchIndex + 1) % searchResults.length
        : (currentSearchIndex - 1 + searchResults.length) % searchResults.length

    setCurrentSearchIndex(newIndex)
    setCurrentPage(searchResults[newIndex])
  }

  const handleDownload = () => {
    // In a real implementation, this would download the PDF
    alert("Downloading PDF...")
  }

  const handlePrint = () => {
    // In a real implementation, this would print the PDF
    alert("Printing PDF...")
  }

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Input
              type="number"
              value={currentPage}
              onChange={handlePageChange}
              className="w-12 h-8 text-center"
              min={1}
              max={totalPages}
            />
            <span className="mx-1 text-sm text-muted-foreground">of {totalPages}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
          </Button>

          {isSearchOpen && (
            <div className="flex items-center border rounded-md">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="h-8 border-0"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchResults.length > 0 && (
                <div className="flex items-center px-2 border-l">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigateSearchResults("prev")}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <span className="text-xs">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigateSearchResults("next")}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>

          {allowDownload && (
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}

          {allowPrint && (
            <Button variant="ghost" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          className="bg-white shadow-lg"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
          }}
        >
          {/* This would be replaced with an actual PDF renderer in a real implementation */}
          <div className="w-[595px] h-[842px] border flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-muted-foreground">PDF Preview</p>
              <p className="text-sm text-muted-foreground mt-2">
                In a real implementation, the PDF would be rendered here using a library like react-pdf
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Page {currentPage} of {totalPages}
              </p>
              {searchResults.length > 0 && searchResults.includes(currentPage) && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">Search result highlighted here</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

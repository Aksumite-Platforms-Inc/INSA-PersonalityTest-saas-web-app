"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { TestType } from "@/types/personality-tests"
import { ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw, Printer } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface TestPDF {
  id: string
  testType: TestType
  employeeName: string
  employeeId: string
  organizationName: string
  organizationId: string
  completedAt: string
  pdfUrl: string
}

// Mock function to get PDF data
async function getPDFData(id: string): Promise<TestPDF | null> {
  // In a real app, this would be an API call
  // For this example, we'll return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data
  const mockPDFs: Record<string, TestPDF> = {
    "pdf-1": {
      id: "pdf-1",
      testType: "oejts",
      employeeName: "John Smith",
      employeeId: "emp-1",
      organizationName: "Acme Corp",
      organizationId: "org-1",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      pdfUrl: "/placeholder.pdf",
    },
    "pdf-2": {
      id: "pdf-2",
      testType: "enneagram",
      employeeName: "Jane Doe",
      employeeId: "emp-2",
      organizationName: "Acme Corp",
      organizationId: "org-1",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      pdfUrl: "/placeholder.pdf",
    },
  }

  return mockPDFs[id] || null
}

export default function PDFViewerPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [pdfData, setPDFData] = useState<TestPDF | null>(null)
  const [loading, setLoading] = useState(true)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    async function loadPDFData() {
      try {
        const data = await getPDFData(id)
        setPDFData(data)
      } catch (error) {
        console.error("Error loading PDF data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPDFData()
  }, [id])

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    router.push("/dashboard/superadmin/personality-tests/pdfs")
  }

  const getTestTypeName = (type: TestType) => {
    switch (type) {
      case "oejts":
        return "OEJTS"
      case "enneagram":
        return "Enneagram"
      case "qualtrics":
        return "Qualtrics"
      case "riasec":
        return "RIASEC"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pdfData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">PDF not found. It may have been deleted or moved.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex flex-col items-end">
          <h2 className="text-xl font-semibold">
            {getTestTypeName(pdfData.testType)} Results - {pdfData.employeeName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {pdfData.organizationName} • Completed on {formatDate(pdfData.completedAt)}
          </p>
        </div>
      </div>

      <div className="bg-black rounded-lg overflow-hidden shadow-xl">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-white hover:bg-gray-800">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span>{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-white hover:bg-gray-800">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRotate} className="text-white hover:bg-gray-800">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span>
              Page {pageNumber} of {numPages || "--"}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                className="text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={!numPages || pageNumber >= numPages}
                className="text-white hover:bg-gray-800"
              >
                Next
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handlePrint} className="text-white hover:bg-gray-800">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-gray-800">
              <a href={pdfData.pdfUrl} download={`${pdfData.testType}_${pdfData.employeeName}.pdf`}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>

        <div className="flex justify-center bg-gray-800 p-8 min-h-[600px] print:p-0">
          <Document
            file={pdfData.pdfUrl}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<Skeleton className="h-[600px] w-[450px]" />}
            error={<p className="text-white">Failed to load PDF. Please try again later.</p>}
            className="max-w-full"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-xl"
            />
          </Document>
        </div>
      </div>
    </div>
  )
}

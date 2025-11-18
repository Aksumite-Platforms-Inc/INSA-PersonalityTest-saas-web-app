"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploaderProps {
  accept: string
  maxSize: number // in MB
  onFileSelect: (file: File | File[]) => void
  currentFile?: File | null
  currentFiles?: File[]
  multiple?: boolean
}

export function FileUploader({
  accept,
  maxSize,
  onFileSelect,
  currentFile,
  currentFiles,
  multiple = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const files = Array.from(fileList)

    // Filter files by accepted types and size
    const validFiles = files.filter((file) => {
      const fileType = file.type
      const fileSize = file.size / (1024 * 1024) // Convert to MB

      // Check if file type is accepted
      const isAcceptedType = accept.split(",").some((type) => {
        if (type.startsWith(".")) {
          // If accept is file extension
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        } else {
          // If accept is MIME type
          return fileType.match(new RegExp(type.replace("*", ".*")))
        }
      })

      // Check if file size is within limit
      const isAcceptedSize = fileSize <= maxSize

      return isAcceptedType && isAcceptedSize
    })

    if (validFiles.length === 0) {
      const errorMessage = `Please select valid files (${accept}) under ${maxSize}MB`
      setError(errorMessage)
      toast({
        title: "Invalid File",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }
    
    setError(null)

    // Simulate upload progress
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)

        // Pass files to parent component
        if (multiple) {
          onFileSelect(validFiles)
        } else {
          onFileSelect(validFiles[0])
        }
      }
    }, 200)
  }

  const removeFile = (file: File) => {
    if (multiple && currentFiles) {
      const updatedFiles = currentFiles.filter((f) => f !== file)
      onFileSelect(updatedFiles)
    } else {
      onFileSelect(multiple ? [] : (null as any))
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "xlsx":
      case "xls":
        return <FileText className="h-6 w-6 text-green-500" />
      case "docx":
      case "doc":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "pptx":
      case "ppt":
        return <FileText className="h-6 w-6 text-orange-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileInputChange}
          multiple={multiple}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm font-medium">
            Drag & drop {multiple ? "files" : "a file"} here, or click to browse
          </div>
          <div className="text-xs text-muted-foreground">
            Accepted formats: {accept} (Max size: {maxSize}MB)
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploading...</div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {multiple && currentFiles && currentFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected Files:</div>
          <div className="space-y-2">
            {currentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.name)}
                  <div className="text-sm truncate max-w-[200px]">{file.name}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!multiple && currentFile && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex items-center space-x-2">
            {getFileIcon(currentFile.name)}
            <div className="text-sm truncate max-w-[200px]">{currentFile.name}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              removeFile(currentFile)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

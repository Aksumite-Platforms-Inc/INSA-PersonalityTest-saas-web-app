"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"
import { AlertCircle, FileSpreadsheet, Upload, X, Check, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

export default function UploadEmployeesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationResults, setValidationResults] = useState<{
    valid: boolean
    totalRows: number
    validRows: number
    errors: Array<{ row: number; message: string }>
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if file is Excel
      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls") &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast({
          title: t("upload.invalidFileType"),
          description: t("upload.excelOnly"),
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setValidationResults(null)
    }
  }

  const handleValidate = () => {
    if (!file) return

    setUploading(true)

    // Simulate file validation
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)

        // Mock validation results
        setValidationResults({
          valid: true,
          totalRows: 25,
          validRows: 23,
          errors: [
            { row: 5, message: "Missing email address" },
            { row: 18, message: "Invalid phone number format" },
          ],
        })
      }
    }, 200)
  }

  const handleUpload = () => {
    if (!file || !validationResults) return

    setUploading(true)

    // Simulate upload process
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setUploading(false)

        toast({
          title: t("upload.uploadSuccess"),
          description: t("upload.employeesAdded", { count: validationResults.validRows }),
        })

        setTimeout(() => {
          router.push("/dashboard/branch/users")
        }, 1500)
      }
    }, 100)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle title={t("upload.title")} description={t("upload.description")} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("upload.uploadFile")}</CardTitle>
            <CardDescription>{t("upload.uploadDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">{t("upload.selectFile")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv"
                  disabled={uploading}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={() => setFile(null)} disabled={!file || uploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{t("upload.fileRequirements")}</p>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-md">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            <div className="pt-2">
              <Button onClick={handleValidate} disabled={!file || uploading} className="w-full">
                {uploading && !validationResults ? t("upload.validating") : t("upload.validate")}
              </Button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="text-xs text-right text-muted-foreground">{uploadProgress}%</div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("upload.template")}</CardTitle>
            <CardDescription>{t("upload.templateDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("upload.templateInstructions")}</p>

            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">{t("upload.requiredColumns")}</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>First Name</li>
                <li>Last Name</li>
                <li>Email Address</li>
                <li>Department</li>
                <li>Position</li>
              </ul>

              <h4 className="font-medium mt-4 mb-2">{t("upload.optionalColumns")}</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Phone Number</li>
                <li>Employee ID</li>
                <li>Start Date</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {t("upload.downloadTemplate")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {validationResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("upload.validationResults")}</CardTitle>
              <CardDescription>
                {validationResults.valid ? t("upload.validationSuccess") : t("upload.validationFailed")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-md">
                <div>
                  <div className="text-sm font-medium">{t("upload.totalRows")}</div>
                  <div className="text-2xl font-bold">{validationResults.totalRows}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{t("upload.validRows")}</div>
                  <div className="text-2xl font-bold text-green-600">{validationResults.validRows}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{t("upload.errorRows")}</div>
                  <div className="text-2xl font-bold text-red-600">{validationResults.errors.length}</div>
                </div>
              </div>

              {validationResults.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("upload.validationErrors")}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {validationResults.errors.map((error, index) => (
                        <li key={index}>{t("upload.rowError", { row: error.row, message: error.message })}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null)
                  setValidationResults(null)
                }}
                disabled={uploading}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleUpload} disabled={uploading || validationResults.errors.length > 0}>
                {uploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    {t("upload.uploading")}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t("upload.confirmUpload")}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

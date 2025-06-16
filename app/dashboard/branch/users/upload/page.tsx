"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import {
  AlertCircle,
  FileSpreadsheet,
  Upload,
  X,
  Check,
  Download,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { bulkAddUsers } from "@/services/user.service";

export default function UploadEmployeesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
        toast({
          title: t("upload.invalidFileType"),
          description: t("upload.excelOnly"),
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setValidationResults(null);
    }
  };

  const handleValidate = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const extractedUsers = jsonData.map((row: any, index: number) => {
        const errors = [];
        if (!row["Full Name"]) errors.push("Missing name");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row["Email Address"]))
          errors.push("Invalid email");
        if (row["Phone Number"] && !/^\d{10,15}$/.test(row["Phone Number"]))
          errors.push("Invalid phone");

        return {
          row: index + 2,
          data: {
            name: `${row["Full Name"]}`,
            email: row["Email Address"],
            phone_number: row["Phone Number"] || "",
            position: row["Position"],
            department: row["Department"],
          },
          errors,
        };
      });

      const validRows = extractedUsers.filter((u) => u.errors.length === 0);
      const invalidRows = extractedUsers.filter((u) => u.errors.length > 0);

      setValidationResults({
        valid: invalidRows.length === 0,
        totalRows: extractedUsers.length,
        validRows: validRows, // store full array here
        errors: invalidRows.map((u) => ({
          row: u.row,
          message: u.errors.join(", "),
        })),
      });
    } catch (error) {
      console.error("Validation failed:", error);
      toast({
        title: t("upload.validationError"),
        description: t("upload.failedToValidate"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !validationResults) return;
    setUploading(true);
    try {
      const validUsers = validationResults.validRows.map((u: any) => u.data);
      if (validUsers.length === 0) throw new Error("No valid users to upload.");

      await bulkAddUsers(validUsers);
      toast({
        title: t("upload.uploadSuccess"),
        description: t("upload.employeesAdded", { count: validUsers.length }),
      });
      router.push("/dashboard/branch/users");
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: t("upload.uploadError"),
        description: t("upload.failedToAddUsers"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle
          title={t("upload.title")}
          description={t("upload.description")}
        />

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
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFile(null)}
                    disabled={!file || uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-md">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium flex-1 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={handleValidate}
                  disabled={!file || uploading}
                  className="w-full"
                >
                  {uploading && !validationResults
                    ? t("upload.validating")
                    : t("upload.validate")}
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="text-xs text-right text-muted-foreground">
                    {uploadProgress}%
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("upload.template")}</CardTitle>
              <CardDescription>
                {t("upload.templateDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("upload.templateInstructions")}
              </p>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">
                  {t("upload.requiredColumns")}
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Name</li>
                  <li>Email Address</li>
                  <li>Department</li>
                  <li>Position</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-1/2 flex items-center justify-center"
                  asChild
                >
                  <a href="/NewBulkUserUploadTemplate.xlsx" download>
                    <Download className="mr-2 h-4 w-4" />
                    {t("upload.downloadTemplate")}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {validationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("upload.validationResults")}</CardTitle>
                <CardDescription>
                  {validationResults.valid
                    ? t("upload.validationSuccess")
                    : t("upload.validationFailed")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-md">
                  <div>
                    <div className="text-sm font-medium">
                      {t("upload.totalRows")}
                    </div>
                    <div className="text-2xl font-bold">
                      {validationResults.totalRows}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {t("upload.validRows")}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {validationResults.validRows.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {t("upload.errorRows")}
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {validationResults.errors.length}
                    </div>
                  </div>
                </div>

                {validationResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("upload.validationErrors")}</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {validationResults.errors.map(
                          (error: any, index: number) => (
                            <li key={index}>
                              {t("upload.rowError", {
                                row: error.row,
                                message: error.message,
                              })}
                            </li>
                          ),
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setValidationResults(null);
                  }}
                  disabled={uploading}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || validationResults.errors.length > 0}
                >
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
    </>
  );
}

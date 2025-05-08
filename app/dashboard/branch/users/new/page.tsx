"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";
import { bulkAddUsers } from "@/services/user.service";
import * as XLSX from "xlsx";

export default function NewEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Demo departments
  const departments = [
    "Finance",
    "Human Resources",
    "Information Technology",
    "Marketing",
    "Operations",
    "Research",
    "Management",
    "Administration",
    "Legal",
    "Customer Service",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: t("users.noFile"),
        description: t("users.selectFile"),
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const users = jsonData.map((row: any) => ({
        name: `${row["First Name"]} ${row["Last Name"]}`,
        email: row["Email Address"],
        phone: row["Phone Number"] || "",
        position: row["Position"],
        department: row["Department"],
        status: "active",
      }));

      console.log("Extracted Users:", users); // Log the extracted users

      await bulkAddUsers(users);

      toast({
        title: t("users.bulkAddSuccess"),
        description: t("users.usersAddedSuccessfully"),
        // variant: "success",
      });
      router.push("/dashboard/branch/users");
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast({
        title: t("users.bulkAddError"),
        description: t("users.failedToAddUsers"),
        variant: "destructive",
      });
    }
  };

  // Update the handleSubmit function to use our enhanced toast
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !department || !position) {
      toast({
        title: t("users.missingFields"),
        description: t("users.provideMandatoryFields"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t("users.employeeAdded"),
        description: sendInvite
          ? t("users.inviteSent", { email })
          : t("users.employeeAddedNoInvite"),
      });
      router.push("/dashboard/branch/users");
    }, 1500);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle
        title={t("users.addEmployee")}
        description={t("users.addEmployeeDescription")}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t("users.employeeDetails")}</CardTitle>
            <CardDescription>
              {t("users.employeeDetailsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">{t("users.firstName")} *</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-name">{t("users.lastName")} *</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("users.email")} *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">{t("users.department")} *</Label>
                <Select
                  value={department}
                  onValueChange={setDepartment}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder={t("users.selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">{t("users.position")} *</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("users.phone")}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-id">{t("users.employeeId")}</Label>
                <Input
                  id="employee-id"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="send-invite"
                checked={sendInvite}
                onCheckedChange={setSendInvite}
              />
              <Label htmlFor="send-invite">{t("users.sendInviteEmail")}</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/branch/users")}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("common.adding") : t("common.add")}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.bulkUpload")}</CardTitle>
          <CardDescription>{t("users.bulkUploadDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">{t("users.uploadFile")}</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/branch/users")}
          >
            {t("common.cancel")}
          </Button>
          <Button type="button" onClick={handleFileUpload} disabled={!file}>
            {t("users.upload")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

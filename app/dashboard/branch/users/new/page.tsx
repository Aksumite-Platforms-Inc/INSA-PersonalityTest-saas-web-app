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
import { addUser } from "@/services/user.service";
import * as XLSX from "xlsx";

export default function NewEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const [Name, setName] = useState("");
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

  // Update the handleSubmit function to use our enhanced toast
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Name || !email) {
      toast({
        title: t("users.missingFields"),
        description: t("users.provideMandatoryFields"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        name: Name,
        email,
        department,
        position,
        phone_number: phone,
      };

      // Call the API to add the user
      await addUser(data);

      toast({
        title: "Employee Added",
        description: "Employees has been added successfully.",
        // ),
      });

      // Redirect to the users page
      router.back();
    } catch (error) {
      let errorMessage = t("users.errorAddingEmployee");
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        errorMessage = (error as any).response.data.message;
      }
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }

    // Simulate API call
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
                <Label htmlFor="Name">{t("users.name")} *</Label>
                <Input
                  id="name"
                  value={Name}
                  type="text"
                  placeholder={t("users.name")}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("users.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder={t("users.email")}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">{t("users.department")} </Label>
                <Select value={department} onValueChange={setDepartment}>
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
                <Label htmlFor="position">{t("users.position")} </Label>
                <Input
                  id="position"
                  value={position}
                  type="text"
                  placeholder={t("users.position")}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("users.phone")}</Label>
                <Input
                  id="phone"
                  value={phone}
                  type="tel"
                  placeholder={t("users.phone")}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="send-invite"
                checked={sendInvite}
                onCheckedChange={setSendInvite}
              />
              <Label htmlFor="send-invite">{t("users.sendInviteEmail")}</Label>
            </div> */}
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
    </motion.div>
  );
}

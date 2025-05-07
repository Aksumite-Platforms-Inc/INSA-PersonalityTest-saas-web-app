"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";

export default function NewBranchPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchName || !branchLocation || !adminEmail) {
      toast({
        title: t("branches.missingFields"),
        description: t("branches.provideMandatoryFields"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t("branches.branchCreated"),
        description: t("branches.branchAdminInvited"),
      });
      router.push("/dashboard/organization/branches");
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
        title={t("branches.newBranch")}
        description={t("branches.newBranchDescription")}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("branches.branchDetails")}</CardTitle>
              <CardDescription>
                {t("branches.branchDetailsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">
                  {t("branches.branchName")} *
                </Label>
                <Input
                  id="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder={t("branches.branchNamePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch-location">
                  {t("branches.location")} *
                </Label>
                <Input
                  id="branch-location"
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  placeholder={t("branches.locationPlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch-address">{t("branches.address")}</Label>
                <Textarea
                  id="branch-address"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  placeholder={t("branches.addressPlaceholder")}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branch-phone">{t("branches.phone")}</Label>
                  <Input
                    id="branch-phone"
                    value={branchPhone}
                    onChange={(e) => setBranchPhone(e.target.value)}
                    placeholder={t("branches.phonePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch-email">{t("branches.email")}</Label>
                  <Input
                    id="branch-email"
                    type="email"
                    value={branchEmail}
                    onChange={(e) => setBranchEmail(e.target.value)}
                    placeholder={t("branches.emailPlaceholder")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("branches.branchAdmin")}</CardTitle>
              <CardDescription>
                {t("branches.branchAdminDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">
                  {t("branches.adminEmail")} *
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder={t("branches.adminEmailPlaceholder")}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t("branches.adminEmailHelp")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-name">{t("branches.adminName")}</Label>
                <Input
                  id="admin-name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder={t("branches.adminNamePlaceholder")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/organization/branches")}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("common.creating") : t("common.create")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

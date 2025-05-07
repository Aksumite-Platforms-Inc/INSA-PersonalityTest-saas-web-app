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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBranch, assignBranchAdmin } from "@/services/branch.service";
import { getOrganizationId } from "@/utils/tokenUtils";

export default function NewBranchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const organizationId = getOrganizationId(); // Get the organization ID from the token
  const [name, setBranchName] = useState("");
  // const [branchLocation, setBranchLocation] = useState("");
  const [address, setBranchAddress] = useState("");
  const [phone_number, setBranchPhone] = useState("");
  const [email, setBranchEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !phone_number || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name,
        email,
        phone_number,
        address,
      };

      console.log("Payload being sent:", data);

      // Call the API to create the branch
      const branch = await createBranch(Number(organizationId), data);

      toast({
        title: "Branch created",
        description: `${branch.name} has been created successfully.`,
      });

      // // Call the API to assign the administrator
      // await assignBranchAdmin(1, branch.id, adminEmail); // Replace `1` with the actual organization ID

      // toast({
      //   title: "Administrator assigned",
      //   description: `Admin ${adminName} has been assigned successfully.`,
      // });

      router.push("/dashboard/organization/branches");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Add New Branch"
        description="Create a new branch in the organization"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Branch Details</CardTitle>
              <CardDescription>
                Basic information about the branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name *</Label>
                <Input
                  id="branch-name"
                  value={name}
                  onChange={(e) => setBranchName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch-address">Address *</Label>
                <Textarea
                  id="branch-address"
                  value={address}
                  onChange={(e) => setBranchAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-phone">Phone *</Label>
                <Input
                  id="branch-phone"
                  value={phone_number}
                  onChange={(e) => setBranchPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-email">Email *</Label>
                <Input
                  id="branch-email"
                  type="email"
                  value={email}
                  onChange={(e) => setBranchEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrator Account</CardTitle>
              <CardDescription>
                Assign an admin account for this branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Branch"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

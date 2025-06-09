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
import { createBranch } from "@/services/branch.service";
import { getOrganizationId } from "@/utils/tokenUtils";
import { use } from "react";

export default function NewBranchPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setBranchName] = useState("");
  const { organizationId } = use(params);
  // const [branchLocation, setBranchLocation] = useState("");
  const [address, setBranchAddress] = useState("");
  const [phone_number, setBranchPhone] = useState("");
  const [email, setBranchEmail] = useState("");
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

      console.log("Payload being sent:", name, email, phone_number, address);

      // Call the API to create the branch
      const branch = await createBranch(Number(organizationId), data);

      toast({
        title: "Branch created",
        description: "Branch has been created successfully.",
      });

      router.back();
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
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
        title: "Error",
        description: errorMessage,
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
        <div className="grid gap-6">
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-phone">Phone *</Label>
                <Input
                  id="branch-phone"
                  value={phone_number}
                  onChange={(e) => setBranchPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-email">Email *</Label>
                <Input
                  id="branch-email"
                  type="email"
                  value={email}
                  onChange={(e) => setBranchEmail(e.target.value)}
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

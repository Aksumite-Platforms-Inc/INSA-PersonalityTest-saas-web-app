"use client";

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getBranchById, updateBranch } from "@/services/branch.service";
import { getOrganizationId, getBranchId } from "@/utils/tokenUtils";
import { number } from "framer-motion";

export default function BranchSettingsPage() {
  const { toast } = useToast();
  const [branchName, setBranchName] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const orgId = getOrganizationId();
        setOrganizationId(orgId);
        const branchId = getBranchId();
        console.log("[BranchSettings] orgId:", orgId, "branchId:", branchId); // Debug log
        if (!orgId || !branchId) {
          toast({
            title: "Error",
            description:
              "Missing organization or branch ID. Please log in again or contact support.",
          });
          setLoading(false);
          return;
        }
        const branch = await getBranchById(orgId, Number(branchId));
        setBranchName(branch.name || "");
        setBranchEmail(branch.email || "");
        setBranchPhone(branch.phone_number || "");
        setBranchAddress(branch.address || "");
      } catch (error) {
        let errorMessage = "Something went wrong. Please check your internet.";
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
        setLoading(false);
      }
    };
    fetchBranch();
  }, []); // Only run once on mount

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const branchId = getBranchId();
      if (!branchId) throw new Error("Branch ID missing");
      await updateBranch(Number(organizationId), Number(branchId), {
        name: branchName,
        email: branchEmail,
        phone_number: branchPhone,
        address: branchAddress,
      });
      toast({
        title: "Settings saved",
        description: "Branch profile has been updated successfully.",
      });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update branch info." });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!organizationId || !getBranchId()) {
    return (
      <div className="text-red-500">
        Missing organization or branch ID. Please log in again or contact
        support.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Branch Settings"
        description="Manage your branch settings and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Branch Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branch Information</CardTitle>
              <CardDescription>
                Update your branch's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input
                  id="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-email">Email</Label>
                <Input
                  id="branch-email"
                  type="email"
                  value={branchEmail}
                  onChange={(e) => setBranchEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-phone">Phone</Label>
                <Input
                  id="branch-phone"
                  value={branchPhone}
                  onChange={(e) => setBranchPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-address">Address</Label>
                <Input
                  id="branch-address"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

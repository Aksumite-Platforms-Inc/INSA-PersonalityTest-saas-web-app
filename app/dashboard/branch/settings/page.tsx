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

export default function BranchSettingsPage() {
  const { toast } = useToast();
  const [branchName, setBranchName] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const orgId = getOrganizationId();
        const branchId = getBranchId();
        if (!orgId || !branchId) return;
        const branch = await getBranchById(orgId, branchId);
        setBranchName(branch.name || "");
        setBranchEmail(branch.email || "");
        setBranchPhone(branch.phone_number || "");
        setBranchAddress(branch.address || "");
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch branch info." });
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [toast]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const branchId = getBranchId();
      if (!branchId) throw new Error("Branch ID missing");
      await updateBranch(branchId, {
        id: branchId,
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

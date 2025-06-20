"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getOrganizationId } from "@/utils/tokenUtils";
import {
  getOrganizationById,
  updateOrganization,
} from "@/services/organization.service";

export default function OrganizationSettingsPage() {
  const { toast } = useToast();
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  // const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgSector, setOrgSector] = useState("");
  const [orgStatus, setOrgStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      setLoading(true);
      try {
        const id = getOrganizationId();
        setOrgId(id);
        if (!id) throw new Error("Organization ID not found");
        const org = await getOrganizationById(id);
        setOrgName(org.name || "");
        setOrgEmail(org.email || "");
        // setOrgPhone(org.phone_number || "");
        setOrgAddress(org.address || "");
        setOrgSector(org.sector || "");
        setOrgStatus(org.status || "");
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load organization info",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleSaveProfile = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      await updateOrganization(orgId, {
        name: orgName,
        email: orgEmail,
        // phone_number: orgPhone,
        address: orgAddress,
        sector: orgSector,
        status: orgStatus,
      });
      toast({
        title: "Settings saved",
        description: "Organization profile has been updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update organization info",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Organization Settings"
        description="Manage your organization settings and preferences"
      />
      {loading ? (
        <div>Loading organization info...</div>
      ) : (
        <Tabs defaultValue="profile" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="profile">Organization Profile</TabsTrigger>
          </TabsList> */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Update your organization's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Email</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="org-phone">Phone</Label>
                  <Input
                    id="org-phone"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="org-address">Address</Label>
                  <Input
                    id="org-address"
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-sector">Sector</Label>
                  <Input
                    id="org-sector"
                    value={orgSector}
                    onChange={(e) => setOrgSector(e.target.value)}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="org-status">Status</Label>
                  <select
                    id="org-status"
                    value={orgStatus}
                    onChange={(e) => setOrgStatus(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div> */}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

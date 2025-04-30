"use client";

import { useState } from "react";
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

export default function OrganizationSettingsPage() {
  const { toast } = useToast();
  const [orgName, setOrgName] = useState("Ministry of Education");
  const [orgEmail, setOrgEmail] = useState("info@moe.gov.et");
  const [orgPhone, setOrgPhone] = useState("+251 111 234567");
  const [orgAddress, setOrgAddress] = useState("Addis Ababa, Ethiopia");

  const [autoAssignTests, setAutoAssignTests] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to the Ministry of Education Personality Testing Platform. This assessment will help us understand your strengths and areas for development."
  );

  const handleSaveProfile = () => {
    toast({
      title: "Settings saved",
      description: "Organization profile has been updated successfully.",
    });
  };

  const handleSaveTests = () => {
    toast({
      title: "Settings saved",
      description: "Test settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Organization Settings"
        description="Manage your organization settings and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Organization Profile</TabsTrigger>
        </TabsList>

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
              <div className="space-y-2">
                <Label htmlFor="org-phone">Phone</Label>
                <Input
                  id="org-phone"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-address">Address</Label>
                <Input
                  id="org-address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure test settings for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-assign"
                  checked={autoAssignTests}
                  onCheckedChange={setAutoAssignTests}
                />
                <Label htmlFor="auto-assign">
                  Automatically assign tests to new employees
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  This message will be displayed to employees before they start
                  a test.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTests}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { fetchUserInfo, updateMember } from "@/services/user.service";
import { getOrganizationId, getUserId } from "@/utils/tokenUtils";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userId, setUserId] = useState<number | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = getUserId();
    const storedOrgId = getOrganizationId();
    if (storedUserId) setUserId(storedUserId);
    if (storedOrgId) setOrgId(storedOrgId);
  }, []);

  useEffect(() => {
    if (userId === null || orgId === null) return;
    console.log("ProfilePage: userId", userId, "orgId", orgId);
    const loadUserInfo = async () => {
      setLoading(true);
      try {
        const userInfo = await fetchUserInfo(Number(orgId), Number(userId));
        setUserId(userInfo.id);
        setOrgId(userInfo.org_id);
        setFullName(userInfo.name);
        setEmail(userInfo.email);
        setPosition(userInfo.position);
        setDepartment(userInfo.department);
      } catch (error) {
        console.error("Failed to load user information:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserInfo();
  }, [userId, orgId]);

  const handleSaveProfile = async () => {
    if (userId === null || orgId === null) {
      toast({
        title: "Error",
        description: "User or organization ID is missing.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await updateMember(userId, orgId, {
        name: fullName,
        email,
        position,
        department,
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <PageTitle
        title="Your Profile"
        description="View and edit your personal information"
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} disabled={loading}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

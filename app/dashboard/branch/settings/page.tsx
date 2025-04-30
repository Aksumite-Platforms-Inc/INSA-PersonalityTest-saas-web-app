"use client"

import { useState } from "react"
import { PageTitle } from "@/components/page-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function BranchSettingsPage() {
  const { toast } = useToast()
  const [branchName, setBranchName] = useState("Addis Ababa HQ")
  const [branchEmail, setBranchEmail] = useState("addis@moe.gov.et")
  const [branchPhone, setBranchPhone] = useState("+251 111 234567")
  const [branchAddress, setBranchAddress] = useState("Addis Ababa, Ethiopia")
  const [branchManager, setBranchManager] = useState("Abebe Kebede")
  
  const handleSaveProfile = () => {
    toast({
      title: "Settings saved",
      description: "Branch profile has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Branch Settings" description="Manage your branch settings and preferences" />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Branch Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branch Information</CardTitle>
              <CardDescription>Update your branch's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Branch Name</Label>
                <Input id="branch-name" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
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
                <Input id="branch-phone" value={branchPhone} onChange={(e) => setBranchPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-address">Address</Label>
                <Input id="branch-address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch-manager">Branch Manager</Label>
                <Input id="branch-manager" value={branchManager} onChange={(e) => setBranchManager(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

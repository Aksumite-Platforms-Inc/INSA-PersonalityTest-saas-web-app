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
  const [notifyTestCompletion, setNotifyTestCompletion] = useState(true)
  const [notifyLowScores, setNotifyLowScores] = useState(true)
  const [reminderFrequency, setReminderFrequency] = useState("weekly")
  const [testTimeLimit, setTestTimeLimit] = useState("60")
  const [allowRetakes, setAllowRetakes] = useState(true)
  const [maxRetakes, setMaxRetakes] = useState("2")

  const handleSaveProfile = () => {
    toast({
      title: "Settings saved",
      description: "Branch profile has been updated successfully.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Settings saved",
      description: "Notification settings have been updated successfully.",
    })
  }

  const handleSaveTests = () => {
    toast({
      title: "Settings saved",
      description: "Test settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Branch Settings" description="Manage your branch settings and preferences" />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Branch Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="tests">Test Settings</TabsTrigger>
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

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-test-completion"
                  checked={notifyTestCompletion}
                  onCheckedChange={setNotifyTestCompletion}
                />
                <Label htmlFor="notify-test-completion">Notify on test completion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notify-low-scores" checked={notifyLowScores} onCheckedChange={setNotifyLowScores} />
                <Label htmlFor="notify-low-scores">Notify on low test scores</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Test Reminder Frequency</Label>
                <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Configure test settings for your branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time-limit">Test Time Limit (minutes)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  value={testTimeLimit}
                  onChange={(e) => setTestTimeLimit(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-retakes" checked={allowRetakes} onCheckedChange={setAllowRetakes} />
                <Label htmlFor="allow-retakes">Allow test retakes</Label>
              </div>
              {allowRetakes && (
                <div className="space-y-2">
                  <Label htmlFor="max-retakes">Maximum Retakes</Label>
                  <Input
                    id="max-retakes"
                    type="number"
                    value={maxRetakes}
                    onChange={(e) => setMaxRetakes(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveTests}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

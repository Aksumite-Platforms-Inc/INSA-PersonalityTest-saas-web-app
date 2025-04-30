"use client"

import { useState } from "react"
import { PageTitle } from "@/components/page-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeSettingsPage() {
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [resultSharing, setResultSharing] = useState(false)

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call an API to change the password
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    })

    // Clear the form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Settings saved",
      description: "Notification preferences have been updated successfully.",
    })
  }

  const handleSavePrivacy = () => {
    toast({
      title: "Settings saved",
      description: "Privacy settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Account Settings" description="Manage your account settings and preferences" />

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
          
          
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="reminder-notifications"
                  checked={reminderNotifications}
                  onCheckedChange={setReminderNotifications}
                />
                <Label htmlFor="reminder-notifications">Test Reminders</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
          
      
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="result-sharing" checked={resultSharing} onCheckedChange={setResultSharing} />
                <div>
                  <Label htmlFor="result-sharing">Share Test Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your test results to be shared anonymously for research purposes
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [fullName, setFullName] = useState("Demo User")
  const [email, setEmail] = useState("user@example.com")
  const [phone, setPhone] = useState("+251 911 123456")
  const [position, setPosition] = useState("Software Engineer")
  const [department, setDepartment] = useState("IT")
  const [bio, setBio] = useState("Experienced software engineer with a focus on web development and user experience.")
  const [avatarUrl, setAvatarUrl] = useState("")

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <PageTitle title="Your Profile" description="View and edit your personal information" />

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
              <AvatarFallback className="text-2xl">
                {fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
         
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

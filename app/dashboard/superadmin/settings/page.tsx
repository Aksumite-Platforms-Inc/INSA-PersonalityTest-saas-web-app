"use client";

// import { useState } from "react"
// import { PageTitle } from "@/components/page-title"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"

export default function SuperadminSettingsPage() {
  // const { toast } = useToast()
  // const [platformName, setPlatformName] = useState("INSA Personality Testing Platform")
  // const [supportEmail, setSupportEmail] = useState("support@insa-testing.gov.et")
  // const [dataRetentionDays, setDataRetentionDays] = useState("365")
  // const [enableAuditLogs, setEnableAuditLogs] = useState(true)
  // const [enableMFA, setEnableMFA] = useState(true)
  // const [passwordExpiryDays, setPasswordExpiryDays] = useState("90")
  // const [minPasswordLength, setMinPasswordLength] = useState("12")
  // const [requireSpecialChars, setRequireSpecialChars] = useState(true)
  // const [apiKey, setApiKey] = useState("sk_test_123456789abcdefghijklmnopqrstuvwxyz")
  // const [webhookUrl, setWebhookUrl] = useState("https://api.insa-testing.gov.et/webhooks")

  // const handleSaveGeneral = () => {
  //   toast({
  //     title: "Settings saved",
  //     description: "General settings have been updated successfully.",
  //   })
  // }

  // const handleSaveSecurity = () => {
  //   toast({
  //     title: "Settings saved",
  //     description: "Security settings have been updated successfully.",
  //   })
  // }

  // const handleSaveAPI = () => {
  //   toast({
  //     title: "Settings saved",
  //     description: "API settings have been updated successfully.",
  //   })
  // }

  // const regenerateApiKey = () => {
  //   // In a real app, this would call an API to regenerate the key
  //   setApiKey(`sk_test_${Math.random().toString(36).substring(2, 15)}`)
  //   toast({
  //     title: "API Key regenerated",
  //     description: "A new API key has been generated. Make sure to save it.",
  //   })
  // }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Settings Coming Soon</h1>
        <p className="text-muted-foreground">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
    // <div className="space-y-6">
    //   <PageTitle title="Platform Settings" description="Manage global platform settings and configurations" />

    //   <Tabs defaultValue="general" className="space-y-4">
    //     <TabsList>
    //       <TabsTrigger value="general">General</TabsTrigger>
    //       <TabsTrigger value="security">Security</TabsTrigger>
    //       <TabsTrigger value="api">API & Integrations</TabsTrigger>
    //     </TabsList>

    //     <TabsContent value="general" className="space-y-4">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Platform Information</CardTitle>
    //           <CardDescription>Configure basic platform settings</CardDescription>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div className="space-y-2">
    //             <Label htmlFor="platform-name">Platform Name</Label>
    //             <Input id="platform-name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="support-email">Support Email</Label>
    //             <Input
    //               id="support-email"
    //               type="email"
    //               value={supportEmail}
    //               onChange={(e) => setSupportEmail(e.target.value)}
    //             />
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="data-retention">Data Retention Period (days)</Label>
    //             <Input
    //               id="data-retention"
    //               type="number"
    //               value={dataRetentionDays}
    //               onChange={(e) => setDataRetentionDays(e.target.value)}
    //             />
    //           </div>
    //           <div className="flex items-center space-x-2">
    //             <Switch id="audit-logs" checked={enableAuditLogs} onCheckedChange={setEnableAuditLogs} />
    //             <Label htmlFor="audit-logs">Enable Audit Logs</Label>
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           <Button onClick={handleSaveGeneral}>Save Changes</Button>
    //         </CardFooter>
    //       </Card>
    //     </TabsContent>

    //     <TabsContent value="security" className="space-y-4">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Security Settings</CardTitle>
    //           <CardDescription>Configure platform security settings</CardDescription>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div className="flex items-center space-x-2">
    //             <Switch id="mfa" checked={enableMFA} onCheckedChange={setEnableMFA} />
    //             <Label htmlFor="mfa">Require Multi-Factor Authentication</Label>
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="password-expiry">Password Expiry (days)</Label>
    //             <Input
    //               id="password-expiry"
    //               type="number"
    //               value={passwordExpiryDays}
    //               onChange={(e) => setPasswordExpiryDays(e.target.value)}
    //             />
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="min-password-length">Minimum Password Length</Label>
    //             <Input
    //               id="min-password-length"
    //               type="number"
    //               value={minPasswordLength}
    //               onChange={(e) => setMinPasswordLength(e.target.value)}
    //             />
    //           </div>
    //           <div className="flex items-center space-x-2">
    //             <Switch id="special-chars" checked={requireSpecialChars} onCheckedChange={setRequireSpecialChars} />
    //             <Label htmlFor="special-chars">Require Special Characters in Passwords</Label>
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           <Button onClick={handleSaveSecurity}>Save Changes</Button>
    //         </CardFooter>
    //       </Card>
    //     </TabsContent>

    //     <TabsContent value="api" className="space-y-4">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>API Settings</CardTitle>
    //           <CardDescription>Manage API keys and webhook configurations</CardDescription>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div className="space-y-2">
    //             <Label htmlFor="api-key">API Key</Label>
    //             <div className="flex space-x-2">
    //               <Input id="api-key" value={apiKey} readOnly className="font-mono" />
    //               <Button variant="outline" onClick={regenerateApiKey}>
    //                 Regenerate
    //               </Button>
    //             </div>
    //             <p className="text-sm text-muted-foreground">
    //               This key provides full access to the API. Keep it secure.
    //             </p>
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="webhook-url">Webhook URL</Label>
    //             <Input id="webhook-url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
    //             <p className="text-sm text-muted-foreground">
    //               URL to receive webhook notifications for platform events.
    //             </p>
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           <Button onClick={handleSaveAPI}>Save Changes</Button>
    //         </CardFooter>
    //       </Card>
    //     </TabsContent>
    //   </Tabs>
    // </div>
  );
}

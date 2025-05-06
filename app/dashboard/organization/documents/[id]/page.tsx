"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, FileText, Shield, Calendar, User, Clock, MessageSquare, Send } from "lucide-react"
import { PDFViewer } from "@/components/document/pdf-viewer"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock document data
const documentData = {
  id: "1",
  title: "Annual Personality Assessment Report",
  type: "report",
  sender: "INSA Super Admin",
  senderEmail: "admin@insa.gov.et",
  receivedAt: "2023-05-15T10:30:00",
  description:
    "This report provides a comprehensive analysis of personality assessment results across all departments within your organization. It includes trends, insights, and recommendations for talent development and team composition.",
  pdfUrl: "/sample.pdf", // This would be a real URL in production
  confidential: true,
  expiryDate: "2023-12-31",
  attachments: [
    {
      id: "a1",
      name: "Department Breakdown.xlsx",
      type: "xlsx",
      size: "1.2 MB",
    },
    {
      id: "a2",
      name: "Implementation Guide.pdf",
      type: "pdf",
      size: "3.5 MB",
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Abebe Kebede",
      authorRole: "Organization Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Thank you for sharing this report. I'll review it with my team.",
      timestamp: "2023-05-16T09:15:00",
    },
    {
      id: "c2",
      author: "INSA Super Admin",
      authorRole: "Super Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Please let me know if you have any questions about the implementation recommendations.",
      timestamp: "2023-05-16T10:22:00",
    },
  ],
}

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("document")
  const [newComment, setNewComment] = useState("")

  // In a real app, we would fetch the document data based on the ID
  // For demo purposes, we'll use the static data
  const documentId = params.id

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    // In a real app, this would send the comment to an API
    alert("Comment added: " + newComment)
    setNewComment("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle
          title={documentData.title}
          description={`Received on ${formatDate(documentData.receivedAt)} from ${documentData.sender}`}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{documentData.title}</CardTitle>
              {documentData.confidential && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Shield className="h-3 w-3 mr-1" /> Confidential
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {documentData.type.charAt(0).toUpperCase() + documentData.type.slice(1)}
            </Badge>
          </div>
          <CardDescription className="mt-1">{documentData.description}</CardDescription>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>
                From: {documentData.sender} ({documentData.senderEmail})
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Received: {formatDate(documentData.receivedAt)}</span>
            </div>
            {documentData.expiryDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Expires: {new Date(documentData.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="document" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="attachments">Attachments ({documentData.attachments.length})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({documentData.comments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="document" className="mt-4">
              <div className="border rounded-md h-[600px] bg-muted/30">
                <PDFViewer pdfUrl={documentData.pdfUrl} />
              </div>
            </TabsContent>
            <TabsContent value="attachments" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Attached Files</h3>
                <div className="space-y-2">
                  {documentData.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(attachment.type)}
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  {documentData.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                        <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground ml-2">{comment.authorRole}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </h3>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

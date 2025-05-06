"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Bell } from "lucide-react";

// Mock data for document notifications
const documentNotifications = [
  {
    id: "1",
    title: "Annual Personality Assessment Report",
    type: "report",
    sender: "INSA Super Admin",
    receivedAt: "2023-05-15",
    status: "unread",
  },
  {
    id: "4",
    title: "Quarterly Performance Analysis",
    type: "report",
    sender: "INSA Super Admin",
    receivedAt: "2023-08-05",
    status: "unread",
  },
];

export function DocumentNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(documentNotifications);

  const unreadCount = notifications.filter(
    (doc) => doc.status === "unread"
  ).length;

  const handleViewDocument = (id: string) => {
    router.push(`/dashboard/organization/documents/${id}`);
  };

  const handleViewAll = () => {
    router.push("/dashboard/organization/documents");
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "assessment":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "guide":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "policy":
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Document Notifications
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} New
            </Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No new document notifications
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  notification.status === "unread"
                    ? "bg-blue-50/30 border border-blue-100"
                    : "border"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getDocumentTypeIcon(notification.type)}
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      From: {notification.sender} •{" "}
                      {new Date(notification.receivedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {notification.status === "unread" && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewDocument(notification.id)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

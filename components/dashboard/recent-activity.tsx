"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Demo data
const activities = [
  {
    id: 1,
    user: "John Doe",
    userInitials: "JD",
    action: "completed",
    target: "Personality Assessment Test",
    time: "5 minutes ago",
    organization: "Ministry of Education",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    userInitials: "SJ",
    action: "started",
    target: "Leadership Evaluation",
    time: "15 minutes ago",
    organization: "Ministry of Health",
  },
  {
    id: 3,
    user: "Admin User",
    userInitials: "AU",
    action: "created",
    target: "New Organization: Ministry of Agriculture",
    time: "1 hour ago",
    organization: "INSA",
  },
  {
    id: 4,
    user: "Michael Brown",
    userInitials: "MB",
    action: "updated",
    target: "Branch Settings",
    time: "2 hours ago",
    organization: "Ministry of Defense",
  },
  {
    id: 5,
    user: "Emma Wilson",
    userInitials: "EW",
    action: "invited",
    target: "15 new users",
    time: "3 hours ago",
    organization: "Ministry of Finance",
  },
]

export function RecentActivity() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <Avatar>
            <AvatarFallback>{activity.userInitials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{" "}
              <Badge variant="outline" className="ml-2">
                {activity.action}
              </Badge>{" "}
              {activity.target}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{activity.time}</span>
              <span className="mx-1">•</span>
              <span>{activity.organization}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

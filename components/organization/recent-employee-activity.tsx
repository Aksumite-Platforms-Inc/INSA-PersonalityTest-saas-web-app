"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Demo data
const activities = [
  {
    id: 1,
    employee: "Abebe Kebede",
    employeeInitials: "AK",
    action: "completed",
    target: "Personality Assessment Test",
    time: "10 minutes ago",
    branch: "Addis Ababa HQ",
  },
  {
    id: 2,
    employee: "Tigist Haile",
    employeeInitials: "TH",
    action: "started",
    target: "Leadership Evaluation",
    time: "25 minutes ago",
    branch: "Bahir Dar",
  },
  {
    id: 3,
    employee: "Dawit Tadesse",
    employeeInitials: "DT",
    action: "completed",
    target: "Team Compatibility Test",
    time: "1 hour ago",
    branch: "Hawassa",
  },
  {
    id: 4,
    employee: "Hiwot Girma",
    employeeInitials: "HG",
    action: "abandoned",
    target: "Stress Management Assessment",
    time: "2 hours ago",
    branch: "Mekelle",
  },
  {
    id: 5,
    employee: "Solomon Tesfaye",
    employeeInitials: "ST",
    action: "started",
    target: "Personality Assessment Test",
    time: "3 hours ago",
    branch: "Dire Dawa",
  },
]

export function RecentEmployeeActivity() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <Avatar>
            <AvatarFallback>{activity.employeeInitials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.employee}</span>{" "}
              <Badge
                variant="outline"
                className={`ml-2 ${
                  activity.action === "completed"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : activity.action === "abandoned"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {activity.action}
              </Badge>{" "}
              {activity.target}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{activity.time}</span>
              <span className="mx-1">•</span>
              <span>{activity.branch}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

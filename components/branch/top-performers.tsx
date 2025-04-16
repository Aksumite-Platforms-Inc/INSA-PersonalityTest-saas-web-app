"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Demo data
const topPerformers = [
  {
    id: 1,
    name: "Meron Alemu",
    initials: "MA",
    position: "Senior Analyst",
    score: 96,
    strengths: ["Leadership", "Problem Solving", "Communication"],
  },
  {
    id: 2,
    name: "Yonas Bekele",
    initials: "YB",
    position: "Project Manager",
    score: 94,
    strengths: ["Team Building", "Strategic Planning", "Adaptability"],
  },
  {
    id: 3,
    name: "Sara Tesfaye",
    initials: "ST",
    position: "Research Specialist",
    score: 92,
    strengths: ["Analytical Thinking", "Attention to Detail", "Innovation"],
  },
  {
    id: 4,
    name: "Dawit Haile",
    initials: "DH",
    position: "Operations Lead",
    score: 90,
    strengths: ["Process Optimization", "Decision Making", "Resilience"],
  },
  {
    id: 5,
    name: "Hanna Girma",
    initials: "HG",
    position: "Technical Specialist",
    score: 89,
    strengths: ["Technical Expertise", "Problem Solving", "Teamwork"],
  },
]

export function TopPerformers() {
  return (
    <div className="space-y-6">
      {topPerformers.map((performer) => (
        <div key={performer.id} className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-4 min-w-[240px]">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">{performer.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{performer.name}</p>
              <p className="text-sm text-muted-foreground">{performer.position}</p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score: {performer.score}/100</span>
              <span className="text-sm font-medium">{performer.score}%</span>
            </div>
            <Progress value={performer.score} className="h-2" />
          </div>

          <div className="min-w-[200px]">
            <p className="text-sm font-medium mb-1">Key Strengths:</p>
            <div className="flex flex-wrap gap-1">
              {performer.strengths.map((strength) => (
                <span
                  key={strength}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

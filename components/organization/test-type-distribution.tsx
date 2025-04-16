"use client"

import { useTheme } from "next-themes"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Demo data
const data = [
  { name: "Personality Assessment", completed: 420, inProgress: 85, notStarted: 45 },
  { name: "Leadership Evaluation", completed: 180, inProgress: 65, notStarted: 35 },
  { name: "Team Compatibility", completed: 150, inProgress: 70, notStarted: 30 },
  { name: "Stress Management", completed: 95, inProgress: 47, notStarted: 23 },
]

export function TestTypeDistribution() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Legend />
        <Bar name="Completed" dataKey="completed" stackId="a" fill="#4ade80" />
        <Bar name="In Progress" dataKey="inProgress" stackId="a" fill="#facc15" />
        <Bar name="Not Started" dataKey="notStarted" stackId="a" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  )
}

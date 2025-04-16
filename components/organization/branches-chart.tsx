"use client"

import { useTheme } from "next-themes"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Demo data
const data = [
  { name: "Addis Ababa HQ", completion: 92, avgScore: 78 },
  { name: "Bahir Dar", completion: 85, avgScore: 72 },
  { name: "Hawassa", completion: 78, avgScore: 75 },
  { name: "Mekelle", completion: 65, avgScore: 68 },
  { name: "Dire Dawa", completion: 72, avgScore: 70 },
  { name: "Adama", completion: 80, avgScore: 74 },
  { name: "Gondar", completion: 68, avgScore: 69 },
  { name: "Jimma", completion: 75, avgScore: 71 },
]

export function BranchesChart() {
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
          bottom: 70,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} angle={-45} textAnchor="end" height={70} />
        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Legend />
        <Bar name="Completion Rate (%)" dataKey="completion" fill="#8884d8" />
        <Bar name="Average Score" dataKey="avgScore" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

"use client"

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Demo data
const data = [
  { date: "2023-01-01", completions: 12 },
  { date: "2023-01-08", completions: 19 },
  { date: "2023-01-15", completions: 15 },
  { date: "2023-01-22", completions: 22 },
  { date: "2023-01-29", completions: 28 },
  { date: "2023-02-05", completions: 24 },
  { date: "2023-02-12", completions: 30 },
  { date: "2023-02-19", completions: 25 },
  { date: "2023-02-26", completions: 32 },
  { date: "2023-03-05", completions: 35 },
  { date: "2023-03-12", completions: 29 },
  { date: "2023-03-19", completions: 38 },
]

export function TestCompletionTimeline() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis dataKey="formattedDate" stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
          labelFormatter={(value) => `Date: ${value}`}
        />
        <Line
          type="monotone"
          dataKey="completions"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name="Test Completions"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

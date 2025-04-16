"use client"

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Demo data
const data = [
  { name: "Jan", tests: 65 },
  { name: "Feb", tests: 120 },
  { name: "Mar", tests: 180 },
  { name: "Apr", tests: 250 },
  { name: "May", tests: 310 },
  { name: "Jun", tests: 420 },
  { name: "Jul", tests: 500 },
  { name: "Aug", tests: 400 },
]

export function TestsCompletedChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
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
        <Line type="monotone" dataKey="tests" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

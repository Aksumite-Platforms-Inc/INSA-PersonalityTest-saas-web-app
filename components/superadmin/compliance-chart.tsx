"use client"

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Demo data
const data = [
  { month: "Jan", overall: 88.2, dataRetention: 95.0, security: 92.5, testing: 85.0 },
  { month: "Feb", overall: 89.5, dataRetention: 96.2, security: 93.0, testing: 86.8 },
  { month: "Mar", overall: 90.1, dataRetention: 97.5, security: 94.2, testing: 87.5 },
  { month: "Apr", overall: 91.0, dataRetention: 98.0, security: 95.0, testing: 88.9 },
  { month: "May", overall: 91.8, dataRetention: 98.5, security: 96.2, testing: 89.7 },
  { month: "Jun", overall: 92.4, dataRetention: 100.0, security: 98.7, testing: 90.5 },
]

export function ComplianceChart() {
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
        <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} />
        <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} domain={[80, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="overall"
          name="Overall Compliance"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line type="monotone" dataKey="dataRetention" name="Data Retention" stroke="#82ca9d" />
        <Line type="monotone" dataKey="security" name="Security" stroke="#ffc658" />
        <Line type="monotone" dataKey="testing" name="Testing Compliance" stroke="#ff8042" />
      </LineChart>
    </ResponsiveContainer>
  )
}

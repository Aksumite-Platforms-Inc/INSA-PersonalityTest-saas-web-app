"use client"

import { useTheme } from "next-themes"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

// Demo data - personality traits on a scale of 0-100
const data = [
  { trait: "Openness", value: 80 },
  { trait: "Conscientiousness", value: 65 },
  { trait: "Extraversion", value: 45 },
  { trait: "Agreeableness", value: 70 },
  { trait: "Neuroticism", value: 30 },
  { trait: "Resilience", value: 75 },
  { trait: "Adaptability", value: 85 },
]

export function PersonalityChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={isDark ? "#374151" : "#e5e7eb"} />
        <PolarAngleAxis dataKey="trait" tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }} />
        <Radar name="Personality Profile" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

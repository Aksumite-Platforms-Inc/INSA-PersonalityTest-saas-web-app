"use client";

import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompletionTrendChartProps {
  data: {
    period: string;
    completionRate: number;
    completed: number;
    total: number;
  }[];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis
          dataKey="period"
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
        />
        <YAxis
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
          formatter={(value: number) => [`${value}%`, "Completion Rate"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="completionRate"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TestCompletionRateChartProps {
  data: {
    name: string;
    completed: number;
    incomplete: number;
    total: number;
  }[];
}

export function TestCompletionRateChart({ data }: TestCompletionRateChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = data.map((item) => ({
    name: item.name,
    Completed: item.completed,
    Incomplete: item.incomplete,
    "Completion Rate": item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis
          dataKey="name"
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
        />
        <YAxis
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Legend />
        <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Incomplete" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}


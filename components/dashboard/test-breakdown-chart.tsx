"use client";

import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface TestBreakdownChartProps {
  data: {
    mbti: number;
    bigFive: number;
    riasec: number;
    enneagram: number;
  };
}

const COLORS = {
  mbti: "#3b82f6",
  bigFive: "#10b981",
  riasec: "#f59e0b",
  enneagram: "#8b5cf6",
};

export function TestBreakdownChart({ data }: TestBreakdownChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = [
    { name: "MBTI", value: data.mbti, color: COLORS.mbti },
    { name: "Big Five", value: data.bigFive, color: COLORS.bigFive },
    { name: "RIASEC", value: data.riasec, color: COLORS.riasec },
    { name: "Enneagram", value: data.enneagram, color: COLORS.enneagram },
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
            return `${name}: ${value} (${percentage}%)`;
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#ffffff" : "#000000",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}


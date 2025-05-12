import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";

const typeNames: Record<string, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#0ea5e9",
  "#e11d48",
];

const descriptions: Record<string, string> = {
  R: "Realistic individuals prefer hands-on activities and value practical tasks and tangible outcomes.",
  I: "Investigative types are curious, analytical, and enjoy solving problems through observation and research.",
  A: "Artistic individuals value creativity, self-expression, and innovation in unstructured environments.",
  S: "Social types are empathetic and enjoy working with, helping, and teaching others.",
  E: "Enterprising individuals are persuasive, energetic, and enjoy leadership and business roles.",
  C: "Conventional types are detail-oriented and excel in structured environments with clear rules.",
};

export default function RIASECResultAdmin({ result }: { result: any[] }) {
  if (!result || result.length === 0) {
    return (
      <p className="text-center text-lg mt-10">No result data available.</p>
    );
  }
  const sorted = [...result].sort((a, b) => b.score - a.score);
  const top3 = sorted
    .slice(0, 3)
    .map((t) => t.type)
    .join("");
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">RIASEC Personality Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">
              Top 3 Personality Types
            </p>
            <h2 className="text-3xl font-bold text-primary">{top3}</h2>
            <p className="text-gray-600 mt-2 italic">
              {descriptions[sorted[0].type]}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={result}
                  dataKey="score"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${typeNames[name]}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {result.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}`, typeNames[name]]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {sorted.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">
                      {typeNames[item.type]} ({item.type})
                    </span>
                    <span>{item.score}</span>
                  </div>
                  <Progress value={(item.score / 7) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">
              Personality Descriptions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              {sorted.slice(0, 3).map((item, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{typeNames[item.type]}</h4>
                  <p>{descriptions[item.type]}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
  const getConsistencyDegree = (first: string, second: string) => {
    const high = new Set([
      "RI",
      "RC",
      "IR",
      "IA",
      "AI",
      "AS",
      "SA",
      "SE",
      "ES",
      "EC",
      "CE",
      "CR",
    ]);
    const medium = new Set([
      "RA",
      "RE",
      "IS",
      "IC",
      "AR",
      "AE",
      "SI",
      "SC",
      "EA",
      "ER",
      "CS",
      "CI",
    ]);
    const low = new Set(["RS", "IE", "AC", "SR", "EI", "CA"]);

    const combo = first + second;
    const reverseCombo = second + first;
    if (high.has(combo) || high.has(reverseCombo)) {
      return "High";
    } else if (medium.has(combo) || medium.has(reverseCombo)) {
      return "Medium";
    } else if (low.has(combo) || low.has(reverseCombo)) {
      return "Low";
    }
    return "Insufficient";
  };

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
          {/* Degree of Consistency Section - improved modern look with dark mode support */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 shadow-sm mb-6 border border-blue-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-100 text-xl font-bold border-2 border-blue-400 dark:border-blue-500 shadow">
                  {getConsistencyDegree(sorted[0].type, sorted[1].type).charAt(
                    0
                  )}
                </span>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Degree of Consistency
                </h3>
              </div>
              <span className="inline-block px-4 py-1 rounded-full bg-blue-600  text-white font-semibold text-sm tracking-wide shadow">
                {getConsistencyDegree(sorted[0].type, sorted[1].type)}
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-200 mb-1">
              Consistency is determined by the relationship between your top two
              personality types.
            </p>
            <p className="text-gray-800 dark:text-gray-100 text-sm">
              Your top two personality types are{" "}
              <strong className="text-blue-800 dark:text-blue-200">
                {typeNames[sorted[0].type]}
              </strong>{" "}
              and{" "}
              <strong className="text-blue-800 dark:text-blue-200">
                {typeNames[sorted[1].type]}
              </strong>{" "}
              (
              <span className="font-mono text-blue-700 dark:text-blue-200">
                {sorted[0].type + sorted[1].type}
              </span>
              ), which indicates a{" "}
              <strong className="text-blue-700 dark:text-blue-200">
                {getConsistencyDegree(sorted[0].type, sorted[1].type)} degree of
                consistency
              </strong>
              .
            </p>
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

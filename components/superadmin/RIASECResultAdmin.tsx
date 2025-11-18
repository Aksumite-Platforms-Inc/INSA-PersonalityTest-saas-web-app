import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Award, Users, Lightbulb, Target } from "lucide-react";

const typeNames: Record<string, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const typeIcons: Record<string, any> = {
  R: Target,
  I: Lightbulb,
  A: Award,
  S: Users,
  E: Briefcase,
  C: TrendingUp,
};

const COLORS = [
  "#6366f1", // Realistic - Indigo
  "#22c55e", // Investigative - Green
  "#f59e0b", // Artistic - Amber
  "#ec4899", // Social - Pink
  "#0ea5e9", // Enterprising - Cyan
  "#e11d48", // Conventional - Red
];

const descriptions: Record<string, string> = {
  R: "Realistic individuals prefer hands-on activities and value practical tasks and tangible outcomes. They enjoy working with tools, machines, and physical materials.",
  I: "Investigative types are curious, analytical, and enjoy solving problems through observation and research. They prefer intellectual challenges and scientific inquiry.",
  A: "Artistic individuals value creativity, self-expression, and innovation in unstructured environments. They enjoy artistic activities and creative problem-solving.",
  S: "Social types are empathetic and enjoy working with, helping, and teaching others. They value relationships and making a positive impact on people's lives.",
  E: "Enterprising individuals are persuasive, energetic, and enjoy leadership and business roles. They thrive in competitive environments and value achievement.",
  C: "Conventional types are detail-oriented and excel in structured environments with clear rules. They value organization, accuracy, and systematic approaches.",
};

export default function RIASECResultAdmin({ result }: { result: any[] }) {
  if (!result || result.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No result data available.</p>
      </div>
    );
  }

  const getConsistencyDegree = (first: string, second: string) => {
    const high = new Set([
      "RI", "RC", "IR", "IA", "AI", "AS", "SA", "SE", "ES", "EC", "CE", "CR",
    ]);
    const medium = new Set([
      "RA", "RE", "IS", "IC", "AR", "AE", "SI", "SC", "EA", "ER", "CS", "CI",
    ]);
    const low = new Set(["RS", "IE", "AC", "SR", "EI", "CA"]);

    const combo = first + second;
    const reverseCombo = second + first;
    if (high.has(combo) || high.has(reverseCombo)) {
      return { degree: "High", color: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
    } else if (medium.has(combo) || medium.has(reverseCombo)) {
      return { degree: "Medium", color: "yellow", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
    } else if (low.has(combo) || low.has(reverseCombo)) {
      return { degree: "Low", color: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    }
    return { degree: "Insufficient", color: "gray", bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
  };

  const sorted = [...result].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3).map((t) => t.type).join("");
  const consistency = getConsistencyDegree(sorted[0].type, sorted[1].type);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 mb-2">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Top 3 Career Interest Types
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
                {top3}
              </h1>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {sorted.slice(0, 3).map((item, idx) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-sm px-3 py-1 border-2"
                      style={{
                        borderColor: COLORS[result.findIndex(r => r.type === item.type) % COLORS.length],
                        backgroundColor: `${COLORS[result.findIndex(r => r.type === item.type) % COLORS.length]}15`,
                        color: COLORS[result.findIndex(r => r.type === item.type) % COLORS.length]
                      }}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {typeNames[item.type]}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualizations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Interest Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={result}
                  dataKey="score"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) =>
                    `${typeNames[name]}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {result.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} points`,
                    typeNames[name]
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend 
                  formatter={(value) => typeNames[value]}
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sorted.map((item, index) => {
                const Icon = typeIcons[item.type];
                const color = COLORS[result.findIndex(r => r.type === item.type) % COLORS.length];
                const isTop3 = index < 3;
                
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isTop3 
                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="p-1.5 rounded-md"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <div>
                          <span className="font-semibold text-sm">
                            {typeNames[item.type]}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({item.type})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isTop3 && (
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                            Top {index + 1}
                          </Badge>
                        )}
                        <span className="font-bold text-lg" style={{ color }}>
                          {item.score}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(item.score / 7) * 100} 
                      className="h-2.5"
                      style={{
                        backgroundColor: `${color}20`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consistency Section */}
      <Card className={`border-2 ${consistency.border} ${consistency.bg}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${consistency.bg} border-2 ${consistency.border}`}>
                <Award className={`h-5 w-5 ${consistency.text}`} />
              </div>
              <CardTitle className={consistency.text}>Degree of Consistency</CardTitle>
            </div>
            <Badge 
              variant="outline"
              className={`text-sm font-semibold px-4 py-1 ${consistency.bg} ${consistency.border} ${consistency.text}`}
            >
              {consistency.degree}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Consistency is determined by the relationship between your top two personality types.
          </p>
          <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-base px-3 py-1.5 border-2"
                style={{
                  borderColor: COLORS[result.findIndex(r => r.type === sorted[0].type) % COLORS.length],
                  backgroundColor: `${COLORS[result.findIndex(r => r.type === sorted[0].type) % COLORS.length]}15`,
                  color: COLORS[result.findIndex(r => r.type === sorted[0].type) % COLORS.length]
                }}
              >
                {typeNames[sorted[0].type]}
              </Badge>
              <span className="text-muted-foreground">+</span>
              <Badge
                variant="outline"
                className="text-base px-3 py-1.5 border-2"
                style={{
                  borderColor: COLORS[result.findIndex(r => r.type === sorted[1].type) % COLORS.length],
                  backgroundColor: `${COLORS[result.findIndex(r => r.type === sorted[1].type) % COLORS.length]}15`,
                  color: COLORS[result.findIndex(r => r.type === sorted[1].type) % COLORS.length]
                }}
              >
                {typeNames[sorted[1].type]}
              </Badge>
            </div>
            <span className="text-muted-foreground">=</span>
            <span className="font-mono text-lg font-semibold">
              {sorted[0].type + sorted[1].type}
            </span>
          </div>
          <p className={`text-sm mt-3 ${consistency.text} font-medium`}>
            Your combination indicates a <strong>{consistency.degree.toLowerCase()}</strong> degree of consistency, 
            meaning these interests work {consistency.degree === "High" ? "very well" : consistency.degree === "Medium" ? "moderately well" : "less well"} together.
          </p>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card className="bg-gradient-to-br from-muted/50 to-background border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Type Descriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.slice(0, 3).map((item, index) => {
              const Icon = typeIcons[item.type];
              const color = COLORS[result.findIndex(r => r.type === item.type) % COLORS.length];
              
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 bg-background hover:border-primary/30 transition-colors"
                  style={{ borderColor: `${color}30` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="p-1.5 rounded-md"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <h4 className="font-semibold text-sm">{typeNames[item.type]}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {descriptions[item.type]}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { TrendingUp, Brain, Heart, Users, Shield, AlertCircle } from "lucide-react";

const traitInfo = {
  openness: {
    name: "Openness",
    shortName: "Open",
    icon: Brain,
    color: "#8b5cf6",
    gradient: "from-purple-500 to-purple-600",
    description: "Openness reflects imagination, creativity, and curiosity. High scorers are creative, curious, and open to new experiences.",
    lowDescription: "Low scorers prefer routine, practical approaches, and concrete thinking.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    shortName: "Conscientious",
    icon: Shield,
    color: "#10b981",
    gradient: "from-green-500 to-green-600",
    description: "Conscientiousness measures self-discipline and organization. High scorers are organized, reliable, and goal-oriented.",
    lowDescription: "Low scorers are more flexible, spontaneous, and less structured.",
  },
  extraversion: {
    name: "Extraversion",
    shortName: "Extraverted",
    icon: Users,
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-600",
    description: "Extraversion indicates sociability and enthusiasm. High scorers are outgoing, energetic, and enjoy social interactions.",
    lowDescription: "Low scorers (introverts) prefer solitude, quiet environments, and deeper connections.",
  },
  agreeableness: {
    name: "Agreeableness",
    shortName: "Agreeable",
    icon: Heart,
    color: "#ec4899",
    gradient: "from-pink-500 to-pink-600",
    description: "Agreeableness reflects kindness, empathy, and cooperation. High scorers are trusting, helpful, and compassionate.",
    lowDescription: "Low scorers are more competitive, skeptical, and less trusting.",
  },
  neuroticism: {
    name: "Neuroticism",
    shortName: "Stable",
    icon: AlertCircle,
    color: "#0ea5e9",
    gradient: "from-cyan-500 to-cyan-600",
    description: "Neuroticism measures emotional stability. High scorers experience more anxiety, moodiness, and emotional reactivity.",
    lowDescription: "Low scorers are emotionally stable, calm, and resilient.",
  },
};

export default function BigFiveResultAdmin({ result }: { result: any }) {
  if (!result || !result.Raw || !result.Normalized) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No result data available.</p>
      </div>
    );
  }

  const chartData = Object.keys(result.Normalized).map((trait) => {
    const typedTrait = trait as keyof typeof traitInfo;
    const info = traitInfo[typedTrait];
    return {
      name: info.shortName,
      fullName: info.name,
      value: Math.round(result.Normalized[trait]),
      rawValue: result.Raw[trait],
      color: info.color,
      icon: info.icon,
    };
  });

  const sortedTraits = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 mb-2">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Big Five Personality Profile
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                Personality Traits
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your scores across the five fundamental dimensions of personality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trait Scores Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                tick={{ fill: "currentColor", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}% (Raw: ${props.payload.rawValue})`,
                  props.payload.fullName
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Trait Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTraits.map((trait, index) => {
          const info = traitInfo[trait.fullName.toLowerCase().replace(" ", "") as keyof typeof traitInfo];
          const Icon = info.icon;
          const isHigh = trait.value >= 60;
          const isLow = trait.value <= 40;
          
          return (
            <Card 
              key={trait.name} 
              className="overflow-hidden border-2 hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${trait.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: trait.color }} />
                    </div>
                    <CardTitle className="text-base font-semibold">{info.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      isHigh ? "bg-green-50 text-green-700 border-green-200" :
                      isLow ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {isHigh ? "High" : isLow ? "Low" : "Moderate"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" style={{ color: trait.color }}>
                        {trait.value}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Raw: {trait.rawValue})
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={trait.value} 
                    className="h-3"
                    style={{
                      backgroundColor: `${trait.color}20`,
                    }}
                  />
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isHigh ? info.description : info.lowDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Section */}
      <Card className="bg-gradient-to-br from-muted/50 to-background border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Understanding Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Big Five personality model measures five core dimensions of personality. 
              Your scores indicate your position on each dimension, with higher scores 
              (60%+) indicating stronger traits and lower scores (40%-) indicating weaker traits.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-900 dark:text-green-100">High Scores (60%+)</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Strong presence of this trait</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Low Scores (40%-)</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Weaker presence of this trait</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

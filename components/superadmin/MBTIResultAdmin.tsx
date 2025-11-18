import { MBTIResult } from "@/types/personality.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Sparkles } from "lucide-react";

const dimensions = [
  { 
    code: "IE", 
    label1: "Introversion (I)", 
    label2: "Extroversion (E)",
    icon: Users,
    color1: "#6366f1",
    color2: "#10b981"
  },
  { 
    code: "SN", 
    label1: "Sensing (S)", 
    label2: "Intuition (N)",
    icon: Brain,
    color1: "#f59e0b",
    color2: "#8b5cf6"
  },
  { 
    code: "FT", 
    label1: "Feeling (F)", 
    label2: "Thinking (T)",
    icon: Sparkles,
    color1: "#ec4899",
    color2: "#0ea5e9"
  },
  { 
    code: "JP", 
    label1: "Judging (J)", 
    label2: "Perceiving (P)",
    icon: TrendingUp,
    color1: "#f97316",
    color2: "#14b8a6"
  },
];

export default function MBTIResultAdmin({ result }: { result: MBTIResult }) {
  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No result available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 mb-2">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Your Personality Type
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
                {result.personality}
              </h1>
              <Badge variant="outline" className="text-base px-4 py-1.5 border-primary/30 bg-primary/5">
                Myers-Briggs Type Indicator
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {dimensions.map(({ code, label1, label2, icon: Icon, color1, color2 }) => {
          const value = result[code as keyof MBTIResult] as number;
          const percentage = ((value + 2) / 4) * 100;
          const isLeft = value < 0;
          const dominantLabel = isLeft ? label1 : label2;
          const dominantColor = isLeft ? color1 : color2;
          
          return (
            <Card key={code} className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${dominantColor}15` }}>
                      <Icon className="h-4 w-4" style={{ color: dominantColor }} />
                    </div>
                    <CardTitle className="text-base font-semibold">{code} Dimension</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: dominantColor,
                      backgroundColor: `${dominantColor}10`,
                      color: dominantColor
                    }}
                  >
                    {dominantLabel.split(" ")[0]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-muted-foreground">{label1}</span>
                    <span className="text-muted-foreground">{label2}</span>
                  </div>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-500"
                      style={{
                        background: `linear-gradient(to right, ${color1} 0%, ${color2} 100%)`,
                        opacity: 0.2
                      }}
                    />
                    <div
                      className="absolute top-0 left-1/2 h-full w-0.5 bg-foreground/20"
                      style={{ transform: "translateX(-50%)" }}
                    />
                    <div
                      className="absolute top-0 h-full rounded-full transition-all duration-500"
                      style={{
                        left: isLeft ? `${percentage}%` : "50%",
                        right: isLeft ? "50%" : `${100 - percentage}%`,
                        backgroundColor: dominantColor,
                        opacity: 0.8
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-2 border-background shadow-md transition-all duration-500"
                      style={{
                        left: `${percentage}%`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: dominantColor
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Preference Score</span>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: dominantColor }}
                    >
                      {value > 0 ? "+" : ""}{value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Description Section */}
      <Card className="bg-gradient-to-br from-muted/50 to-background border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Personality Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {Array.isArray(result.description) ? (
              <div className="space-y-3">
                {result.description.map((para, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {result.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

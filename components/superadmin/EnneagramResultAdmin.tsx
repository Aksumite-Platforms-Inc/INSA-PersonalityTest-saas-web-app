import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Circle, TrendingUp, Users, Sparkles } from "lucide-react";

const enneagramTypeNames: Record<string, string> = {
  A: "Type 1: The Reformer",
  B: "Type 2: The Helper",
  C: "Type 3: The Achiever",
  D: "Type 4: The Individualist",
  E: "Type 5: The Investigator",
  F: "Type 6: The Loyalist",
  G: "Type 7: The Enthusiast",
  H: "Type 8: The Challenger",
  I: "Type 9: The Peacemaker",
};

const enneagramDescriptions: Record<string, string> = {
  A: "Perfectionists who strive for integrity and improvement. They are principled, purposeful, and self-controlled.",
  B: "Helpers who are caring, generous, and empathetic. They seek to be loved and appreciated by others.",
  C: "Achievers who are success-oriented, adaptable, and driven. They value achievement and image.",
  D: "Individualists who are introspective, creative, and expressive. They seek identity and authenticity.",
  E: "Investigators who are intense, perceptive, and innovative. They seek understanding and knowledge.",
  F: "Loyalists who are reliable, responsible, and committed. They seek security and support.",
  G: "Enthusiasts who are spontaneous, versatile, and acquisitive. They seek satisfaction and fulfillment.",
  H: "Challengers who are self-confident, decisive, and willful. They seek self-protection and control.",
  I: "Peacemakers who are receptive, reassuring, and complacent. They seek peace and harmony.",
};

const enneagramColors: Record<string, string> = {
  A: "#ef4444", // Red
  B: "#f59e0b", // Amber
  C: "#eab308", // Yellow
  D: "#8b5cf6", // Purple
  E: "#6366f1", // Indigo
  F: "#0ea5e9", // Sky
  G: "#10b981", // Emerald
  H: "#ec4899", // Pink
  I: "#14b8a6", // Teal
};

export default function EnneagramResultAdmin({ result }: { result: any[] }) {
  if (!result || result.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No result data available.</p>
      </div>
    );
  }

  const sorted = [...result].sort((a, b) => b.score - a.score);
  const topType = sorted[0];
  const topTypeLabel = enneagramTypeNames[topType.type] || topType.type_name;
  const topTypeNumber = topType.type.charCodeAt(0) - 64; // A → 1, B → 2, etc.
  const topTypeColor = enneagramColors[topType.type] || "#6366f1";

  const getWingType = () => {
    const adjacentTypesMap: Record<number, number[]> = {
      1: [9, 2],
      2: [1, 3],
      3: [2, 4],
      4: [3, 5],
      5: [4, 6],
      6: [5, 7],
      7: [6, 8],
      8: [7, 9],
      9: [8, 1],
    };
    const mainNumber = topTypeNumber;
    const wings = adjacentTypesMap[mainNumber];
    const wing = sorted.find((item) =>
      wings.includes(item.type.charCodeAt(0) - 64)
    );
    return wing
      ? `${mainNumber}w${wing.type.charCodeAt(0) - 64}`
      : `${mainNumber}`;
  };

  const wingType = getWingType();
  const top3 = sorted.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-2 mx-auto"
              style={{
                backgroundColor: `${topTypeColor}15`,
                borderColor: topTypeColor,
              }}
            >
              <Circle className="h-12 w-12" style={{ color: topTypeColor }} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Your Enneagram Type
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: topTypeColor }}>
                Type {topTypeNumber}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                {topTypeLabel.split(": ")[1]}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <Badge 
                  variant="outline" 
                  className="text-base px-4 py-1.5 border-2"
                  style={{
                    borderColor: topTypeColor,
                    backgroundColor: `${topTypeColor}15`,
                    color: topTypeColor
                  }}
                >
                  {wingType}
                </Badge>
                <span className="text-sm text-muted-foreground">Wing Type</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Types */}
      <div className="grid md:grid-cols-3 gap-4">
        {top3.map((item, index) => {
          const typeNumber = item.type.charCodeAt(0) - 64;
          const typeLabel = enneagramTypeNames[item.type] || item.type_name;
          const typeColor = enneagramColors[item.type] || "#6366f1";
          const isPrimary = index === 0;

          return (
            <Card 
              key={index}
              className={`overflow-hidden border-2 transition-all hover:shadow-lg ${
                isPrimary 
                  ? "bg-gradient-to-br from-primary/5 to-background border-primary/30" 
                  : "border-border"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${typeColor}15` }}
                    >
                      <Circle className="h-4 w-4" style={{ color: typeColor }} />
                    </div>
                    <CardTitle className="text-sm font-semibold">
                      Type {typeNumber}
                    </CardTitle>
                  </div>
                  {isPrimary && (
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                      Primary
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {typeLabel.split(": ")[1]}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Score</span>
                    <span 
                      className="text-xl font-bold"
                      style={{ color: typeColor }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <Progress 
                    value={(item.score / 10) * 100} 
                    className="h-2.5"
                    style={{
                      backgroundColor: `${typeColor}20`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All Types Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Complete Type Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sorted.map((item, index) => {
              const typeNumber = item.type.charCodeAt(0) - 64;
              const typeLabel = enneagramTypeNames[item.type] || item.type_name;
              const typeColor = enneagramColors[item.type] || "#6366f1";
              const isTop3 = index < 3;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isTop3
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-md"
                        style={{ backgroundColor: `${typeColor}15` }}
                      >
                        <Circle className="h-4 w-4" style={{ color: typeColor }} />
                      </div>
                      <div>
                        <span className="font-semibold text-sm">
                          Type {typeNumber}: {typeLabel.split(": ")[1]}
                        </span>
                        {isTop3 && (
                          <Badge variant="outline" className="ml-2 text-xs bg-primary/10 border-primary/30">
                            Top {index + 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span 
                      className="text-lg font-bold"
                      style={{ color: typeColor }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <Progress 
                    value={(item.score / 10) * 100} 
                    className="h-3"
                    style={{
                      backgroundColor: `${typeColor}20`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card className="bg-gradient-to-br from-muted/50 to-background border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Type Description</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="p-5 rounded-lg border-2"
              style={{
                backgroundColor: `${topTypeColor}10`,
                borderColor: `${topTypeColor}30`,
              }}
            >
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: topTypeColor }}
              >
                {topTypeLabel}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enneagramDescriptions[topType.type]}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground italic">
                Note: Results highlight tendencies, not absolute definitions. 
                Explore the top types to understand your personality better. 
                The Enneagram is a tool for self-awareness and growth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

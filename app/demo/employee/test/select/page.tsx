"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

// Demo test data
const availableTests = [
  {
    id: "mbti",
    title: "MBTI Personality Type Indicator",
    description:
      "Discover your personality type and how it influences your behavior and interactions with others.",
    duration: "20-25 minutes",
    questions: 60,
    icon: "🧠",
  },
  {
    id: "big5",
    title: "Five Factor Assessment",
    description:
      "Evaluate your personality across five major dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
    duration: "15-20 minutes",
    questions: 60,
    icon: "⭐",
  },
  {
    id: "riasec",
    title: "RIASEC Career Interest Assessment",
    description:
      "Explore your career interests based on the RIASEC model: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.",
    duration: "20-30 minutes",
    questions: 42,
    icon: "⚒️",
  },
  {
    id: "enneagram",
    title: "Enneagram Profile",
    description:
      "Identify your core motivations and personality type according to the Enneagram system.",
    duration: "35-50 minutes",
    questions: 108,
    icon: "🔹",
  },
];

export default function TestSelectionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const isDemo = useMemo(() => pathname?.startsWith("/demo"), [pathname]);

  const handleStartTest = () => {
    if (!selectedTest) {
      toast({
        title: t("test.noTestSelected"),
        description: t("test.pleaseSelectTest"),
        variant: "destructive",
      });
      return;
    }

    const basePath = isDemo
      ? "/demo/employee/test/take"
      : "/dashboard/employee/test/take";
    router.push(`${basePath}/${selectedTest}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <PageTitle
        title={t("test.selectTitle")}
        description={t("test.selectDescription")}
      />

      {isDemo && (
        <Alert
          variant="default"
          className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
        >
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">
            Demo Mode: Read-Only
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            This is a demo environment. No real data is saved, and all actions
            are simulated.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("test.importantNote")}</AlertTitle>
        <AlertDescription>{t("test.oneTimeOnly")}</AlertDescription>
      </Alert>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {availableTests.map((test) => (
          <motion.div key={test.id} variants={item}>
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTest === test.id
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : ""
              }`}
              onClick={() => setSelectedTest(test.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {test.title}
                  </CardTitle>
                  <span className="text-3xl">{test.icon}</span>
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{t("test.duration")}: </span>
                    {test.duration}
                  </div>
                  <div>
                    <span className="font-medium">{t("test.questions")}: </span>
                    {test.questions}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedTest === test.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setSelectedTest(test.id);
                  }}
                >
                  {selectedTest === test.id
                    ? t("test.startTest")
                    : t("test.selectTest")}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-end">
        <Button size="lg" disabled={!selectedTest}>
          {t("test.startTest")}
        </Button>
      </div>
    </div>
  );
}

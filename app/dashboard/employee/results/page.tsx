"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTitle } from "@/components/page-title"
import { PersonalityChart } from "@/components/employee/personality-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function ResultsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title={t("results.title")} description={t("results.description")} />

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            {t("results.print")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("results.download")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">{t("results.overview")}</TabsTrigger>
          <TabsTrigger value="traits">{t("results.traits")}</TabsTrigger>
          <TabsTrigger value="insights">{t("results.insights")}</TabsTrigger>
          <TabsTrigger value="recommendations">{t("results.recommendations")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>{t("results.personalityProfile")}</CardTitle>
                <CardDescription>{t("results.profileDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <PersonalityChart />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("results.summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("results.summaryText1")}</p>
                <p className="text-muted-foreground mt-4">{t("results.summaryText2")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="traits">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2">
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.strengths")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t("results.strength1")}</li>
                    <li>{t("results.strength2")}</li>
                    <li>{t("results.strength3")}</li>
                    <li>{t("results.strength4")}</li>
                    <li>{t("results.strength5")}</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.areasForDevelopment")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t("results.development1")}</li>
                    <li>{t("results.development2")}</li>
                    <li>{t("results.development3")}</li>
                    <li>{t("results.development4")}</li>
                    <li>{t("results.development5")}</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.coreTraits")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{t("results.trait1Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("results.trait1Description")}</p>
                    </div>
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{t("results.trait2Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("results.trait2Description")}</p>
                    </div>
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{t("results.trait3Title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("results.trait3Description")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="insights">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>{t("results.personalInsights")}</CardTitle>
                <CardDescription>{t("results.insightsDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary p-4 bg-accent/50">
                  <h3 className="font-semibold mb-2">{t("results.insight1Title")}</h3>
                  <p className="text-muted-foreground">{t("results.insight1Text")}</p>
                </div>
                <div className="border-l-4 border-primary p-4 bg-accent/50">
                  <h3 className="font-semibold mb-2">{t("results.insight2Title")}</h3>
                  <p className="text-muted-foreground">{t("results.insight2Text")}</p>
                </div>
                <div className="border-l-4 border-primary p-4 bg-accent/50">
                  <h3 className="font-semibold mb-2">{t("results.insight3Title")}</h3>
                  <p className="text-muted-foreground">{t("results.insight3Text")}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="recommendations">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.professionalDevelopment")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t("results.professional1")}</li>
                    <li>{t("results.professional2")}</li>
                    <li>{t("results.professional3")}</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.teamDynamics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t("results.team1")}</li>
                    <li>{t("results.team2")}</li>
                    <li>{t("results.team3")}</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.personalGrowth")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t("results.growth1")}</li>
                    <li>{t("results.growth2")}</li>
                    <li>{t("results.growth3")}</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, BarChart, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function EmployeeDashboard() {
  const { t } = useTranslation()
  const router = useRouter()

  // Demo data - in a real app, this would come from an API
  const testStatus = {
    hasCompletedTest: false,
    testName: "Personality Type Indicator",
    completionDate: null,
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("employee.dashboardTitle")} description={t("employee.dashboardDescription")} />

      {!testStatus.hasCompletedTest && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-amber-700 dark:text-amber-400">{t("employee.pendingTest")}</CardTitle>
            </div>
            <CardDescription className="text-amber-600 dark:text-amber-500">
              {t("employee.pendingTestDescription")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/employee/test/select")}>{t("employee.takeTest")}</Button>
          </CardFooter>
        </Card>
      )}

      <motion.div className="grid gap-4 md:grid-cols-2" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                {t("employee.testStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t("employee.assignedTest")}</div>
                  <div className="font-medium">{testStatus.testName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t("employee.status")}</div>
                  {testStatus.hasCompletedTest ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t("employee.completed")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {t("employee.pending")}
                    </Badge>
                  )}
                </div>
                {testStatus.completionDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{t("employee.completionDate")}</div>
                    <div>{new Date(testStatus.completionDate).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {testStatus.hasCompletedTest ? (
                <Link href="/dashboard/employee/results" passHref>
                  <Button variant="outline">
                    {t("employee.viewResults")}
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/employee/test/select" passHref>
                  <Button>
                    {t("employee.startTest")}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                {t("employee.insights")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testStatus.hasCompletedTest ? (
                <div className="space-y-4">
                  <p>{t("employee.insightsAvailable")}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("employee.insight1")}</li>
                    <li>{t("employee.insight2")}</li>
                    <li>{t("employee.insight3")}</li>
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground">{t("employee.insightsUnavailable")}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t("employee.completeTestForInsights")}</p>
                </div>
              )}
            </CardContent>
            {testStatus.hasCompletedTest && (
              <CardFooter>
                <Link href="/dashboard/employee/results" passHref>
                  <Button variant="outline">
                    {t("employee.exploreInsights")}
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

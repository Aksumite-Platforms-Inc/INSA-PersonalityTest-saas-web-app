"use client"

import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PersonalityChart } from "@/components/employee/personality-chart"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Download, Mail } from "lucide-react"
import { motion } from "framer-motion"

// Demo employee data
const employeeData = {
  id: 1,
  name: "Abebe Kebede",
  email: "abebe.k@example.com",
  department: "Finance",
  position: "Accountant",
  testType: "Personality Type Indicator",
  completionDate: "2023-03-15",
  results: {
    type: "ISTJ",
    traits: {
      openness: 65,
      conscientiousness: 85,
      extraversion: 40,
      agreeableness: 70,
      neuroticism: 45,
      resilience: 75,
      adaptability: 60,
    },
    strengths: [
      "Detail-oriented and thorough",
      "Reliable and responsible",
      "Practical problem-solving",
      "Organized and methodical",
      "Calm under pressure",
    ],
    development: [
      "May resist change and innovation",
      "Could benefit from more flexibility",
      "May need to consider emotional factors",
      "Could improve active listening skills",
      "May need to delegate more effectively",
    ],
    summary:
      "Abebe demonstrates a strong preference for structure, order, and logical decision-making. His profile indicates someone who is dependable, practical, and detail-oriented. He excels in environments with clear expectations and established procedures. As an ISTJ personality type, he values tradition, loyalty, and factual accuracy. His methodical approach makes him well-suited for roles requiring precision and thoroughness, such as his current position in Finance.",
  },
}

export default function EmployeeResultsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const router = useRouter()
  const employeeId = Number.parseInt(params.id)

  // In a real app, we would fetch the employee data based on the ID
  // For demo purposes, we'll use the static data

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle
          title={`${employeeData.name}'s Test Results`}
          description={`${employeeData.testType} completed on ${new Date(employeeData.completionDate).toLocaleDateString()}`}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("results.downloadPdf")}
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            {t("results.emailResults")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t("results.employeeInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("users.name")}</div>
              <div className="font-medium">{employeeData.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("users.email")}</div>
              <div>{employeeData.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("users.department")}</div>
              <div>{employeeData.department}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("users.position")}</div>
              <div>{employeeData.position}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("results.testType")}</div>
              <div>{employeeData.testType}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("results.completionDate")}</div>
              <div>{new Date(employeeData.completionDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t("results.personalityType")}</div>
              <div className="text-xl font-bold">{employeeData.results.type}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("results.personalityProfile")}</CardTitle>
            <CardDescription>{t("results.personalityProfileDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PersonalityChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("results.strengths")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {employeeData.results.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("results.areasForDevelopment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {employeeData.results.development.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("results.summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{employeeData.results.summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

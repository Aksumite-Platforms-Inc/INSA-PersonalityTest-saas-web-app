"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import { Search, PlusCircle, Upload, MoreHorizontal, Mail, RefreshCw, UserX, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"

// Demo data
const employees = [
  {
    id: 1,
    name: "Abebe Kebede",
    email: "abebe.k@example.com",
    department: "Finance",
    position: "Accountant",
    testStatus: "completed",
    lastActivity: "2023-03-15",
  },
  {
    id: 2,
    name: "Tigist Haile",
    email: "tigist.h@example.com",
    department: "HR",
    position: "HR Specialist",
    testStatus: "not_started",
    lastActivity: null,
  },
  {
    id: 3,
    name: "Dawit Tadesse",
    email: "dawit.t@example.com",
    department: "IT",
    position: "Systems Administrator",
    testStatus: "completed",
    lastActivity: "2023-03-12",
  },
  {
    id: 4,
    name: "Hiwot Girma",
    email: "hiwot.g@example.com",
    department: "Operations",
    position: "Operations Manager",
    testStatus: "not_started",
    lastActivity: null,
  },
  {
    id: 5,
    name: "Solomon Tesfaye",
    email: "solomon.t@example.com",
    department: "Marketing",
    position: "Marketing Specialist",
    testStatus: "completed",
    lastActivity: "2023-03-10",
  },
  {
    id: 6,
    name: "Meron Alemu",
    email: "m.alemu@example.com",
    department: "Finance",
    position: "Financial Analyst",
    testStatus: "completed",
    lastActivity: "2023-03-09",
  },
  {
    id: 7,
    name: "Yonas Bekele",
    email: "yonas.b@example.com",
    department: "Management",
    position: "Project Manager",
    testStatus: "completed",
    lastActivity: "2023-03-08",
  },
  {
    id: 8,
    name: "Sara Tesfaye",
    email: "sara.t@example.com",
    department: "Research",
    position: "Research Specialist",
    testStatus: "not_started",
    lastActivity: null,
  },
]

export default function UsersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleResendInvite = (employeeId: number, employeeName: string) => {
    toast({
      title: t("users.inviteResent"),
      description: t("users.inviteResentDescription", { name: employeeName }),
    })
  }

  const handleViewResults = (employeeId: number) => {
    router.push(`/dashboard/branch/users/${employeeId}/results`)
  }

  const renderTestStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t("users.completed")}
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t("users.inProgress")}
          </Badge>
        )
      case "not_started":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {t("users.notStarted")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle title={t("users.title")} description={t("users.description")} />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => router.push("/dashboard/branch/users/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            {t("users.bulkUpload")}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/branch/users/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("users.addEmployee")}
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("users.search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("users.name")}</TableHead>
              <TableHead>{t("users.email")}</TableHead>
              <TableHead>{t("users.department")}</TableHead>
              <TableHead>{t("users.position")}</TableHead>
              <TableHead>{t("users.testStatus")}</TableHead>
              <TableHead>{t("users.lastActivity")}</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t("users.noEmployeesFound")}
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{renderTestStatusBadge(employee.testStatus)}</TableCell>
                  <TableCell>
                    {employee.lastActivity ? new Date(employee.lastActivity).toLocaleDateString() : t("users.never")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("common.openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>

                        {employee.testStatus === "completed" && (
                          <DropdownMenuItem onClick={() => handleViewResults(employee.id)}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            <span>{t("users.viewResults")}</span>
                          </DropdownMenuItem>
                        )}

                        {employee.testStatus === "not_started" && (
                          <DropdownMenuItem onClick={() => handleResendInvite(employee.id, employee.name)}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>{t("users.resendInvite")}</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>{t("users.resetTest")}</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600">
                          <UserX className="mr-2 h-4 w-4" />
                          <span>{t("users.deactivate")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

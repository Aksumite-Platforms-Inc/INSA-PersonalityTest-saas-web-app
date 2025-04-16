"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Shield, Ban, Key } from "lucide-react"

// Demo data
const users = [
  {
    id: 1,
    name: "Abebe Kebede",
    email: "abebe@moe.gov.et",
    role: "organization_admin",
    organization: "Ministry of Education",
    status: "active",
    lastLogin: "2023-06-15T08:30:00",
  },
  {
    id: 2,
    name: "Tigist Haile",
    email: "tigist@moh.gov.et",
    role: "organization_admin",
    organization: "Ministry of Health",
    status: "active",
    lastLogin: "2023-06-14T10:15:00",
  },
  {
    id: 3,
    name: "Dawit Tadesse",
    email: "dawit@aau.edu.et",
    role: "branch_admin",
    organization: "Addis Ababa University",
    status: "active",
    lastLogin: "2023-06-12T14:45:00",
  },
  {
    id: 4,
    name: "Hiwot Girma",
    email: "hiwot@cbe.com.et",
    role: "branch_admin",
    organization: "Commercial Bank of Ethiopia",
    status: "inactive",
    lastLogin: "2023-05-30T09:20:00",
  },
  {
    id: 5,
    name: "Solomon Tesfaye",
    email: "solomon@ethiopianairlines.com",
    role: "organization_admin",
    organization: "Ethiopian Airlines",
    status: "active",
    lastLogin: "2023-06-10T11:05:00",
  },
  {
    id: 6,
    name: "Meron Alemu",
    email: "meron@ethiotelecom.et",
    role: "branch_admin",
    organization: "Ethio Telecom",
    status: "locked",
    lastLogin: "2023-05-15T16:30:00",
  },
  {
    id: 7,
    name: "Yonas Bekele",
    email: "yonas@insa.gov.et",
    role: "superadmin",
    organization: "INSA",
    status: "active",
    lastLogin: "2023-06-15T09:45:00",
  },
]

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to render role badge with appropriate variant
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Superadmin
          </Badge>
        )
      case "organization_admin":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Organization Admin
          </Badge>
        )
      case "branch_admin":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Branch Admin
          </Badge>
        )
      case "employee":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Employee
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Function to render status badge with appropriate variant
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Inactive
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Locked
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>{renderStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="mr-2 h-4 w-4" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
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
    </div>
  )
}

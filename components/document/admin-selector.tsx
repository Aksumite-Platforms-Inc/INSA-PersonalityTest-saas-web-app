"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search, UserCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for organization admins
const organizationAdmins = {
  "1": [
    { id: "101", name: "Abebe Kebede", email: "abebe.k@moe.gov.et", role: "Admin" },
    { id: "102", name: "Tigist Haile", email: "tigist.h@moe.gov.et", role: "Admin" },
    { id: "103", name: "Dawit Tadesse", email: "dawit.t@moe.gov.et", role: "Admin" },
  ],
  "2": [
    { id: "201", name: "Hiwot Alemu", email: "hiwot.a@moh.gov.et", role: "Admin" },
    { id: "202", name: "Yonas Bekele", email: "yonas.b@moh.gov.et", role: "Admin" },
  ],
  "3": [
    { id: "301", name: "Meron Tadesse", email: "meron.t@aau.edu.et", role: "Admin" },
    { id: "302", name: "Henok Girma", email: "henok.g@aau.edu.et", role: "Admin" },
    { id: "303", name: "Sara Negash", email: "sara.n@aau.edu.et", role: "Admin" },
  ],
  "4": [
    { id: "401", name: "Kidist Mulugeta", email: "kidist.m@cbe.com.et", role: "Admin" },
    { id: "402", name: "Bereket Solomon", email: "bereket.s@cbe.com.et", role: "Admin" },
  ],
  "5": [
    { id: "501", name: "Rahel Tesfaye", email: "rahel.t@ethiopianairlines.com", role: "Admin" },
    { id: "502", name: "Samuel Hailu", email: "samuel.h@ethiopianairlines.com", role: "Admin" },
  ],
  "6": [
    { id: "601", name: "Frehiwot Tekle", email: "frehiwot.t@ethiotelecom.et", role: "Admin" },
    { id: "602", name: "Nahom Assefa", email: "nahom.a@ethiotelecom.et", role: "Admin" },
    { id: "603", name: "Bethlehem Tadesse", email: "bethlehem.t@ethiotelecom.et", role: "Admin" },
  ],
}

interface AdminSelectorProps {
  organizationId: string
  onSelect: (adminIds: string[]) => void
  selectedAdmins?: string[]
}

export function AdminSelector({ organizationId, onSelect, selectedAdmins = [] }: AdminSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState<string[]>(selectedAdmins)

  useEffect(() => {
    setSelected(selectedAdmins)
  }, [selectedAdmins])

  const admins = organizationAdmins[organizationId as keyof typeof organizationAdmins] || []

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (adminId: string) => {
    const newSelected = selected.includes(adminId) ? selected.filter((id) => id !== adminId) : [...selected, adminId]

    setSelected(newSelected)
    onSelect(newSelected)
  }

  const selectedAdminNames = selected
    .map((id) => {
      const admin = admins.find((a) => a.id === id)
      return admin ? admin.name : ""
    })
    .filter(Boolean)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selected.length > 0
              ? `${selected.length} admin${selected.length > 1 ? "s" : ""} selected`
              : "Select admins..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search admins..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
            </div>
            <CommandList>
              <CommandEmpty>No admin found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {filteredAdmins.map((admin) => (
                  <CommandItem
                    key={admin.id}
                    value={admin.id}
                    onSelect={() => handleSelect(admin.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Check className={cn("h-4 w-4", selected.includes(admin.id) ? "opacity-100" : "opacity-0")} />
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{admin.name}</span>
                        <span className="text-xs text-muted-foreground">{admin.email}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {admin.role}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAdminNames.map((name, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <UserCircle className="h-3 w-3" />
              {name}
              <button
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                onClick={() => handleSelect(selected[index])}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

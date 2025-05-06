"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock data for organizations
const organizations = [
  { id: "1", name: "Ministry of Education" },
  { id: "2", name: "Ministry of Health" },
  { id: "3", name: "Addis Ababa University" },
  { id: "4", name: "Commercial Bank of Ethiopia" },
  { id: "5", name: "Ethiopian Airlines" },
  { id: "6", name: "Ethio Telecom" },
]

interface OrganizationSelectorProps {
  onSelect: (organizationId: string) => void
  selectedOrganization?: string
}

export function OrganizationSelector({ onSelect, selectedOrganization }: OrganizationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(selectedOrganization || "")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (selectedOrganization) {
      setValue(selectedOrganization)
    }
  }, [selectedOrganization])

  const filteredOrganizations = organizations.filter((org) => org.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    onSelect(currentValue)
    setOpen(false)
  }

  const selectedOrganizationName = organizations.find((org) => org.id === value)?.name

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value && selectedOrganizationName ? selectedOrganizationName : "Select organization..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search organizations..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredOrganizations.map((org) => (
                <CommandItem key={org.id} value={org.id} onSelect={handleSelect} className="cursor-pointer">
                  <Check className={cn("mr-2 h-4 w-4", value === org.id ? "opacity-100" : "opacity-0")} />
                  {org.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

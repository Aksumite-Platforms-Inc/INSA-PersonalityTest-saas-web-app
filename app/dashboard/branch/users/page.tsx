"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  PlusCircle,
  Upload,
  MoreHorizontal,
  Mail,
  RefreshCw,
  UserX,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { getBranchId, getOrganizationId } from "@/utils/tokenUtils";
import { EmployeeList } from "@/components/branch/employee-list";
import { getBranchById } from "@/services/branch.service";

export default function UsersPage() {
  const { t: translate } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [branch, setBranch] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const organizationId = getOrganizationId();
    const branchId = getBranchId();

    setBranchId(Number(branchId));
    setOrgId(organizationId);
    console.log("Org ID:", organizationId);
    console.log("Branch ID:", branch);

    if (!organizationId) {
      console.error("Token data is missing or invalid.");
      return;
    }
  }, [searchParams]);

  useEffect(() => {
    const branchId = getBranchId();
    console.log("Branch ID for the logged-in branch admin:", branchId);
  }, []);

  function t(arg0: string): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle
          title={translate("users.title")}
          description={translate("users.description")}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => router.push("/dashboard/branch/users/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            {translate("users.bulkUpload")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/branch/users/new")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {translate("users.addEmployee")}
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={translate("users.search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <EmployeeList
        organizationId={Number(orgId)}
        branchId={Number(branchId)}
      />
    </motion.div>
  );
}

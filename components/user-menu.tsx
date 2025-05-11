"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { LogOut, User, Settings } from "lucide-react";
import { decodeToken } from "@/utils/tokenUtils";
// import { decodeToken, logout } from "@/utils/tokenUtils";
// from "@/components/ui/dropdown-menu"
// import { useToast } from "@/hooks/use-toast"
// import { useTranslation } from "@/hooks/use-translation"
// import { LogOut, User, Settings } from "lucide-react"

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Get real user data from token
  const tokenUser = decodeToken();
  const roleMap: Record<string, string> = {
    org_member: "Employee",
    org_admin: "Organization Admin",
    branch_admin: "Branch Admin",
    super_admin: "System Admin",
  };

  const user = {
    name: tokenUser?.name || "User",
    email: tokenUser?.email || "",
    role: roleMap[tokenUser?.role || ""] || "Unknown Role",
    initials: tokenUser?.name
      ? tokenUser.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U",
  };

  const handleLogout = () => {
    // In a real app, this would call an API to log out
    // and clear the token from local storage or cookies
    // logout();
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; path=/; max-age=0"; // Clear cookie

    toast({
      title: t("logout.success"),
      description: t("logout.redirecting"),
    });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar>
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>{t("userMenu.profile")}</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("userMenu.settings")}</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("userMenu.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

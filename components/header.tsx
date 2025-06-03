"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/hooks/use-translation";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 z-30 bg-background">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? t("sidebar.close") : t("sidebar.open")}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        {!isMobile && <Logo />}
      </div>
      <div className="flex items-center gap-2">
        {isMobile ? (
          <UserMenu />
        ) : (
          <>
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </>
        )}
      </div>
    </header>
  );
}

"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { Contacts } from "@/components/contacts"
import { Tasks } from "@/components/tasks"
import { Funnels } from "@/components/funnels"
import { Analytics } from "@/components/analytics"
import { TeamChat } from "@/components/team-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { CursorTrail } from "@/components/cursor-trail"
import { useSidebarControl } from "@/hooks/use-sidebar-control"

export type ActivePage = "dashboard" | "contacts" | "tasks" | "funnels" | "analytics" | "chat"

export function CRMLayout() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const { theme, setTheme } = useTheme()
  const sidebarControl = useSidebarControl()

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />
      case "contacts":
        return <Contacts />
      case "tasks":
        return <Tasks />
      case "funnels":
        return <Funnels />
      case "analytics":
        return <Analytics />
      case "chat":
        return <TeamChat />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CursorTrail />
      <SidebarProvider open={sidebarControl.isOpen} onOpenChange={sidebarControl.setIsOpen} defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar activePage={activePage} setActivePage={setActivePage} sidebarControl={sidebarControl} />
          <div className="flex-1 flex flex-col">
            <SidebarInset>
              <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold capitalize">{activePage}</h1>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </header>
              <main className="flex-1 p-6 overflow-auto">{renderPage()}</main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

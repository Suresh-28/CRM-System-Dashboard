"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, CheckSquare, TrendingUp, BarChart3, MessageCircle } from "lucide-react"
import type { ActivePage } from "./crm-layout"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard" as ActivePage,
  },
  {
    title: "Contacts",
    icon: Users,
    key: "contacts" as ActivePage,
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    key: "tasks" as ActivePage,
  },
  {
    title: "Funnels",
    icon: TrendingUp,
    key: "funnels" as ActivePage,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    key: "analytics" as ActivePage,
  },
  {
    title: "Team Chat",
    icon: MessageCircle,
    key: "chat" as ActivePage,
  },
]

interface AppSidebarProps {
  activePage: ActivePage
  setActivePage: (page: ActivePage) => void
  sidebarControl?: {
    isOpen: boolean
    toggle: () => void
    open: () => void
    close: () => void
  }
}

export function AppSidebar({ activePage, setActivePage, sidebarControl }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold mb-4">CRM System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activePage === item.key}
                    onClick={() => {
                      setActivePage(item.key)
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 768) {
                        sidebarControl?.close()
                      }
                    }}
                    className="w-full justify-start"
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

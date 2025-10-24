"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const isPathActive = (itemUrl: string) => {
    // Handle root path
    if (itemUrl === "/dashboard" && pathname === "/") return true
    // Handle exact matches
    if (pathname === itemUrl) return true
    // Handle sub-paths (e.g., /settings/team should highlight /settings)
    if (itemUrl !== "/" && pathname.startsWith(itemUrl)) return true
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        {items.map((item, index) => {
          // Check if current path matches item url or any of its subitems
          const isActive = 
            isPathActive(item.url) || 
            item.items?.some(subItem => isPathActive(subItem.url))

          return (
            <div key={index} className="space-y-1">
              <Link href={item.url} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={isCollapsed ? item.title : undefined}
                  className={`w-full justify-start gap-2 ${
                    isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </span>
                </SidebarMenuButton>
              </Link>

              {/* Render subitems if they exist and sidebar is expanded */}
              {item.items && !isCollapsed && (
                <div className="ml-4 space-y-1">
                  {item.items.map((subItem, subIndex) => {
                    const isSubItemActive = isPathActive(subItem.url)
                    return (
                      <Link key={subIndex} href={subItem.url} passHref>
                        <SidebarMenuButton
                          asChild
                          isActive={isSubItemActive}
                          variant="outline"
                          className={`w-full justify-start text-sm ${
                            isSubItemActive 
                              ? 'bg-accent text-accent-foreground font-medium' 
                              : 'text-muted-foreground hover:bg-accent/50'
                          }`}
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

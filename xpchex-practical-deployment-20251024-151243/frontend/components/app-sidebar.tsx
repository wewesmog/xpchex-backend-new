"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  BarChart,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Kanban,
  MessageSquareMore,
  LineChart,
  Smile,
  AlertTriangle,
  Heart,
  Lightbulb,
  Star
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  appDetails: {
    name: "KCB Mobile Banking",
    developer: "KCB Group PLC",
    icon_url: "/avatars/shadcn.jpg", // You can replace with actual app icon
    rating: 4.2,
    total_ratings: 12500,
    category: "Finance",
    content_rating: "Everyone",
    version: "2.1.4",
    size: "45.2 MB",
    installs: "1M+",
    last_updated: "Dec 15, 2024"
  },
  teams: [
    {
      name: "KCB App",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "KCB App.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "KCB App.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Sentiments",
      url: "/sentiments",
      icon: Smile,
      isActive: true,
    },
    // {
    //   title: "Reviews",
    //   url: "/reviews",
    //   icon: MessageSquareMore,
    // },
    // {
    //   title: "Roadmap",
    //   url: "/roadmap",
    //   icon: Kanban,
    // },

    {
      title: "Issues",
      url: "/issues",
      icon: AlertTriangle,
      // items: [
      //   {
      //     title: "Issues Old",
      //     url: "/issues_old",
      //   },
      //   {
      //     title: "Issues",
      //     url: "/issues",
      //   },
      //   {
      //     title: "Opportunities",
      //     url: "/actions",
      //   },
      //   {
      //     title: "Positives",
      //     url: "/opportunities",
      //   },
      //   {
      //     title: "Sentiments",
      //     url: "/sentiments",
      //   },
   
      // ],
    },
    {
      title: "Delights",
      url: "/delights",
      icon: Heart,
      // items: [
      //   {
      //     title: "Google Reviews",
      //     url: "/reviews",
      //   },
        
   
      // ],
    },
    {
      title: "Recommendations",
      url: "/recommendations",
      icon: Lightbulb,
    //   items: [
    //     {
    //       title: "Strategic AI Recommendations",
    //       url: "/roadmap",
    //     },
        
   
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "/settings",
    //     },
    //     {
    //       title: "Team",
    //       url: "/settings/team",
    //     },
    //     {
    //       title: "Billing",
    //       url: "/settings/billing",
    //     },
    //     {
    //       title: "Limits",
    //       url: "/settings/limits",
    //     },
    //   ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  //   ],
}

// Compact App Details Component for Sidebar
const CompactAppDetails = ({ details }: { details: any }) => {
  return (
    <Card className="mx-3 mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg dark:shadow-xl">
            <img
              src={details.icon_url}
              alt={details.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-sidebar-foreground truncate">
              {details.name}
            </h3>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-600 dark:text-muted-foreground font-medium">{details.rating}</span>
              <span className="text-xs text-gray-500 dark:text-muted-foreground">
                ({details.total_ratings.toLocaleString()})
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-muted-foreground space-y-1">
              <div className="truncate font-medium">{details.developer}</div>
              <div className="flex items-center justify-center gap-2">
                <span>{details.installs}</span>
                <span>•</span>
                <span>{details.size}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>v{details.version}</span>
                <span>•</span>
                <span>{details.category}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="icon" 
      className="shadow-lg dark:shadow-2xl dark:shadow-black/50 border-r border-gray-200 dark:border-sidebar-border backdrop-blur-sm"
      {...props}
    >
      <SidebarHeader className="pb-2">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="pt-1">
        
        <div className="mt-2">
          <NavMain items={data.navMain} />
        </div>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="my-4">
          <CompactAppDetails details={data.appDetails} />
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

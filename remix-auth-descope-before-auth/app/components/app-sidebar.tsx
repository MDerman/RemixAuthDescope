import * as React from "react"
import {
  MessageSquare,
  Command,
} from "lucide-react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import { TeamSwitcher } from "~/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"
import { LockClosedIcon } from "@radix-ui/react-icons"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/images/profile.png",
  },
  teams: [
    {
      name: "Remix Auth Descope",
      logo: LockClosedIcon,
      plan: "Demo",
    }
  ],
  navMain: [
    {
      title: "Chat",
      url: "#",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "Generate Image",
          url: "#",
          isActive: true,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

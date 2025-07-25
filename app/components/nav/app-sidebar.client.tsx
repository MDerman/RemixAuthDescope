import * as React from "react";
import { MessageSquare } from "lucide-react";

import { NavMain } from "~/components/nav/nav-main";
import { NavUser } from "~/components/nav/nav-user.client";
import { TeamSwitcher } from "~/components/nav/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { useUser } from "@descope/react-sdk";
import { AuthenticatedUser } from "../../lib/auth/auth-types";

// This is sample data.
const data = {
  teams: [
    {
      name: "Remix Auth Descope",
      logo: LockClosedIcon,
      plan: "Demo",
    },
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  if (!user.email || !user.name) {
    return <div>Loading...</div>;
  }

  const authenticatedUser: AuthenticatedUser = {
    id: user.userId,
    email: user.email,
    name: user.name,
    avatar: user.picture,
  };

  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={authenticatedUser} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  );
}

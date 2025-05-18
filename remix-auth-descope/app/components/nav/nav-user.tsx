"use client"

import {
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ThemeToggle } from "~/routes/resources.theme-toggle"
import { useCallback } from "react"
import { useDescope } from "@descope/react-sdk"
import { AuthenticatedUser } from "../../lib/auth/auth-types"

export function NavUser({
  user,
}: {
  user: AuthenticatedUser
}) {
  const { isMobile } = useSidebar()
  const { logout } = useDescope()
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-9 w-9 rounded-lg border shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg font-medium">
                  {user.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg border shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg font-medium">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

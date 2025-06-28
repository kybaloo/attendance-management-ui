import {
  RiExpandUpDownLine,
  RiUserLine,
  RiSettings3Line,
  RiSparklingLine,
  RiLogoutCircleLine,
} from "@remixicon/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">S</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <RiExpandUpDownLine className="ml-auto size-5 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) dark bg-sidebar"
            side="bottom"
            align="end"
            sideOffset={4}
          >            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="gap-3 focus:bg-sidebar-accent">
                <Link href="/board/profile">
                  <RiUserLine
                    size={20}
                    className="size-5 text-muted-foreground/80"
                  />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-3 focus:bg-sidebar-accent">
                <Link href="/board/settings">
                  <RiSettings3Line
                    size={20}
                    className="size-5 text-muted-foreground/80"
                  />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
                <RiSparklingLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                />
                Upgrade
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
                <RiLogoutCircleLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

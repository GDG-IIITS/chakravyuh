"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Trophy, Users2, Github, LogOut } from "lucide-react";
import { SidebarUserCard } from "./sidebar-user-card";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "@/context/authProvider";
import { Button } from "./ui/button";

const sidebarItems = [
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Challenges", icon: Trophy, href: "/admin/challenges" },
  { name: "Teams", icon: Users2, href: "/admin/teams" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);

  return (
    <SidebarProvider>
      <Sidebar className="">
        <SidebarHeader>
          <h2 className="text-xl font-bold text-center">Ckvh Admin</h2>
        </SidebarHeader>
        <hr />
        <SidebarContent className="px-4 py-4">
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <hr />
        <SidebarFooter className="flex flex-row items-center justify-center py-5">
          <SidebarUserCard username={user?.fullName} role={user?.role} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

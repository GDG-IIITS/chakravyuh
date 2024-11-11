"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Trophy, Users2, Github, LogOut } from "lucide-react";

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
  const { user, logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

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
          <Button variant={"outline"} className="w-fit">
            <div className="text-sm text-muted-foreground">
              User: {user?.fullName}
            </div>
          </Button>
          <Link
            href="https://github.com/gdg-iiits/chakravyuh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant={"outline"} className="w-fit">
              <Github />
            </Button>
          </Link>
          <Button variant={"outline"} onClick={handleLogout} className="w-fit">
            <LogOut />
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

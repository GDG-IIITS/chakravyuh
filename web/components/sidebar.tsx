"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Trophy, Award, Users2 } from "lucide-react";

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

const sidebarItems = [
  { name: "Users", icon: Users, href: "users" },
  { name: "Challenges", icon: Trophy, href: "challenges" },
  { name: "Teams", icon: Users2, href: "teams" },
];

export function AppSidebar() {
  const pathname = usePathname();

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
        <SidebarFooter>
          <hr />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Chakravyuh</p>
            <p>GDGxIOTA</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

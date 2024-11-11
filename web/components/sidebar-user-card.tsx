'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export function SidebarUserCard({ username = "Jane Doe", role = "Admin", avatarSrc = "" }: { username?: string, role?: string, avatarSrc?: string }) {
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...")
  }

  return (
    <Card className="w-full bg-sidebar">
      <div className="flex items-center">
        <div className="flex flex-1 items-center space-x-4 p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarSrc} alt={username} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-sidebar-foreground">{username}</p>
            <Badge variant="secondary" className="text-xs">
              {role}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-full aspect-square text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-l-none"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </Card>
  )
}
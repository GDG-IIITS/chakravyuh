"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, UserPlus, FileSpreadsheet } from "lucide-react";

export function WelcomePage({ user }) {
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  const stats = [
    {
      title: "Total Challenges",
      value: 50,
      icon: Trophy,
      route: "challenges",
    },
    { title: "Total Users", value: 1000, icon: Users, route: "users" },
    { title: "Total Teams", value: 75, icon: UserPlus, route: "teams" },
    {
      title: "Total Submissions",
      value: 5000,
      icon: FileSpreadsheet,
      route: "scores",
    },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Chakrvyuh [admin]</h1>
      <p className="text-lg text-muted-foreground mb-6">
        {greeting}, {user.fullName}... Welcome to the dashboard!
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => handleCardClick(stat.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

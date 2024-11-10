// app/admin/layout.tsx
"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authProvider";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  // Authentication check: redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // If user is not authenticated, show loading until the redirect is handled
  if (!isAuthenticated) {
    return <div>Loading...</div>; // You can customize this part with a spinner or any loading message
  }

  if (user?.role === "user") {
    return <div>Unauthorized !! You are a user</div>;
  }

  return (
    <div className="flex">
      <div>
        <AppSidebar />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div>{children}</div>
      </div>
    </div>
  );
}

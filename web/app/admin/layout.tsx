"use client";

import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/authProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AppSidebar } from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "https://api.chakravyuh.live/auth/me",
          { withCredentials: true }
        );

        if (response?.data?.email) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (error) {
        console.error("User not authenticated:", error);
        setIsAuthenticated(false);
        router.push("/auth/login"); // Redirect to login if not authenticated
      }
    };

    checkAuthentication();
  }, [router, setIsAuthenticated]);

  // Show a loading message while checking authentication
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  // If the authenticated user is not an admin, block access
  if (user?.role == "user") {
    return <div>Unauthorized! You are a user.</div>;
  }

  return (
    <div className="flex">
      <div>
        <AppSidebar />
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

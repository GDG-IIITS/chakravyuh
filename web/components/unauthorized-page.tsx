"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/authProvider";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export function UnauthorizedPage() {
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-black dark:text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sorry, you dont have permission to access this page. Please contact
            your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild onClick={handleLogout}>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Logout
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authProvider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated, user } = useContext(AuthContext);
  console.log(user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // or you could show a spinner while redirecting
  }

  return (
    <>
      <h1>Welcome to chakravyuh admin</h1>
      <p>Hi, {user?.fullName}</p>
    </>
  );
}

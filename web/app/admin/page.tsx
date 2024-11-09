"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authProvider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>Welcome to chakravyuh admin</h1>
      <p>Hi, {user?.fullName}</p>
    </>
  );
}

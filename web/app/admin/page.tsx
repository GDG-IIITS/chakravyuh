"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/authProvider";
import { WelcomePage } from "@/components/welcome";

export default function Page() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <WelcomePage user={user} />
    </>
  );
}

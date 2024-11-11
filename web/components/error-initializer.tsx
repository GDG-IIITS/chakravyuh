"use client";

import { useError } from "@/context/errorContext";
import { useEffect } from "react";
import { initializeErrorHandler } from "@/utils/errorHandler";

export function ErrorInitializer({ children }: { children: React.ReactNode }) {
  const { showError } = useError();

  useEffect(() => {
    console.log("Initializing error handler"); // Debug log
    initializeErrorHandler(showError);
  }, [showError]);

  return <>{children}</>;
}

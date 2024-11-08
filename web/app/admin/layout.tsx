"use client";

import { AppSidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div>
          <AppSidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}

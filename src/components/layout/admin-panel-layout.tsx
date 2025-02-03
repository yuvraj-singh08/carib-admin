"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "./sidebar";
import { Navbar } from "./layout-navbar";
import { AdminProvider } from "../AdminProvider/admin-context";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <AdminProvider>
      <Navbar className="fixed top-0 left-0 right-0" />
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 pt-[56px]", // Add padding for the fixed navbar height
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </AdminProvider>
  );
}

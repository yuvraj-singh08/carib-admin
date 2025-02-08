import AdminPanelLayout from "@/components/layout/admin-panel-layout";

import { useAuthMiddleware } from "@/authMiddleware";

export default function Layout({ children }: { children: React.ReactNode }) {
  useAuthMiddleware();

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

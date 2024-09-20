import AdminPanelLayout from "@/components/layout/admin-panel-layout";


export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
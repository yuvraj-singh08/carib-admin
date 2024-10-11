import { useEffect } from "react";
import { toast } from "react-hot-toast";
import AdminPanelLayout from "@/components/layout/admin-panel-layout";
import useAuth from "@/hooks/use-auth";

import { useNavigate } from "react-router-dom";
import TableLoader from "@/components/shared/table-loader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in and their role is not ADMIN, log them out and show a toast
    if (user && user.role !== "ADMIN") {
      toast.error("You are not authorized to access this page.");
      logout(); // Log the user out
      navigate("/login");
    }
  }, [user, logout, navigate]);

  // If the user is not an admin but passed the initial check, show unauthorized message
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <TableLoader />
      </div>
    );
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

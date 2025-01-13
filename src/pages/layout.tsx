import { useEffect } from "react";
// import { toast } from "react-hot-toast";
import AdminPanelLayout from "@/components/layout/admin-panel-layout";
import useAuth from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in and their role is not ADMIN, log them out and show a toast
    // if (user && user.role !== "ADMIN") {
    //   toast.error("You are not authorized to access this page.");
    //   logout(); // Log the user out
    //   navigate("/login");
    // }
  }, [user, logout, navigate]);


  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}

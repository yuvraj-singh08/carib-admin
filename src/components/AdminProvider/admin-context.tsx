import { AppDispatch, RootState } from "@/provider/redux-provider";
import { fetchUserById, User } from "@/redux/useSlice";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AdminContextType {
  admin: User | null;
  hasPermission: (resource: string, action: string) => boolean;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const admin = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  if (!admin) {
    return null;
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!admin || !admin.role || !admin.permissions) return false;

    return admin.permissions.some(
      (permission) =>
        permission.name === resource &&
        action
          .split("|")
          .map((a) => permission.actions.includes(a))
          .includes(true)
    );
  };

  const value = {
    admin,
    hasPermission,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

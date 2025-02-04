import React from "react";
import { useAdmin } from "../AdminProvider/admin-context";

export interface userPermission {
  name: string;
  actions: string[];
}

interface PermissionGroupProps {
  resource: string;
  action: string;
  children: React.ReactNode;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({
  resource,
  action,
  children,
}) => {
  const { hasPermission } = useAdmin();
  
  if (!hasPermission(resource, action)) {
    return null;
  }

  return children;
};

export default PermissionGroup;

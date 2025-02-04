import React from "react";
import { useAdmin } from "../AdminProvider/admin-context";

export interface userPermission {
  name: string;
  actions: string[];
}

interface PermissionButtonGroupProps {
  resource: string;
  action: string;
  children: React.ReactElement;
}

const PermissionButtonGroup: React.FC<PermissionButtonGroupProps> = ({
  resource,
  action,
  children,
}) => {
  const { hasPermission } = useAdmin();

  if (!hasPermission(resource, action)) {
    return null;
  }

  return React.cloneElement(children, { onClick: children.props.onClick });
};

export default PermissionButtonGroup;

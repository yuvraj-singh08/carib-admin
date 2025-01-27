import { hasPermission } from "@/lib/hasPermission";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { fetchUserById } from "@/redux/useSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();

  const admin = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  if (!admin) {
    return null;
  }

  const userPermission = admin.permissions;

  console.log(userPermission);
  if (!userPermission) {
    return null;
  }

  const hasPermissionToRender = admin && hasPermission(admin, resource, action);

  if (!hasPermissionToRender) {
    return null;
  }

  return React.cloneElement(children, { onClick: children.props.onClick });
};

export default PermissionButtonGroup;

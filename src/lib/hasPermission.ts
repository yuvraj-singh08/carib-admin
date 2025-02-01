import { User } from "@/redux/useSlice";

export const hasPermission = (
  user: User | null,
  resource: string,
  action: string
): boolean => {
  if (!user || !user.role || !user.permissions) return false;

  return user.permissions.some(
    (permission) =>
      permission.name === resource && action.split("|").map((a) => permission.actions.includes(a)).includes(true)
  );
};

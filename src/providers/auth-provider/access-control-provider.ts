import { AccessControlProvider } from "@refinedev/core";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import { UserRole } from "../../lib/enums/user-role.enum";

type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  exp: number;
  iat: number;
};

export const createAccessControlProvider = (): AccessControlProvider => {
  return {
    can: async ({ resource, action }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data: session } = useSession();

      if (!session?.accessToken) {
        return { can: false };
      }

      try {
        const decoded = jwtDecode<JwtPayload>(session.accessToken);
        const userRole = decoded.role;

        const permissions: Record<UserRole, string[]> = {
          [UserRole.SUPERADMIN]: ["*"],

          [UserRole.ADMIN]: [
            "users:*",
            "agents:*",
            "customers:*",
            "dashboard:*",
            "reports:*",
            "settings:*",
          ],

          [UserRole.STAFF_WAREHOUSE]: [
            "customers:list",
            "customers:show",
            "customers:edit",
            "dashboard:show",
            "reports:show",
            "profile:*",
          ],

          [UserRole.CUSTOMER]: ["dashboard:show", "profile:*", "orders:*"],
        };

        const rolePermissions = permissions[userRole] || [];

        if (rolePermissions.includes("*")) {
          return { can: true };
        }

        const hasPermission =
          rolePermissions.includes(`${resource}:${action}`) ||
          rolePermissions.includes(`${resource}:*`);

        return { can: hasPermission };
      } catch (error) {
        return { can: false };
      }
    },
  };
};

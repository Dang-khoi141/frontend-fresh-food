import { AuthProvider } from "@refinedev/core";
import { jwtDecode } from "jwt-decode";
import { signIn, signOut, useSession } from "next-auth/react";
import { UserRole } from "../../lib/enums/user-role.enum";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
  name: string;
  exp: number;
  iat: number;
};
export const createAuthProvider = (): AuthProvider => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session, status } = useSession();
  return {
    login: async (params?: {
      email?: string;
      password?: string;
      redirectPath?: string;
    }) => {
      const { email, password, redirectPath } = params ?? {};
      if (!email || !password) {
        return {
          success: false,
          error: {
            name: "Missing credentials",
            message: "Email and password is required",
          },
        };
      }

      const res = await signIn("CredentialsSignIn", {
        email,
        password,
        redirect: false,
        callbackUrl: redirectPath || "/",
      });

      if (!res) {
        return {
          success: false,
          error: {
            name: "Login Error",
            message: " Error",
          },
        };
      }

      if (res.ok) {
        return { success: true, redirectTo: res.url || redirectPath || "/" };
      }

      return {
        success: false,
        error: {
          name: "Login Error",
          message: res.error?.toString() || "Login Error",
        },
      };
    },

    register: async (params?: {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
      redirectPath?: string;
    }) => {
      const { email, password, name, phone, redirectPath } = params ?? {};
      if (!email || !password) {
        return {
          success: false,
          error: {
            name: "Missing fields",
            message: "Email and password is required",
          },
        };
      }

      const res = await signIn("CredentialsSignUp", {
        email,
        password,
        name,
        phone,
        redirect: false,
        callbackUrl: redirectPath || "/",
      });

      if (!res) {
        return {
          success: false,
          error: {
            name: "Register Error",
            message: "Error",
          },
        };
      }

      if (res.ok) {
        return { success: true, redirectTo: res.url || redirectPath || "/" };
      }

      return {
        success: false,
        error: {
          name: "Register Error",
          message: res.error?.toString() || "Register Error",
        },
      };
    },

    logout: async () => {
      await signOut({ redirect: true, callbackUrl: "/login" });
      return { success: true };
    },

    check: async () => {
      if (status === "unauthenticated") {
        return { authenticated: false, redirectTo: "/login" };
      }

      if (session?.accessToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(session.accessToken);
          const validRoles = [
            UserRole.SUPERADMIN,
            UserRole.ADMIN,
            UserRole.AGENT,
            UserRole.CUSTOMER,
          ];

          if (!decoded.role || !validRoles.includes(decoded.role as UserRole)) {
            return {
              authenticated: false,
              redirectTo: "/login",
              error: { message: "Invalid role", name: "AuthError" },
            };
          }
        } catch (error) {
          return {
            authenticated: false,
            redirectTo: "/login",
            error: { message: "Invalid token", name: "AuthError" },
          };
        }
      }

      return { authenticated: true };
    },

    getPermissions: async () => {
      if (!session?.accessToken) return null;

      try {
        const decoded = jwtDecode<JwtPayload>(session.accessToken);
        return [decoded.role];
      } catch (error) {
        return null;
      }
    },

    getIdentity: async () => {
      if (!session?.accessToken) return null;
      const decoded = jwtDecode<JwtPayload>(session.accessToken);
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };
    },

    onError: async (error: any) => {
      if (error?.response?.status === 401) {
        return { logout: true, redirectTo: "/login" };
      }
      return { error };
    },
  };
};

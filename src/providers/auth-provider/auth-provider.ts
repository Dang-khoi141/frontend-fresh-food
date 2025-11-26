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
            name: "Thiếu thông tin",
            message: "Vui lòng nhập email và mật khẩu",
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
            name: "Lỗi đăng nhập",
            message: " Email hoặc mật khẩu không đúng",
          },
        };
      }

      if (res.ok) {
        return { success: true, redirectTo: res.url || redirectPath || "/" };
      }

      return {
        success: false,
        error: {
          name: "Đăng nhập thất bại",
          message: res.error?.toString() || "Email hoặc mật khẩu không đúng",
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
            name: "Thiếu thông tin",
            message: "Vui lòng điền đầy đủ thông tin",
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
            name: "Lỗi đăng ký",
            message: "Đăng ký thất bại",
          },
        };
      }

      if (res.ok) {
        return { success: true, redirectTo: res.url || redirectPath || "/" };
      }

      return {
        success: false,
        error: {
          name: "Đăng ký thất bại",
          message: res.error?.toString() || "Đăng ký thất bại",
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
            UserRole.STAFF_WAREHOUSE,
            UserRole.CUSTOMER,
          ];

          if (!decoded.role || !validRoles.includes(decoded.role as UserRole)) {
            return {
              authenticated: false,
              redirectTo: "/login",
              error: {
                message: "Quyền truy cập không hợp lệ",
                name: "Lỗi xác thực",
              },
            };
          }
        } catch (error) {
          return {
            authenticated: false,
            redirectTo: "/login",
            error: { message: "Token không hợp lệ", name: "Lỗi xác thực" },
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

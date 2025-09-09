import type { DefaultSession } from "types/next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    role: string;
    organizationId?: string;
    accessToken?: string;
    refreshToken?: string;
    user: {} & DefaultSession["user"];
  }
  interface Session {
    user: {
      id: string | null;
      name: string | null;
      email: string | null;
      role: string | null;
      // image: string | null;
      address: string | null;
      organizationId: string | null;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
  }
  declare module "next-auth/jwt" {
    interface JWT {
      id?: string;
      organizationId?: string;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
      error?: string;
    }
  }
}

import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function createAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });
}

const axiosInstance = createAxiosInstance();

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing access token...");

    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken: token.refreshToken,
    });

    console.log("Token refreshed successfully");

    const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
    const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

    if (!newAccessToken) {
      console.error("No accessToken in refresh response:", response.data);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "CredentialsSignIn",
      name: "SignIn",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axiosInstance.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          console.log("🚀 ~ authorize ~ res:", res.data);

          const { accessToken, refreshToken } = res.data.data;

          if (accessToken) {
            const decoded: any = jwtDecode(accessToken);

            return {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name,
              accessToken,
              refreshToken,
            } as User;
          }

          return null;
        } catch (err) {
          console.error("❌ Login failed", err);
          throw new Error("Email hoặc mật khẩu không đúng");
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: "CredentialsSignUp",
      name: "SignUp",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "number" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axiosInstance.post("/auth/register", {
            email: credentials?.email,
            password: credentials?.password,
            name: credentials?.name,
            phone: credentials?.phone,
          });

          const user = res.data?.user;
          if (user) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            } as User;
          }
          return null;
        } catch (err) {
          console.error("❌ Register failed", err);
          throw new Error("Đăng ký thất bại");
          return null;
        }
      },
    }),
  ],

  secret: process.env.JWT_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.sub = user.id;
        token.error = undefined;
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
        return session;
      }

      session.user = {
        id: token.sub as string,
        email: token.email as string,
        role: token.role as string,
        name: token.name as string,
        address: null,
        organizationId: null,
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 14 * 60,
    updateInterval: 5 * 60,
  },
};

export default authOptions;

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
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken: token.refreshToken,
    });

    if (!response.data?.data?.accessToken) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
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
          console.error("Login failed", err);
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
          console.error("Register failed", err);
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
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
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
    maxAge: 15 * 24 * 60 * 60,
  },
};

export default authOptions;

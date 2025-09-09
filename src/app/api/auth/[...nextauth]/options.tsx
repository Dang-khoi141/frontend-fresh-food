import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return instance;
}
const axiosInstance = createAxiosInstance();

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
          if (res.data?.accessToken) {
            const decode = jwtDecode<any>(res.data?.accessToken);
            return {
              id: decode.id,
              email: decode.email,
              role: decode.role,
              accessToken: res.data.accessToken,
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
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const res = await axiosInstance.post("/auth/register", {
            email: credentials?.email,
            password: credentials?.password,
            name: credentials?.name,
          });

          if (res.data?.user) {
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              role: res.data.user.role,
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.email = token.email;
      session.user.role = token.role;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
export default authOptions;

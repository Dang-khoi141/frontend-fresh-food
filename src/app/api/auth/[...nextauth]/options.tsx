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

          const accessToken = res.data?.data?.accessToken;

          if (accessToken) {
            const decoded: any = jwtDecode(accessToken);

            return {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name,
              accessToken,
            } as User;
          }

          return null;
        } catch (err) {
          console.error("Login failed", err);
          return null;
        }
      }


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
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        token.email = (user as any).email;
        token.sub = (user as any).id;
        if (typeof window !== "undefined" && token.accessToken) {
          localStorage.setItem("access_token", token.accessToken as string);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        email: token.email as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

export default authOptions;

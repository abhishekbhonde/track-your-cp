import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/app/lib/prisma";  
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt"
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "enter your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        // ✅ Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found with this email");
        }

        // ✅ Verify password using bcrypt (assuming passwords are hashed)
        //@ts-ignore
        const isValidPassword =await  bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: "7d",
        });

        return { ...user, accessToken: token };
      },
    }),
 
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // ✅ Store accessToken for Credentials Login
      if (user) {
        //@ts-ignore
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
        //@ts-ignore
      session.accessToken = token.accessToken;
      //@ts-ignore
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // ✅ Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Important for JWT handling
};

const handler = NextAuth(authOptions);

// ✅ App Router requires named exports for HTTP methods:
export { handler as GET, handler as POST };

// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    address: string;
    chainId: number;
  }

  interface User extends DefaultUser {
    address: string;
    chainId: number;
  }
}

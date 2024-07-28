import { variables } from "@/utils/env";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  type SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@web3modal/siwe";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
  }

  interface User {
    id: string;
    address: string;
    chainId: number;
  }
}

const nextAuthSecret = variables?.authSecret;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = variables?.w3mProjectId;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_W3M_PROJECT_ID is not set");
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            throw new Error("Missing credentials");
          }
          const { message, signature } = credentials;
          const address = getAddressFromMessage(message);
          const chainId: any = parseInt(getChainIdFromMessage(message), 10);

          const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId,
            projectId,
          });

          if (isValid) {
            return {
              id: `${chainId}:${address}`,
              address,
              chainId,
            };
          }

          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session({ session, token }) {
      if (token?.sub) {
        const [chainId, address] = token.sub.split(":");
        session.address = address;
        session.chainId = parseInt(chainId, 10);
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = `${user.chainId}:${user.address}`;
        token.address = user.address;
        token.chainId = user.chainId;
      }

      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

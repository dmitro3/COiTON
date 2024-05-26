"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Web3ModalProvider } from "./web3modal";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

// Create a default value for the context

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { address } = useWeb3ModalAccount();

  const pathname = usePathname();
  const router = useRouter();

  const [credentials, setCredentials] = useState<UserType | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  const [isError, setIsError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data?.user) {
          setCredentials({
            name: data?.user?.user_metadata?.name,
            address: data?.user?.user_metadata?.address,
            email: data?.user?.user_metadata?.email,
            avatar: data?.user?.user_metadata?.avatar,
            id: data?.user?.id,
          });
        } else if (!data?.user) {
          if (
            pathname === "/" ||
            pathname === "/sign-in" ||
            pathname === "/sign-up"
          )
            return;
          router.push("/sign-in");
        }
      } catch (error) {
        setIsError("Error fetching user");
        console.error("Error fetching user:", error);
      } finally {
        setIsFetchingUser(false);
      }
    };

    fetchUser();
  }, [router, address]);

  return (
    <AuthContext.Provider
      value={{ credentials, isFetchingUser, isError, setCredentials }}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

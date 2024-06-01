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

import { site, supabase } from "@/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { toast } from "sonner";

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

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { data: null, error };
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getUser();

        if (!error && data?.user) {
          const userCredentials = {
            name: data.user.user_metadata?.name,
            address: data.user.user_metadata?.address,
            email: data.user.user_metadata?.email.toLowerCase(),
            avatar: data.user.user_metadata?.avatar,
            id: data.user.id,
          };
          setCredentials(userCredentials);
        } else {
          setIsError("Error fetching user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsError("Error fetching user");
      }
    };

    fetchUser();
  }, [router, address]);

  const providerValues = {
    credentials,
    isFetchingUser,
    isError,
    setCredentials,
    getUser,
  };

  return (
    <AuthContext.Provider value={providerValues}>
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

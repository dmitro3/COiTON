"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Web3ModalProvider } from "./web3modal";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { logoutUser } from "@/auth";

// Create a default value for the context
const defaultContextValue = {
  isFetchingUser: false,
  credentials: undefined,
  isError: "",
};

export const AuthContext = createContext<AuthContextType | undefined>(
  defaultContextValue
);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { address } = useWeb3ModalAccount();

  const [isFetchingUser, setIsFetchingUser] = useState<boolean | undefined>(
    true
  ); // Initialize with false instead of undefined
  const [credentials, setCredentials] = useState<UserType | null | undefined>();
  const [isError, setIsError] = useState<string>("");

  useEffect(() => {
    loggedInUser()
      .then(async (user) => {
        setCredentials({
          name: user?.user_metadata?.name,
          address: user?.user_metadata?.address,
          email: user?.user_metadata?.email,
          avatar: user?.user_metadata?.avatar,
          id: user?.id,
        });

        return user;
      })
      .catch((error) => {
        setIsError("Error fetching user");
        console.log(error);
        router.push("/");
      })
      .finally(() => {
        setIsFetchingUser(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set the context data including user
  const contextData = {
    isFetchingUser,
    credentials,
    isError,
  };

  return (
    <AuthContext.Provider value={contextData}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </AuthContext.Provider>
  );
}

const loggedInUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

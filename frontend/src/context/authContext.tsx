"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Web3ModalProvider } from "./web3modal";
import { useRouter } from "next/navigation";

import { supabase } from "@/constants";

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

  const [isFetchingUser, setIsFetchingUser] = useState<boolean | undefined>(
    true
  ); // Initialize with false instead of undefined
  const [credentials, setCredentials] = useState<UserType | null | undefined>();
  const [isError, setIsError] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

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

export const loggedInUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

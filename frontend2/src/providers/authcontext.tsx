"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";
import { supabase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { Web3ModalProvider } from "./web3modal";

interface IAuth {
  address: string | undefined;
  connectAccount: () => void;
  getUser: () => void;
  logoutUser: () => void;
  registerUser: ({
    name,
    email,
    password,
    address,
  }: {
    name: string;
    email: string;
    password: string;
    address: any;
  }) => void;
  loginUser: ({ email, password }: { email: string; password: string }) => void;
  isConnected: boolean;
  isLoadingAuth: boolean;
  isFetchingUser: boolean;
  credentials: any;
}

// Create a context with a default value
const AuthContext = createContext<IAuth | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const connectAccount = () => open();

  const { address, isConnected } = useWeb3ModalAccount();

  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  const [credentials, setCredentials] = useState<any | null>(null);

  const registerUser = async ({
    name,
    email,
    password,
    address,
  }: {
    name: string;
    email: string;
    password: string;
    address: any;
  }) => {
    setIsLoadingAuth(true);

    const avatar = createAvatar(pixelArt, {
      seed: `${name + email + address + password}`,
    }).toString();

    const origin = "http://localhost:3000";

    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/sign-in`,
          data: {
            name,
            address,
            avatar,
          },
        },
      });

      return result;
    } catch (error: any) {
      return error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoadingAuth(true);
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (result?.data?.session) {
        setIsFetchingUser(false);
      }
      return result;
    } catch (error: any) {
      return error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logoutUser = async () => {
    setIsFetchingUser(true);
    try {
      const result = await supabase.auth.signOut();
      router.push("/sign-in");
      setCredentials(null);
      // disconnect();
      return result;
    } catch (error) {
      return error;
    }
  };

  const getUser = async () => {
    try {
      const result = await supabase.auth.getUser();
      if (!result?.error || result?.data?.user) {
        setCredentials({
          name: result?.data?.user?.user_metadata?.name,
          address: result?.data?.user?.user_metadata?.address,
          email: result?.data?.user?.user_metadata?.email,
          avatar: result?.data?.user?.user_metadata?.avatar,
          id: result?.data?.user?.id,
        });
      }
      return result;
    } catch (error: any) {
      return error;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
        setIsFetchingUser(false);
      } catch (error: any) {
        console.log("ERROR FETCHING USER: ", error);
        router.push("/sign-in");
      }
    };

    fetchUser();
  }, [router]);

  const providerValue = {
    //? functions
    getUser,
    logoutUser,
    connectAccount,
    registerUser,
    loginUser,
    //? others
    address,
    isConnected,
    isLoadingAuth,
    credentials,
    isFetchingUser,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): IAuth => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

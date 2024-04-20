"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Web3ModalProvider } from "./web3modal";
import { toast } from "sonner";
import { account } from "@/lib/utils";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";

// Create a default value for the context
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: false,
  isFetchingUser: false,
  registerUser: () => {},
  loginUser: () => {},
  logoutUser: () => {},
  checkUserStatus: () => {},
};

export const AuthContext = createContext(defaultContextValue);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  // ! REGISTER USER
  const registerUser = ({
    email,
    address,
  }: {
    email: string;
    address: string;
  }) => {
    setIsLoading(true);

    try {
      const promise = account.create(ID.unique(), email, address);

      promise.then(
        function (response: any) {
          toast("Registration Successful", {
            description: "Redirecting to dashboard, please wait...",
          });
          router.push("/dashboard"); // Success
          setIsLoading(false);
        },
        function (error: any) {
          toast("Something went wrong", {
            description: error.message,
          });
          console.log(error);
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      toast("Something went wrong", {
        description: error,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  // ! LOGIN USER
  const loginUser = ({
    email,
    address,
  }: {
    email: string;
    address: string;
  }) => {
    setIsLoading(true);

    try {
      const promise = account.createEmailPasswordSession(email, address);

      promise.then(
        function (response: any) {
          toast("Login Successful", {
            description: "Redirecting to dashboard, please wait...",
          });
          router.push("/dashboard"); // Success
          setIsLoading(false);
        },
        function (error: any) {
          toast("Something went wrong", {
            description: error.message,
          });
          console.log(error);
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      toast("Something went wrong", {
        description: error,
      });
      console.log(error);
      setIsLoading(false);
    }
  };

  // ! LOGOUT USER
  const logoutUser = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error: any) {
      toast("Something went wrong", {
        description: error,
      });
      console.log(error);
    }
  };

  // ! GET USER
  const checkUserStatus = async () => {
    setIsFetchingUser(true);

    try {
      const accountDetails: any = await account.get();
      console.log("accountDetails", accountDetails);
      setUser(accountDetails);
    } catch (error: any) {
      toast("Something went wrong", {
        description: error,
      });
      console.log(error);
    } finally {
      setIsFetchingUser(false);
    }
  };

  // Set the context data including user
  const contextData: AuthContextType = {
    user,
    isLoading,
    isFetchingUser,
    registerUser,
    loginUser,
    logoutUser,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextData}>
      <Web3ModalProvider>{children}</Web3ModalProvider>
    </AuthContext.Provider>
  );
}

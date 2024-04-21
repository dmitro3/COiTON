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

import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

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

  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>();

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
      const promise = account.create(ID.unique(), email, address, address);
      const accountDetails: any = account.get();
      setUser(accountDetails);

      promise.then(
        function (response: any) {
          toast("Registration Successful", {
            description: "Redirecting to dashboard, please wait...",
          });
          router.push("/login"); // Success
          setIsLoading(false);
        },
        function (error: any) {
          toast("Something went wrong", {
            description: error.message,
          });
          router.back();
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
      const accountDetails: any = account.get();
      setUser(accountDetails);

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
          router.back(); // Success
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
      router.push("/login");
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
    try {
      const accountDetails: any = await account.get();

      const avatar = createAvatar(pixelArt, {
        seed: accountDetails?.name,
      }).toString();

      const userObj: UserType = {
        avatar: `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`,
        name: accountDetails.name,
        email: accountDetails.email,
        id: accountDetails.$id,
        registration: accountDetails.registration,
      };

      console.log("user object", userObj);
      setUser(userObj);
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

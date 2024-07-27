"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetch } from "@/hooks/useFetch";
import { signOut } from "@/utils/db/apiAuth";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function LogoutModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { fn: signOutFn, isLoading: isSigningOut }: IFetchHook =
    useFetch(signOut);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You won&apos;t be able to access any pages after signing out until
            you sign back in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSigningOut}
            onClick={async () => {
              await signOutFn();
              router.push("/sign-in");
            }}>
            {isSigningOut ? "Signing out..." : "Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

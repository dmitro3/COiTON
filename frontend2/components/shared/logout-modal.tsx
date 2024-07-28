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
import { Button } from "../ui/button";
import { Loader, X } from "lucide-react";

export function LogoutModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { fn: signOutFn, isLoading: isSigningOut }: IFetchHook =
    useFetch(signOut);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader className="flex flex-col gap-2">
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You won&apos;t be able to access any pages after signing out until
            you sign back in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            asChild
            className="absolute top-2 right-2 p-0 size-auto">
            <Button
              className="rounded-full size-9"
              variant={"outline"}
              size={"icon"}>
              <X className="size-4" />
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction disabled={isSigningOut} asChild>
            <Button
              disabled={isSigningOut}
              onClick={async () => {
                await signOutFn();
                router.push("/sign-in");
              }}
              className="w-full rounded-full">
              {isSigningOut ? (
                <>
                  <Loader className="animate-spin mr-2 size-4" />
                  Signing out...
                </>
              ) : (
                "Proceed"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
} from "@/components/ui/alert-dialog";
import { useStake } from "@/hooks/useFetchBackend";
import { useRouter } from "next/navigation";

export function ApproveStake({ staked }: { staked: boolean }) {
  const { isLoading, handleStake } = useStake();
  const router = useRouter();

  return (
    <AlertDialog open={staked}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are not staked</AlertDialogTitle>
          <AlertDialogDescription>
            You need to approve the transaction in order to be staked.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={() => router.push("/dashboard")}> */}
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStake} disabled={isLoading}>
            {isLoading ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

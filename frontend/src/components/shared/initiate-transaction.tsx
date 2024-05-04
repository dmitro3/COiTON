import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

export const InitiatePurchaseTransaction = ({
  agentId,
}: {
  agentId: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Initiate Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Initiate Purchase Transaction</DialogTitle>
          <DialogDescription>
            Initiate a new purchase transaction
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Agent
            </Label>
            <Input
              id="address"
              type="text"
              value={agentId}
              disabled={!!agentId}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="amount" className="text-right">
              Buyers
            </Label>
            <Textarea
              cols={8}
              rows={8}
              placeholder="Add the number of buyers"
              className="bg-secondary/20 col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

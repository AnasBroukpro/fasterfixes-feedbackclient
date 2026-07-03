"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation } from "@tanstack/react-query";
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
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";

type ResetUserPasswordButtonProps = {
  userId: string;
};

export const RequestPasswordResetButton = ({
  userId,
}: ResetUserPasswordButtonProps) => {
  const trpc = useTRPC();
  const [newPassword, setNewPassword] = useState("");

  const mutation = useMutation(
    trpc.admin.users.password.requestReset.mutationOptions({
      onSuccess: () => {
        toast.success("Success", {
          description: "Password has been updated",
        });
        setNewPassword("");
      },
      onError: (error) => {
        toast.error("Error", {
          description: error.message || "Failed to update password",
        });
      },
    }),
  );

  const handleSetPassword = () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    mutation.mutate({ userId, newPassword });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Reset password</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set a new password</AlertDialogTitle>
          <AlertDialogDescription>
            Enter a new password for this user. They will use this to sign in.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="text"
            placeholder="••••••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setNewPassword("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSetPassword}
            disabled={mutation.isPending || newPassword.length < 8}
          >
            {mutation.isPending ? "Saving..." : "Set password"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

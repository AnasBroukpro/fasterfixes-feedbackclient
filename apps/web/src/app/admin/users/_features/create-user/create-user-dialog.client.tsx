"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionButton } from "@workspace/ui/components/action-button";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Copy, Plus, UserCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUserSchema, type CreateUserInputs } from "./create-user.schema";

export function CreateUserDialog() {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState<{
    email: string;
    name: string;
    temporaryPassword: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    trpc.admin.users.create.mutationOptions({
      onSuccess: (data) => {
        setCreatedUser({
          email: data.email,
          name: data.name,
          temporaryPassword: data.temporaryPassword,
        });
        form.reset();
        queryClient.invalidateQueries(trpc.admin.users.list.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create user");
      },
    }),
  );

  const form = useForm<CreateUserInputs>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      name: "",
      firstName: "",
      lastName: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CreateUserInputs) => {
    setCreatedUser(null);
    await createUserMutation.mutateAsync(data);
  };

  const copyPassword = () => {
    if (createdUser) {
      navigator.clipboard.writeText(createdUser.temporaryPassword);
      toast.success("Password copied to clipboard");
    }
  };

  if (createdUser) {
    return (
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setCreatedUser(null); }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus />
            Add user
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User created</DialogTitle>
            <DialogDescription>
              Share these credentials with the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="size-4" />
                <span>{createdUser.name}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{createdUser.email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Temporary password</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-mono">
                  {createdUser.temporaryPassword}
                </code>
                <Button variant="outline" size="icon" onClick={copyPassword}>
                  <Copy className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The user should change this password after signing in.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => { setCreatedUser(null); setOpen(false); }}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new user</DialogTitle>
          <DialogDescription>
            A temporary password will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      disabled={createUserMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={createUserMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      disabled={createUserMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      disabled={createUserMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <ActionButton
                type="submit"
                disabled={!form.formState.isValid}
                pending={createUserMutation.isPending}
              >
                {createUserMutation.isPending
                  ? "Creating..."
                  : "Create user"}
              </ActionButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

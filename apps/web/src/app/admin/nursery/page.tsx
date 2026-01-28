"use client";

import { useDeleteNursery } from "@/features/nursery/actions/delete-nursery.action";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";
import { Trash } from "lucide-react";
import { useState } from "react";

const formatDateFormal = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AdminNurseryPage() {
  const { data: nurseries, isLoading, isError, error } = useGetNurseries();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Nurseries</h1>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading nurseries…</div>
      ) : isError ? (
        <div className="text-center text-red-600">Error: {String(error)}</div>
      ) : !nurseries || nurseries.length === 0 ? (
        <div className="text-center text-gray-500">No nurseries found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {nurseries.map((n) => (
            <Card key={n.id} className="flex  hover:scale-[1.01]  flex-col h-full shadow-md hover:shadow-lg transition-shadow bg-gradient-to-tr from-bg-white to-white hover:bg-green-50 hover:to-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-800">
                  {n.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 mb-2" >{n.description??""}</p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Address:</strong> {n.address ?? "—"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Phones:</strong> {(n.phoneNumbers || []).filter(Boolean).join(", ") || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Created:</strong> {n.createdAt ? formatDateFormal(n.createdAt) : "—"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <ActionsCell nurseryId={n.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionsCell({ nurseryId }: { nurseryId: string }) {
  const { mutateAsync: deleteNursery, isLoading } = useDeleteNursery();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await deleteNursery(nurseryId);
      setOpen(false);
    } catch (err) {
      console.error(err);
      // keep dialog open to let user retry or cancel
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isLoading}
            size="sm"
            icon={<Trash />}
            className="cursor-pointer"
          >
            Remove
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">Delete nursery</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            This action will permanently delete the nursery and cannot be undone.
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isLoading}
          >
            {isLoading ? "Deleting…" : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

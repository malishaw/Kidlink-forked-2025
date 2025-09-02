"use client";

import { formatDistanceToNow } from "date-fns";
import { PencilIcon } from "lucide-react";
import { useId, useTransition } from "react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

import { toast } from "sonner";

// ⬇️ Adjust these imports to your actual action filenames/exports.
import { updateLessonPlan } from "../actions/update-lesson-plan.action";
import { EditLessonPlan } from "./edit-lesson-plan";
import { DeleteLessonPlan } from "./delete-lesson-plan";

// ⬇️ Types from your new schema file
import type {
  lessonPlan as LessonPlanType,
  lessonPlanUpdateType,
} from "../schemas";

type Props = {
  lesson: LessonPlanType;
};

export function LessonPlanCard({ lesson }: Props) {
  const toastId = useId();
  const [isPending, startTransition] = useTransition();

  // Add null/undefined check
  if (!lesson) {
    return null;
  }

  const data = lesson as LessonPlanType & Record<string, any>;

  const title: string =
    (typeof data?.title === "string" && data.title) ||
    (typeof data?.name === "string" && data.name) ||
    (typeof data?.topic === "string" && data.topic) ||
    `Lesson ${data?.id || "Unknown"}`;

  // `createdAt` comes from the select schema (Date or string -> Date)
  const createdAt: Date =
    data?.createdAt instanceof Date
      ? data.createdAt
      : data?.createdAt
        ? new Date(data.createdAt)
        : new Date(); // fallback to current date

  const hasDone = data && "done" in data;
  const hasCompleted = data && "completed" in data;
  const hasPublished = data && "published" in data;
  const hasIsDraft = data && "isDraft" in data;

  const canToggle = hasDone || hasCompleted || hasPublished || hasIsDraft;

  const checked = hasDone
    ? Boolean(data?.done)
    : hasCompleted
      ? Boolean(data?.completed)
      : hasPublished
        ? Boolean(data?.published)
        : hasIsDraft
          ? !Boolean(data?.isDraft)
          : false;

  const badgeText =
    hasDone || hasCompleted
      ? checked
        ? "Completed"
        : "Not Completed"
      : hasPublished || hasIsDraft
        ? checked
          ? "Published"
          : "Draft"
        : undefined;

  const handleToggle = (next: boolean) => {
    if (!canToggle) return;

    startTransition(async () => {
      try {
        toast.loading("Updating lesson plan...", { id: toastId });

        let payload: Partial<lessonPlanUpdateType> = {};

        if (hasDone) payload = { ...(payload as any), done: next } as any;
        else if (hasCompleted)
          payload = { ...(payload as any), completed: next } as any;
        else if (hasPublished)
          payload = { ...(payload as any), published: next } as any;
        else if (hasIsDraft)
          payload = { ...(payload as any), isDraft: !next } as any;

        if (!Object.keys(payload).length) {
          toast.error("No toggleable status on this lesson plan.", {
            id: toastId,
          });
          return;
        }

        await updateLessonPlan(data?.id, payload as lessonPlanUpdateType);
        toast.success("Lesson plan updated", { id: toastId });
      } catch (error) {
        const err = error as Error;
        console.error(err);
        toast.error(err.message || "Failed to update lesson plan.", {
          id: toastId,
        });
      }
    });
  };

  return (
    <Card key={data?.id} className="p-0 flex flex-col gap-y-3">
      <CardHeader className="pt-4 pb-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            className={`${(hasDone || hasCompleted) && checked ? "line-through" : ""}`}
          >
            {title}
          </CardTitle>
          {badgeText ? <Badge>{badgeText}</Badge> : null}
        </div>

        <CardDescription className="p-0">
          Created {formatDistanceToNow(createdAt)} ago
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 h-6">
          <EditLessonPlan lesson={data} />
          <DeleteLessonPlan lesson={data} />
        </div>

        {canToggle ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`lesson-${data?.id}`}
              checked={checked}
              className="border border-primary"
              onCheckedChange={(v) => handleToggle(Boolean(v))}
              disabled={isPending}
            />
            <Label
              htmlFor={`lesson-${data?.id}`}
              className="text-sm text-muted-foreground"
            >
              {hasDone || hasCompleted
                ? checked
                  ? "Completed"
                  : "Mark as Completed"
                : hasPublished || hasIsDraft
                  ? checked
                    ? "Published"
                    : "Publish"
                  : "Toggle"}
            </Label>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

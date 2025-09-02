"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useGetClass } from "../actions/get-classes-action";

/**
 * Page/Layout example
 * - Places the ClassDetailsCard on the left side as a smaller/compact sidebar card
 * - Keeps main content on the right
 */
export default function ClassesPageExample({ classId }: { classId: string }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 order-1">
          <div className="sticky top-4">
            <ClassDetailsCard
              classId={classId}
              compact
              onEdit={(id) => console.log("edit", id)}
            />
          </div>
        </aside>

        {/* Main content */}
      </div>
    </div>
  );
}

// ---- Compact ClassDetailsCard -------------------------------------------------

type Props = {
  classId: string;
  onEdit?: (id: string) => void;
  /**
   * When true, renders a smaller card suitable for a left sidebar.
   */
  compact?: boolean;
};

type ClassRecord = {
  id: string;
  name: string;
  nurseryId?: string | null;
  mainTeacherId?: string | null;
  teacherIds?: string[];
  childIds?: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

// Robustly normalize various API shapes to a single record
function getRecordFromResponse(input: unknown): ClassRecord | null {
  const anyInput = input as any;

  if (anyInput && Array.isArray(anyInput.data) && anyInput.data.length > 0) {
    return anyInput.data[0] as ClassRecord;
  }
  if (anyInput && anyInput.data && !Array.isArray(anyInput.data)) {
    return anyInput.data as ClassRecord;
  }
  if (Array.isArray(anyInput) && anyInput.length > 0) {
    return anyInput[0] as ClassRecord;
  }
  if (anyInput && typeof anyInput === "object") {
    return anyInput as ClassRecord;
  }
  return null;
}

export function ClassDetailsCard({ classId, onEdit, compact = false }: Props) {
  const { data, isLoading, isError, refetch } = useGetClass(classId);
  const router = useRouter();

  // Shared classes for regular vs compact
  const cardBase = compact
    ? "w-full max-w-sm" // small width for sidebar
    : "w-full max-w-[700px]";
  const titleClass = compact ? "text-xl" : "text-2xl";
  const sectionHeading = "text-xs font-medium text-muted-foreground";

  if (!classId) {
    return (
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No class selected.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={cardBase}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Details</CardTitle>
          <Button size="sm" variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load class.</p>
        </CardContent>
      </Card>
    );
  }

  const record = getRecordFromResponse(data);

  if (!record) {
    return (
      <Card className={cardBase}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Details</CardTitle>
          <Button size="sm" variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No class found.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    id,
    name,
    nurseryId,
    mainTeacherId,
    teacherIds = [],
    childIds = [],
    createdAt,
    updatedAt,
  } = record;

  const handleClick = () => {
    if (!compact && id) {
      router.push(`/account/manage/classes/${id}`);
    }
  };
  return (
    <Card
      className={
        cardBase +
        (!compact ? " cursor-pointer hover:shadow-lg transition" : "")
      }
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={titleClass}>
          {name ?? <span className="text-muted-foreground">Unnamed class</span>}
        </CardTitle>
        <div className="flex gap-2">
          {onEdit && id && (
            <Button size="sm" onClick={() => onEdit(id)}>
              Edit
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Meta */}
        <div
          className={
            compact
              ? "grid grid-cols-1 gap-3"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }
        >
          <MetaRow label="Class ID" value={id ?? "—"} mono />
          <MetaRow label="Nursery ID" value={nurseryId ?? "—"} mono />
          <MetaRow label="Main Teacher ID" value={mainTeacherId ?? "—"} mono />
          <MetaRow
            label="Created"
            value={createdAt ? new Date(createdAt).toLocaleString() : "—"}
          />
          <MetaRow
            label="Updated"
            value={updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
          />
        </div>

        {/* Teachers */}
        <section className="space-y-2">
          <h3 className={sectionHeading}>Teachers ({teacherIds.length})</h3>
          {teacherIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No teachers.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teacherIds.map((tid) =>
                Badge ? (
                  <Badge
                    key={tid}
                    variant="outline"
                    className="font-mono text-[11px] px-2 py-1"
                  >
                    {tid}
                  </Badge>
                ) : (
                  <span
                    key={tid}
                    className="rounded-2xl border px-2 py-1 text-[11px] font-mono"
                  >
                    {tid}
                  </span>
                )
              )}
            </div>
          )}
        </section>

        {/* Children */}
        <section className="space-y-2">
          <h3 className={sectionHeading}>Children ({childIds.length})</h3>
          {childIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No children.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {childIds.map((cid) =>
                Badge ? (
                  <Badge
                    key={cid}
                    variant="outline"
                    className="font-mono text-[11px] px-2 py-1"
                  >
                    {cid}
                  </Badge>
                ) : (
                  <span
                    key={cid}
                    className="rounded-2xl border px-2 py-1 text-[11px] font-mono"
                  >
                    {cid}
                  </span>
                )
              )}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode; // allow strings or JSX
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={mono ? "font-mono text-xs break-all" : "text-xs"}>
        {value}
      </div>
    </div>
  );
}

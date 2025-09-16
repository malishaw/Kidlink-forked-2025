"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Event Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/events">
            <Button className="w-full">View All Events</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

CREATE TABLE "event" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"startdate" text,
	"enddate" text,
	"ticketprice" text,
	"venue" text,
	"cover_image_url" text,
	"gallery_images_url" text,
	"status" text,
	"organizer" text,
	"organization_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
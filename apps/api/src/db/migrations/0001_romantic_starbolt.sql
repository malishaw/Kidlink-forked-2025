CREATE TABLE "teacher" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
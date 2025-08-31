CREATE TYPE "public"."payment_method" AS ENUM('card', 'bankTransfer');--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"child_id" text,
	"parent_id" text,
	"payment_method" "payment_method" DEFAULT 'bankTransfer' NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_parent_id_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent"("id") ON DELETE no action ON UPDATE no action;
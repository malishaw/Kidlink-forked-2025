CREATE TABLE "nurseries" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"address" text,
	"longitude" real,
	"latitude" real,
	"phone_numbers" text[] DEFAULT ARRAY[]::text[],
	"logo" text,
	"photos" text[] DEFAULT ARRAY[]::text[],
	"attachments" text[] DEFAULT ARRAY[]::text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "nurseries" ADD CONSTRAINT "nurseries_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nurseries" ADD CONSTRAINT "nurseries_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
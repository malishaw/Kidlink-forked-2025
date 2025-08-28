CREATE TABLE "classes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nursery_id" text,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_nursery_id_nurseries_id_fk" FOREIGN KEY ("nursery_id") REFERENCES "public"."nurseries"("id") ON DELETE set null ON UPDATE no action;
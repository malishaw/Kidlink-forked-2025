CREATE TABLE "childrens" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization_id" text,
	"nursery_id" text,
	"parent_id" text,
	"class_id" text,
	"dob" date,
	"gender" varchar(10),
	"emergency_contact" varchar(255),
	"medical_notes" text,
	"profile_image_url" text,
	"images_url" text,
	"activities" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
ALTER TABLE "classes" ADD COLUMN "main_teacher_id" text;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "teacher_ids" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "child_ids" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "childrens" ADD CONSTRAINT "childrens_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_main_teacher_id_teacher_id_fk" FOREIGN KEY ("main_teacher_id") REFERENCES "public"."teacher"("id") ON DELETE set null ON UPDATE no action;
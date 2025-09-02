CREATE TYPE "public"."status_type" AS ENUM('ee', 'city', 'garden', 'mountain', 'pool', 'courtyard', 'street', 'interior');--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text,
	"child_id" text,
	"teacher_id" text,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'active',
	"badge_type" varchar(100),
	"icon_url" text,
	"points" integer DEFAULT 0,
	"level" varchar(50),
	"awarded_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_child_id_childrens_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."childrens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
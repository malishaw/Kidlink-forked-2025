CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"child_id" text NOT NULL,
	"amount" numeric NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"organization_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "payment" CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_child_id_childrens_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."childrens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."payment_method";
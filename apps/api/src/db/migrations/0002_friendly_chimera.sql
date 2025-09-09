CREATE TABLE "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text,
	"avatar_url" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_created_by_profile_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("user_id") ON DELETE no action ON UPDATE no action;
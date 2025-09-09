CREATE TABLE "call" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"created_by" text NOT NULL,
	"type" text NOT NULL,
	"started_at" timestamp,
	"ended_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "call" ADD CONSTRAINT "call_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call" ADD CONSTRAINT "call_created_by_profile_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("user_id") ON DELETE no action ON UPDATE no action;
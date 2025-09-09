CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"type" text NOT NULL,
	"text" text,
	"media_url" text,
	"duration_ms" integer,
	"reply_to_message_id" text,
	"quoted_text" text,
	"quoted_sender_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_profile_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profile"("user_id") ON DELETE no action ON UPDATE no action;
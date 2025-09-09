CREATE TABLE "receipt" (
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"delivered_at" timestamp,
	"read_at" timestamp,
	CONSTRAINT "receipt_message_id_user_id_pk" PRIMARY KEY("message_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_user_id_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON DELETE no action ON UPDATE no action;
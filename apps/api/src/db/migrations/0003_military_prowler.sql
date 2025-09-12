ALTER TABLE "lesson_plans" DROP CONSTRAINT "lesson_plans_teacher_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson_plans" ALTER COLUMN "child_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson_plans" ADD CONSTRAINT "lesson_plans_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE no action ON UPDATE no action;
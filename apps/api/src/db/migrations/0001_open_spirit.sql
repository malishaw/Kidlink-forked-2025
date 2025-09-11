ALTER TABLE "classes" DROP CONSTRAINT "classes_nursery_id_nurseries_id_fk";
--> statement-breakpoint
ALTER TABLE "classes" DROP CONSTRAINT "classes_main_teacher_id_teacher_id_fk";
--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "teacher_ids" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "teacher_ids" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "child_ids" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "child_ids" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_nursery_id_nurseries_id_fk" FOREIGN KEY ("nursery_id") REFERENCES "public"."nurseries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_main_teacher_id_teacher_id_fk" FOREIGN KEY ("main_teacher_id") REFERENCES "public"."teacher"("id") ON DELETE cascade ON UPDATE no action;
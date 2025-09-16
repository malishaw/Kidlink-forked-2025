ALTER TABLE "childrens" ALTER COLUMN "badge_id" SET DATA TYPE text[] USING CASE
  WHEN "badge_id" IS NULL THEN NULL
  ELSE ARRAY["badge_id"]::text[]
END; USING "badge_id"::text[];

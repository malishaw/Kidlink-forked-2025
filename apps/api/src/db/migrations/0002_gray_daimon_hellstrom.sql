CREATE TYPE "public"."hotel_status" AS ENUM('active', 'inactive', 'under_maintenance', 'pending_approval');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('available', 'occupied', 'maintenance', 'out_of_order', 'dirty');--> statement-breakpoint
CREATE TYPE "public"."view_type" AS ENUM('ocean', 'city', 'garden', 'mountain', 'pool', 'courtyard', 'street', 'interior');--> statement-breakpoint
CREATE TABLE "hotel_amenities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"amenity_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"room_type_id" text,
	"image_url" text NOT NULL,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_thumbnail" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotel_policies" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"policy_type" varchar(100) NOT NULL,
	"policy_text" text NOT NULL,
	"effective_date" date DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100),
	"thumbnail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"created_by" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"brand_name" varchar(255),
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(500),
	"hotel_type" text,
	"star_rating" integer DEFAULT 0,
	"property_class" text,
	"check_in_time" varchar(5) DEFAULT '15:00',
	"check_out_time" varchar(5) DEFAULT '11:00',
	"hotel_policies" jsonb,
	"status" "hotel_status" DEFAULT 'pending_approval' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_classes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100),
	"thumbnail" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_type_amenities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" text NOT NULL,
	"amenity_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "room_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"base_occupancy" integer DEFAULT 2 NOT NULL,
	"max_occupancy" integer DEFAULT 2 NOT NULL,
	"extra_bed_capacity" integer DEFAULT 0,
	"bed_configuration" jsonb,
	"room_size_sqm" numeric(6, 2),
	"view_type" "view_type",
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" text NOT NULL,
	"room_type_id" text NOT NULL,
	"room_number" varchar(20) NOT NULL,
	"floor_number" integer,
	"is_accessible" boolean DEFAULT false,
	"status" "room_status" DEFAULT 'available' NOT NULL,
	"last_cleaned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hotel_amenities" ADD CONSTRAINT "hotel_amenities_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_hotel_type_hotel_types_id_fk" FOREIGN KEY ("hotel_type") REFERENCES "public"."hotel_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_property_class_property_classes_id_fk" FOREIGN KEY ("property_class") REFERENCES "public"."property_classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hotel_amenities_hotel_idx" ON "hotel_amenities" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_amenities_type_idx" ON "hotel_amenities" USING btree ("amenity_type");--> statement-breakpoint
CREATE INDEX "hotel_images_hotel_idx" ON "hotel_images" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_images_room_type_idx" ON "hotel_images" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "hotel_images_display_order_idx" ON "hotel_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "hotel_policies_hotel_idx" ON "hotel_policies" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotel_policies_type_idx" ON "hotel_policies" USING btree ("policy_type");--> statement-breakpoint
CREATE INDEX "hotels_city_idx" ON "hotels" USING btree ("city");--> statement-breakpoint
CREATE INDEX "hotels_location_idx" ON "hotels" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "hotels_status_idx" ON "hotels" USING btree ("status");--> statement-breakpoint
CREATE INDEX "room_type_amenities_room_type_idx" ON "room_type_amenities" USING btree ("room_type_id");--> statement-breakpoint
CREATE INDEX "room_types_hotel_idx" ON "room_types" USING btree ("hotel_id");--> statement-breakpoint
CREATE INDEX "rooms_hotel_idx" ON "rooms" USING btree ("hotel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rooms_hotel_room_number_idx" ON "rooms" USING btree ("hotel_id","room_number");--> statement-breakpoint
CREATE INDEX "rooms_status_idx" ON "rooms" USING btree ("status");
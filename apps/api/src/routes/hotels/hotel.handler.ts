/* eslint-disable prefer-const */
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { toKebabCase } from "@api/lib/helpers";
import { hotels, hotelTypes, member } from "@repo/database";
import { PropertyClass } from "../property-classes/property-classes.schema";
import type {
  CreateHotelTypeRoute,
  CreateNewHotelRoute,
  GetMyHotelRoute,
  ListAllHotelsRoute,
  ListHotelTypesRoute,
  RemoveHotelTypeRoute,
  UpdateHotelTypeRoute
} from "./hotel.routes";
import { HotelSelectType, HotelType } from "./hotel.schema";

/**
 * ================================================================
 * Hotel Types Handlers
 * ================================================================
 */
// List hotel types route handler
export const listHotelTypesHandler: AppRouteHandler<
  ListHotelTypesRoute
> = async (c) => {
  const allHotelTypes = await db.query.hotelTypes.findMany({});

  return c.json(allHotelTypes, HttpStatusCodes.OK);
};

// Create hotel type route handler
export const createHotelTypeHandler: AppRouteHandler<
  CreateHotelTypeRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotelTypes)
    .values({ ...body, slug: toKebabCase(body.name) })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Could not create hotel type"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update hotel type route handler
export const updateHotelTypeHandler: AppRouteHandler<
  UpdateHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(hotelTypes)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Hotel type does not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete hotel type Handler
export const removeHotelTypeHandler: AppRouteHandler<
  RemoveHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [deleted] = await db
    .delete(hotelTypes)
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!deleted) {
    return c.json(
      { message: "Hotel type does not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Hotel type deleted successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * ================================================================
 * Hotel Handlers
 * ================================================================
 */

// List all hotels route handler
export const listAllHotelsHandler: AppRouteHandler<ListAllHotelsRoute> = async (
  c
) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    hotelType,
    propertyClass
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.hotels.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      if (hotelType) {
        conditions.push(eq(fields.hotelType, hotelType));
      }

      if (propertyClass) {
        conditions.push(eq(fields.propertyClass, propertyClass));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    },
    with: {
      images: true,
      amenities: true,
      roomTypes: true,
      policies: true,
      hotelType: true,
      propertyClass: true
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(hotels)
    .where(() => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(hotels.name, `%${search}%`));
      }

      // Add hotel type condition if provided
      if (hotelType) {
        conditions.push(eq(hotels.hotelType, hotelType));
      }

      // Add property class condition if provided
      if (propertyClass) {
        conditions.push(eq(hotels.propertyClass, propertyClass));
      }

      return conditions.length ? and(...conditions) : undefined;
    });

  const [hotelEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  const formatted = hotelEntries.map((hotel) => {
    let currentHotel: HotelSelectType = hotel as HotelSelectType;
    let currentHotel_HotelType: HotelType | null;
    let currentHitel_PropertyClass: PropertyClass | null;

    currentHotel_HotelType = hotel.hotelType
      ? {
          id: hotel.hotelType.id,
          name: hotel.hotelType.name,
          slug: hotel.hotelType.slug,
          thumbnail: hotel.hotelType.thumbnail,
          createdAt: new Date(hotel.hotelType.createdAt),
          updatedAt: hotel.hotelType.updatedAt
            ? new Date(hotel.hotelType.updatedAt)
            : null
        }
      : null;

    currentHitel_PropertyClass = hotel.propertyClass
      ? {
          id: hotel.propertyClass.id,
          name: hotel.propertyClass.name,
          slug: hotel.propertyClass.slug,
          thumbnail: hotel.propertyClass.thumbnail,
          createdAt: new Date(hotel.propertyClass.createdAt),
          updatedAt: hotel.propertyClass.updatedAt
            ? new Date(hotel.propertyClass.updatedAt)
            : null
        }
      : null;

    currentHotel.hotelType = currentHotel_HotelType!;
    currentHotel.propertyClass = currentHitel_PropertyClass!;

    return currentHotel;
  });

  return c.json(
    {
      data: formatted,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

// Create new hotel route handler
export const createNewHotelHandler: AppRouteHandler<
  CreateNewHotelRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role === "user" && !session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check user id exists as member in member table
  const userOrg = await db
    .select()
    .from(member)
    .where(() => {
      const conditions = [];
      conditions.push(eq(member.userId, user.id));
      conditions.push(eq(member.organizationId, session.activeOrganizationId!));

      return conditions.length ? and(...conditions) : undefined;
    });

  let organizationUser = userOrg[0];

  if (organizationUser?.role === "member") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotels)
    .values({
      ...body,
      organizationId: session.activeOrganizationId!,
      createdBy: user.id
    })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get my hotel route handler
export const getMyHotelHandler: AppRouteHandler<GetMyHotelRoute> = async (
  c
) => {
  const session = c.get("session");
  const user = c.get("user");
  let activeOrganizationId = session?.activeOrganizationId;

  if (!session || !user)
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );

  if (user.role === "user" && !activeOrganizationId) {
    // Check is this user a member of any organization
    const organizationMember = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id)
    });

    if (!organizationMember) {
      return c.json(
        {
          message: HttpStatusPhrases.FORBIDDEN
        },
        HttpStatusCodes.FORBIDDEN
      );
    }

    if (organizationMember.role === "member") {
      return c.json(
        {
          message: HttpStatusPhrases.FORBIDDEN
        },
        HttpStatusCodes.FORBIDDEN
      );
    }

    activeOrganizationId = organizationMember.organizationId;
  }

  const myHotel = await db.query.hotels.findFirst({
    where: (fields, { eq }) => eq(fields.organizationId, activeOrganizationId!),
    with: {
      hotelType: true,
      propertyClass: true
    }
  });

  if (!myHotel) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const formattedHotel: HotelSelectType = myHotel as HotelSelectType;

  return c.json(formattedHotel, HttpStatusCodes.OK);
};

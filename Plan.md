iamVihanga: Read whole overview for my this project first.

Then suggest and optimize that business idea in standard way.

Then give me next steps that I should follow.

GitHub Copilot: # Analysis of Shareville Business Idea

I've reviewed the overview of your Shareville project. Let me provide an assessment of the business idea and suggest optimizations, followed by recommended next steps.

## Business Idea Overview

Shareville aims to provide a social media integration SDK that allows websites to enable social media sharing capabilities for their users without having to build this functionality themselves. The initial focus is on Facebook integration, allowing users to share content (like AI-generated images) to their Facebook pages or profiles, either immediately or through scheduled posts.

## Optimized Business Approach

### Strengths of the Current Approach

- Leveraging a modern tech stack (Turborepo, Next.js, Hono, Drizzle ORM)
- Using a microservices architecture that separates concerns
- Planning to offer a simple SDK integration for clients
- Clear use case with the AI image generator example

### Suggested Optimizations

1. **Expand Social Media Coverage**:

   - Phase in support for other platforms like Instagram, Twitter/X, LinkedIn, Pinterest, etc.
   - Create a unified interface across all platforms for consistent developer experience

2. **Authentication Flow Enhancement**:

   - Consider implementing a "Shareville Connect" button that handles all social connections through one interface
   - Store user social connections on your backend to reduce repeated authentication requests

3. **Analytics Integration**:

   - Provide engagement analytics for posts shared through your platform
   - Give customers insights into which content performs best across platforms

4. **Content Optimization Features**:

   - Add AI-assisted caption generation for different platforms
   - Offer image formatting/resizing for optimal display on each platform

5. **Monetization Strategy**:

   - Tiered pricing based on volume of shares/posts or features accessed
   - Free tier with limited monthly shares to boost adoption
   - Premium features like advanced analytics, higher posting volumes, and more platforms

6. **Legal/Privacy Considerations**:

   - Develop clear policies on data handling
   - Build GDPR/CCPA compliance into the SDK from the start

7. **Competition Differentiation**:
   - Research competing solutions like Buffer, Hootsuite, etc.
   - Emphasize developer-friendliness and seamless integration as key differentiators

## Next Steps

1. **MVP Development** (1-2 months):

   - Create the `sdk` package in your monorepo
   - Implement the basic Facebook authentication flow
   - Build the minimal sharing UI for immediate posting
   - Develop the server-side endpoints needed for auth and posting

2. **Documentation** (Concurrent with development):

   - Write clear developer documentation for SDK usage
   - Create examples for popular frameworks (React, Vue, etc.)
   - Document authentication requirements and API reference

3. **Testing** (1 month):

   - Develop end-to-end tests for the sharing flow
   - Create a test harness website that implements your SDK
   - Validate cross-browser compatibility

4. **Initial Release** (After MVP):

   - Create an NPM package with appropriate versioning
   - Publish documentation website
   - Develop a simple landing page explaining the product

5. **Early Adoption Program** (1-2 months):

   - Identify 3-5 potential customers for beta testing
   - Offer free or discounted integration support
   - Collect feedback and iterate on the product

6. **Expansion** (3+ months):

   - Implement scheduled posting features
   - Add support for additional social platforms
   - Develop analytics dashboard for client websites

7. **Marketing & Growth** (Ongoing):

   - Create tutorial content for implementation
   - Reach out to development communities
   - Consider partnerships with platforms that could use your solution

8. **Technical Implementation Priorities**:
   - Build a secure OAuth flow for Facebook integration
   - Develop the popup UI for content sharing
   - Create storage for scheduled posts
   - Implement the posting queue with BullMQ
   - Build SDK methods that are simple to integrate

By focusing on delivering a smooth developer experience with clear documentation and a robust initial implementation for Facebook, you can establish Shareville as a valuable tool that saves development time while providing enhanced social sharing capabilities.

iamVihanga: Okay, For now I would prefer go with basic MVP Development only within, "Facebook and Instragram" social medias only. For now don't need analytics integrations, content optimization etc.

So first, setup me database schema, backend project structure, authentication flow that I should follow,

Here within this chat, I have attached

- Database instance / client,
- Authentication Schema (Generated via better-auth cli)
- Better-auth auth instance
- Basic backend project files for get a breif idea
- Example crud written in specific way to end-to-end typesafety

This is better-auth guide:
https://www.better-auth.com/docs
https://www.better-auth.com/docs/authentication/facebook
https://www.better-auth.com/docs/plugins/api-key

\*\* Important: In files just like tasks.route.ts , index.routes.ts I will define authMiddleware for use session & user data inside handler functions. currently they are not implemented yet.

Instructions:
Give me the each module modules with drizzle schemas that I should implemented.
for now, You dont need to write any funtionalities for routes / handlers files. Just give me the instructions step by step how I should implement those

GitHub Copilot: # Shareville MVP Development Plan

Based on your requirements for an MVP focusing on Facebook and Instagram integrations, I'll outline the database schemas and project structure you should implement. I'll provide step-by-step instructions without writing complete handler functions.

## Database Schema Modules

Let's start with the essential database schemas you'll need for your Shareville platform:

### 1. Social Provider Schema

First, you need a schema to manage social media provider configuration:

```typescript
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "@/db/column.helpers";
import { user } from "./auth.schema";

export const socialProvider = pgTable("social_provider", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Reference to the user who owns this provider connection
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Provider type (facebook, instagram)
  provider: text("provider").notNull(),
  // Provider specific data (stored as JSON string)
  providerAccountId: text("provider_account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  // To check if the connection is active
  active: boolean("active").default(true),
  ...timestamps
});

// Social media pages the user has access to (Facebook pages, Instagram business accounts)
export const socialPage = pgTable("social_page", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Reference to the provider
  providerId: uuid("provider_id").references(() => socialProvider.id, {
    onDelete: "cascade"
  }),
  // Page details
  pageId: text("page_id").notNull(),
  name: text("name").notNull(),
  accessToken: text("access_token"),
  // Category of the page (business, personal, etc.)
  category: text("category"),
  // Picture URL of the page
  picture: text("picture"),
  ...timestamps
});

export const selectSocialProviderSchema = createSelectSchema(socialProvider);
export const insertSocialProviderSchema = createInsertSchema(socialProvider);
export const updateSocialProviderSchema = insertSocialProviderSchema.partial();

export const selectSocialPageSchema = createSelectSchema(socialPage);
export const insertSocialPageSchema = createInsertSchema(socialPage);
export const updateSocialPageSchema = insertSocialPageSchema.partial();
```

### 2. Posts Schema

To manage social media posts (both immediate and scheduled):

```typescript
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "@/db/column.helpers";
import { user } from "./auth.schema";
import { socialPage } from "./social-provider.schema";

export enum PostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed"
}

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Reference to user who created this post
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Reference to the social page this post is for
  socialPageId: uuid("social_page_id").references(() => socialPage.id, {
    onDelete: "cascade"
  }),
  // Content of the post
  caption: text("caption"),
  // Media URLs (could be multiple for carousel posts)
  mediaUrls: jsonb("media_urls").$type<string[]>(),
  // Schedule information
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  // Meta data returned from social platform after publishing
  platformPostId: text("platform_post_id"),
  platformPostUrl: text("platform_post_url"),
  // Status tracking
  status: text("status")
    .$type<PostStatus>()
    .notNull()
    .default(PostStatus.DRAFT),
  // Error information if posting failed
  errorMessage: text("error_message"),
  ...timestamps
});

// API keys from clients who integrate Shareville
export const clientApp = pgTable("client_app", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  // Reference to the user who owns this app
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // App credentials for Facebook API
  facebookAppId: text("facebook_app_id"),
  facebookAppSecret: text("facebook_app_secret"),
  // App credentials for Instagram API
  instagramAppId: text("instagram_app_id"),
  instagramAppSecret: text("instagram_app_secret"),
  // Connection between this client app and the post
  webhookUrl: text("webhook_url"),
  // API key reference for the client
  apiKeyId: text("api_key_id").references(() => user.id),
  active: boolean("active").default(true),
  ...timestamps
});

export const selectPostSchema = createSelectSchema(post);
export const insertPostSchema = createInsertSchema(post);
export const updatePostSchema = insertPostSchema.partial();

export const selectClientAppSchema = createSelectSchema(clientApp);
export const insertClientAppSchema = createInsertSchema(clientApp);
export const updateClientAppSchema = insertClientAppSchema.partial();
```

### 3. Update the main schema index file

Don't forget to update your main schema index file:

```typescript
export * from "@/db/schema/auth.schema";
export * from "@/routes/tasks/tasks.schema";
export * from "@/db/schema/social-provider.schema";
export * from "@/db/schema/post.schema";
```

## Project Structure - Routes and Handlers

Now let's define the route structure for your application:

### 1. Social Provider Routes

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import {
  insertSocialProviderSchema,
  selectSocialProviderSchema,
  updateSocialProviderSchema
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import { requireAuth } from "@/middlewares/auth";

const tags: string[] = ["Social Providers"];

// List providers route definition
export const list = createRoute({
  tags,
  summary: "List all social providers for the current user",
  path: "/social/providers",
  method: "get",
  security: [{ BearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSocialProviderSchema),
      "List of social providers"
    )
  }
});

// Connect Facebook provider
export const connectFacebook = createRoute({
  tags,
  summary: "Connect Facebook account",
  path: "/social/providers/facebook/connect",
  method: "get",
  security: [{ BearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ url: z.string() }),
      "Facebook OAuth URL"
    )
  }
});

// Facebook callback handler
export const facebookCallback = createRoute({
  tags,
  summary: "Handle Facebook OAuth callback",
  path: "/social/providers/facebook/callback",
  method: "get",
  request: {
    query: z.object({
      code: z.string(),
      state: z.string().optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSocialProviderSchema,
      "Connected Facebook provider"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(notFoundSchema, "OAuth error")
  }
});

// Similar routes for Instagram...
export const connectInstagram = createRoute({
  tags,
  summary: "Connect Instagram account",
  path: "/social/providers/instagram/connect",
  method: "get",
  security: [{ BearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ url: z.string() }),
      "Instagram OAuth URL"
    )
  }
});

// Pages related routes
export const listPages = createRoute({
  tags,
  summary: "List all pages for a social provider",
  path: "/social/providers/{providerId}/pages",
  method: "get",
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      providerId: z.string().uuid()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSocialProviderSchema),
      "List of social pages"
    )
  }
});

// Export types
export type ListProvidersRoute = typeof list;
export type ConnectFacebookRoute = typeof connectFacebook;
export type FacebookCallbackRoute = typeof facebookCallback;
export type ConnectInstagramRoute = typeof connectInstagram;
export type ListPagesRoute = typeof listPages;
```

### 2. Posts Routes

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import {
  insertPostSchema,
  selectPostSchema,
  updatePostSchema
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";

const tags: string[] = ["Posts"];

// List posts route
export const list = createRoute({
  tags,
  summary: "List all posts",
  path: "/posts",
  method: "get",
  security: [{ BearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectPostSchema),
      "The list of posts"
    )
  }
});

// Create post route
export const create = createRoute({
  tags,
  summary: "Create a new post",
  path: "/posts",
  method: "post",
  security: [{ BearerAuth: [] }],
  request: {
    body: jsonContentRequired(insertPostSchema, "The post to create")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPostSchema,
      "The created post"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertPostSchema),
      "The validation error(s)"
    )
  }
});

// Schedule post route
export const schedule = createRoute({
  tags,
  summary: "Schedule a post",
  path: "/posts/{id}/schedule",
  method: "post",
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid()
    }),
    body: jsonContentRequired(
      z.object({
        scheduledAt: z.string().datetime()
      }),
      "Scheduling information"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "The scheduled post"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found")
  }
});

// Publish now route
export const publish = createRoute({
  tags,
  summary: "Publish a post immediately",
  path: "/posts/{id}/publish",
  method: "post",
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "The published post"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found")
  }
});

// Export types
export type ListPostsRoute = typeof list;
export type CreatePostRoute = typeof create;
export type SchedulePostRoute = typeof schedule;
export type PublishPostRoute = typeof publish;
```

### 3. Client App Routes

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import {
  insertClientAppSchema,
  selectClientAppSchema,
  updateClientAppSchema
} from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";

const tags: string[] = ["Client Apps"];

// List client apps
export const list = createRoute({
  tags,
  summary: "List all client apps",
  path: "/client-apps",
  method: "get",
  security: [{ BearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectClientAppSchema),
      "The list of client apps"
    )
  }
});

// Create client app
export const create = createRoute({
  tags,
  summary: "Create a new client app",
  path: "/client-apps",
  method: "post",
  security: [{ BearerAuth: [] }],
  request: {
    body: jsonContentRequired(insertClientAppSchema, "The client app to create")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectClientAppSchema,
      "The created client app"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertClientAppSchema),
      "The validation error(s)"
    )
  }
});

// Generate API key
export const generateApiKey = createRoute({
  tags,
  summary: "Generate API key for a client app",
  path: "/client-apps/{id}/api-key",
  method: "post",
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        apiKeyId: z.string(),
        apiKey: z.string()
      }),
      "Generated API key"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Client app not found"
    )
  }
});

// Export types
export type ListClientAppsRoute = typeof list;
export type CreateClientAppRoute = typeof create;
export type GenerateApiKeyRoute = typeof generateApiKey;
```

### 4. Auth Middleware

Create an auth middleware to protect your routes:

```typescript
import { Context, Next } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/types";

export async function requireAuth(c: Context<AppBindings>, next: Next) {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  await next();
}

export async function requireApiKey(c: Context<AppBindings>, next: Next) {
  // Extract API key from header
  const apiKey = c.req.header("X-API-KEY");

  if (!apiKey) {
    return c.json(
      { message: "API key is required" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Validate API key (implementation depends on your auth system)
  // This would typically involve checking against your apikey table

  await next();
}
```

## Implementation Steps

Now, let me outline the step-by-step implementation process:

### Step 1: Set up Social Media Authentication

1. **Update your auth.ts file to enable Facebook and Instagram providers**:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, apiKey, openAPI } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import env from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      scope: [
        "public_profile",
        "email",
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts"
      ]
      // This is the internal authentication, not what clients will use
    }
  },
  plugins: [adminPlugin(), openAPI(), apiKey()]
});

export type Session = typeof auth.$Infer.Session;
```

2. **Create migration for your new schema**:

   ```
   bunx drizzle-kit generate
   ```

3. **Apply the migrations to your database**:
   ```
   bunx drizzle-kit migrate
   ```

### Step 2: Implement Social Providers Module

1. Create the handlers file for social providers:

```typescript
import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { socialProvider, socialPage } from "@/db/schema";
import { FacebookService } from "@/services/facebook.service";

import type {
  ConnectFacebookRoute,
  FacebookCallbackRoute,
  ListPagesRoute,
  ListProvidersRoute
} from "./providers.routes";

// Implement your handler functions here
// Example structure:

export const list: AppRouteHandler<ListProvidersRoute> = async (c) => {
  const user = c.get("user");

  // Fetch providers for this user
  // Return the providers list
};

export const connectFacebook: AppRouteHandler<ConnectFacebookRoute> = async (
  c
) => {
  // Generate OAuth URL for Facebook
  // Return the URL for the frontend to redirect
};

export const facebookCallback: AppRouteHandler<FacebookCallbackRoute> = async (
  c
) => {
  // Handle the OAuth callback
  // Exchange authorization code for access token
  // Store the provider in the database
  // Return success response
};

export const listPages: AppRouteHandler<ListPagesRoute> = async (c) => {
  // Fetch pages for a specific provider
  // Return the pages list
};
```

2. Create a service to handle Facebook API interactions:

```typescript
// This is where you'll implement methods to interact with Facebook Graph API
export class FacebookService {
  // Methods to implement:
  // - exchangeCodeForToken
  // - getUserInfo
  // - getPages
  // - createPost
  // etc.
}
```

### Step 3: Implement Posts Module

1. Create the handlers for posts routes:

```typescript
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { post, PostStatus } from "@/db/schema";
import { PostService } from "@/services/post.service";

import type {
  CreatePostRoute,
  ListPostsRoute,
  PublishPostRoute,
  SchedulePostRoute
} from "./posts.routes";

// Implement handler functions for posts
```

2. Create a post service for publishing logic:

```typescript
import { FacebookService } from "./facebook.service";
import { InstagramService } from "./instagram.service";

export class PostService {
  private facebookService: FacebookService;
  private instagramService: InstagramService;

  constructor() {
    this.facebookService = new FacebookService();
    this.instagramService = new InstagramService();
  }

  // Methods to implement:
  // - schedulePost
  // - publishPost
  // - handleScheduledPosts (for a worker process)
}
```

### Step 4: Implement Client App Module

Create handlers for client app routes:

```typescript
// Implement handler functions for client app management
```

### Step 5: Update the API Router

Update your main router to include the new routes:

```typescript
import { createRouter } from "@/lib/create-app";
import { AppOpenAPI } from "@/types";

import { BASE_PATH } from "../lib/constants";
import index from "./index.route";
import tasks from "./tasks/tasks.index";
import socialProviders from "./social/providers/providers.index";
import posts from "./posts/posts.index";
import clientApps from "./client-apps/client-apps.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/", tasks)
    .route("/", socialProviders)
    .route("/", posts)
    .route("/", clientApps);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
```

### Step 6: Setup SDK Package Structure

For your SDK package, create a basic structure:

```
/packages/sdk
├── package.json
├── tsconfig.json
├── src
│   ├── index.ts
│   ├── client.ts
│   ├── types.ts
│   └── widgets
│       ├── FacebookShareModal.tsx
│       └── InstagramShareModal.tsx
```

The SDK should:

1. Provide methods to initialize with API key
2. Handle authentication flows
3. Offer components/widgets for social sharing
4. Expose methods to schedule/publish posts

## Next Steps for Development

1. **Create the database tables**:

   - Run migrations to set up your schemas

2. **Implement Facebook authentication**:

   - Implement the OAuth flow for connecting Facebook accounts
   - Store tokens securely
   - Fetch and store page access tokens

3. **Implement the post creation and publishing logic**:

   - Build the service to create and publish posts to Facebook
   - Implement scheduling logic using a worker process with BullMQ

4. **Create the SDK package**:

   - Build a simple client for API interactions
   - Create UI components for the sharing popup
   - Implement the OAuth redirect flow in the SDK

5. **Test the entire flow**:
   - Test user authentication
   - Test connecting Facebook accounts
   - Test posting to Facebook pages
   - Test scheduling posts

By starting with this structure, you'll have a solid foundation for your Shareville tool MVP focusing on Facebook integration. The modular approach allows you to expand to other social platforms like Instagram once the core functionality is working.

iamVihanga: @workspace /explain Explain me, how these following flows should perform with above solutions you gave,

1. How to register a new website owner / website (According to example, Like that image generator website) with API key, their facebook APP ID credentials etc. with our system interating with above API routes,

2. When a user (coming from that particular websites) connects his facebook account with our platform how interact our API with that flow and who those data are saving in our system

Workspace: # Understanding Website and User Onboarding Flows

Based on the codebase you've shared, let me explain how the registration and authentication flows would work in your system:

## 1. Registering a New Website Owner with API Key

The system uses `better-auth` with an API key plugin for website owner registration. Here's how the flow would work:

### Step 1: Website Owner Registration

The website owner would register through your authentication system:

```typescript
// Client-side registration request
const registration = await authClient.auth.emailPassword.register({
  email: "owner@example.com",
  password: "securePassword",
  name: "Website Owner"
});
```

### Step 2: API Key Generation

After registration, the owner would request an API key:

```typescript
// API endpoint for generating API key (to be implemented)
app.post("/api/keys", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ message: "Unauthorized" }, 401);

  // Generate API key for the user
  const apiKey = await auth.apiKey.create({
    userId: user.id,
    name: "My Website Integration",
    // Optional permissions and metadata
    permissions: "website_integration",
    metadata: JSON.stringify({
      domain: "example.com",
      facebookAppId: "FB_APP_ID_HERE"
    })
  });

  return c.json(apiKey);
});
```

The `apikey` table in your schema (from auth.schema.ts) would store these keys:

```typescript
export const apikey = pgTable("apikey", {
  id: text("id").primaryKey(),
  name: text("name"),
  key: text("key").notNull(),
  userId: text("user_id").notNull()
  // Other fields for rate limiting, permissions, etc.
});
```

### Step 3: Storing Facebook Credentials

You'd need to add a table to store Facebook App credentials associated with the website owner:

```typescript
// Add to schema file
export const websiteIntegration = pgTable("website_integration", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  domain: text("domain").notNull(),
  facebookAppId: text("facebook_app_id"),
  facebookAppSecret: text("facebook_app_secret"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
```

## 2. User Authentication from Partner Websites

When a user from a partner website connects their Facebook account:

### Step 1: Integration with Partner Website

The partner website would include your SDK with their API key:

```javascript
// On partner website
const sharevilleConnect = new SharevilleConnect({
  apiKey: "PARTNER_API_KEY",
  redirectUri: "https://partner-site.com/auth/callback"
});

// Button to connect with Facebook
connectButton.addEventListener("click", () => {
  sharevilleConnect.connectWithFacebook();
});
```

### Step 2: Authentication Flow

Your system would:

1. Validate the API key to identify the partner website
2. Use the associated Facebook App credentials for the OAuth flow
3. Handle the OAuth redirect and token exchange

```typescript
// On your backend
app.get("/api/auth/facebook/connect", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) return c.json({ message: "Missing API key" }, 401);

  // Verify API key and get associated website integration
  const keyInfo = await auth.apiKey.verify(apiKey);
  if (!keyInfo) return c.json({ message: "Invalid API key" }, 401);

  // Get website integration details including Facebook App ID
  const integration = await db.query.websiteIntegration.findFirst({
    where: eq(websiteIntegration.userId, keyInfo.userId)
  });

  if (!integration) return c.json({ message: "Configuration not found" }, 404);

  // Initialize OAuth flow with the website's Facebook App ID
  const authUrl = `https://facebook.com/dialog/oauth?client_id=${integration.facebookAppId}&redirect_uri=${c.req.query("redirect_uri")}&scope=email`;

  return c.json({ authUrl });
});
```

### Step 3: Storing User Data

After successful authentication, store the user account with a reference to which partner website they came from:

```typescript
// Handle OAuth callback
app.get("/api/auth/facebook/callback", async (c) => {
  const code = c.req.query("code");
  const apiKey = c.req.query("state"); // Pass API key as state

  // Exchange code for tokens using the website's Facebook App credentials
  const tokenResponse = await exchangeFacebookToken(code, apiKey);

  // Get user profile from Facebook
  const userProfile = await getFacebookProfile(tokenResponse.access_token);

  // Create or link account
  const account = await auth.account.create({
    providerId: "facebook",
    accountId: userProfile.id,
    // Link to referring website's integration
    metadata: JSON.stringify({
      source: apiKey
      // other relevant data
    })
  });

  // Create session if needed
  const session = await auth.session.create({ userId: account.userId });

  return c.json({ success: true });
});
```

The account and session data would be stored in the tables defined in auth.schema.ts:

```typescript
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token")
  // Other fields
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull()
  // Other session data
});
```

## Implementation Recommendations

1. Create specific API endpoints for partner website registration and API key management
2. Add proper validation and security measures for all auth-related flows
3. Implement webhook notifications so partner websites receive updates on user status
4. Consider adding scopes to API keys to limit what operations partner websites can perform
5. Implement proper error handling and logging throughout the authentication flows

This implementation leverages your existing `better-auth` system with the API key plugin while adding the necessary infrastructure for multi-tenant authentication flows.

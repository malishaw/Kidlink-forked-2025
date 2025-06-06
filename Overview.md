Im building a tool called "shareville" that allows integrate with websites and enable features for users to manage their social media content posting.

- Main Requirement: Shareville tool offers an SDK via NPM package library that can installed on current website projects such as reactjs / nextjs etc. Using that SDK and API key that particular websites can integrate our tool with their website.

- Sample Use Case Scenario: Imagine there is a SAAS website that generates AI Images. Users can see all images they generated from a gallery section in that website. But until they integrates shareville tool, they don't have feature to share those images to their facebook pages.
  Now, Imagine they (AI Image generating website owners) integrated shareville tool via SDK. Then they can access share to facebook pages functionality from our sdk.
  After they implemented a share button for images with our shareville sdk functionalities, whenever users clicked the share button, its openning a popup window (just like in google OAuth window) with shareville UI.
  In that window initially, there is a button called "Connect Facebook" to connect user's facebook account with our shareville system - At the first time. (Basically this performs a Facebook OAuth login)

After user connects his facebook account once, user should see a UI for select facebook page and go ahead,
When facebook page selected, its navigate to another ui that allows to create a facebook post with a caption and selected image earlier. (That image should be uploaded to this facebook post user will creates)
And user should have two options to "Post Instantly" & "Schedule Post".

Whenever a post schedulled, user can see a list of scheduled posts from AI Image generator website's settings page or whatever page they will create for it. This list of scheduled post should be fetched from our SDK's API.

- So this is the Overoll flow that user engaging.

* Technical Overview:

- I already have created a turborepo monorepo setup with these apps and packages

Sample folder structure looks like this

Turporepo Root

- apps
  -- api (Bun + HonoJS Backend API)
  -- web (NextJS Frontend Project for Admin view or anyother feature)
- packages
  -- rpc-client (HonoJS RPC for End-to-End TypeSafe API Requests)
  -- eslint-config
  -- typescript-config
  -- ui (shared shadcn UI package)
  -- sdk (Didn't have created yet. This package should use as SDK project that will publish to NPM)

* Technical In-deep overview.

- API Project: This uses PostgreSQL as Database with Drizzle ORM. and Im using typesafe api handlers using Zod with drizzle database schemas. There is a Scalar OpenAPI documentation.

- Authentication: Using better-auth for handle authentication for both backend and frontend projects.

Frontend Widget: NextJS with React + TypeScript + Tailwind + Shadcn
Backend API: BunJS + HonoJS Framework + Drizzle ORM
Database: PostgreSQL + Redis
Queue: BullMQ + Redis
Auth: Better-Auth
Hosting: My own VPS Server

These are my prefered tech stacks

- More details:

* As shareville, We dont make our own Facebook Apps from Meta Business Suite / Developer Platform. Our client's (as example above, AI Image generate website) should make their own Facebook APP and they should provide Facebook App ID and any other credentials via SDK. We are performing Facebook API actions using those credentials.

import createApp from "@api/lib/create-app";
import configureOpenAPI from "@api/lib/open-api-config";
import { setServer, websocket } from "@api/lib/websocket-setup";
import { registerRoutes } from "@api/routes/registry";

import env from "./env";

const app = registerRoutes(createApp());

configureOpenAPI(app);

export type AppType = typeof app;

// Start the server with Bun.serve to support WebSocket
const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
  websocket
});

// Set the server instance for WebSocket broadcasting
setServer(server);

console.log(`Server is running on port ${env.PORT}`);

export default app;

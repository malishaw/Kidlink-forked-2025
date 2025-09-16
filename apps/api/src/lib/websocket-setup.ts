import { createBunWebSocket } from "hono/bun";

// Create WebSocket upgrade function and websocket handler
export const { upgradeWebSocket, websocket } = createBunWebSocket();

// Server instance will be set after Bun.serve is called
let serverInstance: any = null;

export const setServer = (server: any) => {
  serverInstance = server;
};

export const getServer = () => {
  if (!serverInstance) {
    throw new Error("Server instance not initialized");
  }
  return serverInstance;
};

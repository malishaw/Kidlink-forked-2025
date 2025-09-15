import { createRouter } from "@api/lib/create-app";

import * as handlers from "./chat.handler";
import * as routes from "./chat.routes";

const router = createRouter()
  // Chat management
  .openapi(routes.listChatsRoute, handlers.listChatsHandler)
  .openapi(routes.getChatRoute, handlers.getChatHandler)
  .openapi(routes.createDirectChatRoute, handlers.createDirectChatHandler)
  .openapi(routes.createGroupChatRoute, handlers.createGroupChatHandler)

  // Messages
  .openapi(routes.getMessagesRoute, handlers.getMessagesHandler)
  .openapi(routes.sendMessageRoute, handlers.sendMessageHandler)

  // Chat room management
  .openapi(routes.joinChatRoute, handlers.joinChatHandler)
  .openapi(routes.leaveChatRoute, handlers.leaveChatHandler)

  // Message management
  .openapi(routes.updateMessageRoute, handlers.updateMessageHandler)
  .openapi(routes.deleteMessageRoute, handlers.deleteMessageHandler);

export default router;

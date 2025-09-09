// user.router.ts
import { createRouter } from "@api/lib/create-app";

import * as handlers from "./user.handlers";
import * as routes from "./user.routes";

const router = createRouter()
  .openapi(routes.updateUser, handlers.updateUser)
  .openapi(routes.list, handlers.list)
  // Register static route before the dynamic '/:id' to avoid collisions with '/count'
  .openapi(routes.count, handlers.count)
  .openapi(routes.getById, handlers.getOne);

export default router;

import { createRouter } from "@api/lib/create-app";

import * as handlers from "./teacher.handlers";
import * as routes from "./teacher.routes";

const router = createRouter()
  .openapi(routes.getByUserId, handlers.getByUserId)
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

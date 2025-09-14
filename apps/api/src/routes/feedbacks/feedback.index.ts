import { createRouter } from "@api/lib/create-app";

import * as handlers from "./feedback.handlers";
import * as routes from "./feedback.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.getByChildId, handlers.getByChildId)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

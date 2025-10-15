import { createRouter } from "@api/lib/create-app";

import * as handlers from "./lessonPlans.handler";
import * as routes from "./lessonPlans.routes";

const router = createRouter()
  .openapi(routes.getByClassId, handlers.getByClassId)
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

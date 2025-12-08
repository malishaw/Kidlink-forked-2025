import { createRouter } from "@api/lib/create-app";

import * as handlers from "./children.handlers";
import * as routes from "./children.routes";

const router = createRouter()
  .openapi(routes.listWithObjects, handlers.listWithObjects)
  .openapi(routes.getByParentId, handlers.getByParentId)

  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

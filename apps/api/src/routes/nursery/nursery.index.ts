import { createRouter } from "@api/lib/create-app";

import * as handlers from "./nursery.handlers";
import * as routes from "./nursery.routes";

const router = createRouter()
  .openapi(routes.getMyNursery, handlers.getMyNursery)
  .openapi(routes.list, handlers.list)

  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

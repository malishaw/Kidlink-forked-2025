import { createRouter } from "@api/lib/create-app";

import * as routes from "./event.routes";
import * as handlers from "./event.handler";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;

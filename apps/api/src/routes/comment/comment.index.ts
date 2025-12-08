import { createRouter } from "@api/lib/create-app";

import * as handlers from "./comment.handlers";
import * as routes from "./comment.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.getByPostId, handlers.getByPostId)
  .openapi(routes.remove, handlers.remove);

export default router;

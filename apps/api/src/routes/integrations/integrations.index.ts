import { createRouter } from "@/lib/create-app";

import * as handlers from "./integrations.handlers";
import * as routes from "./integrations.routes";

const router = createRouter()
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update);

export default router;

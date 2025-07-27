import { createRouter } from "@api/lib/create-app";

import * as handlers from "./system.handlers";
import * as routes from "./system.routes";

const router = createRouter().openapi(
  routes.checkUserType,
  handlers.checkUserTypeHandler
);

export default router;

import { createRouter } from "@/lib/create-app";

import * as handlers from "./integrations.handlers";
import * as routes from "./integrations.routes";

const router = createRouter().openapi(routes.create, handlers.create);

export default router;

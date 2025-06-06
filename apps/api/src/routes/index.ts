import { createRouter } from "@/lib/create-app";
import { AppOpenAPI } from "@/types";

import { BASE_PATH } from "../lib/constants";
import index from "./index.route";
import tasks from "./tasks/tasks.index";
import integrations from "./integrations/integrations.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/integrations", integrations);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;

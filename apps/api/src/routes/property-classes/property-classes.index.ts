import { createRouter } from "@api/lib/create-app";

import * as handlers from "./property-classes.handler";
import * as routes from "./property-classes.routes";

const router = createRouter()
  .openapi(
    routes.listAllPropertyClassesRoute,
    handlers.listPropertyClassesHandler
  )
  .openapi(
    routes.createNewPropertyClassRoute,
    handlers.createPropertyClassHandler
  )
  .openapi(routes.updatePropertyClassRoute, handlers.updatePropertyClassHandler)
  .openapi(
    routes.removePropertyClassRoute,
    handlers.removePropertyClassHandler
  );

export default router;

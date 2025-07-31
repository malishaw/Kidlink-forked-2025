import { createRouter } from "@api/lib/create-app";

import * as handlers from "./hotel.handler";
import * as routes from "./hotel.routes";

const router = createRouter()
  .openapi(routes.listAllHotelTypesRoute, handlers.listHotelTypesHandler)
  .openapi(routes.createNewHotelTypeRoute, handlers.createHotelTypeHandler)
  .openapi(routes.updateHotelTypeRoute, handlers.updateHotelTypeHandler)
  .openapi(routes.removeHotelTypeRoute, handlers.removeHotelTypeHandler);

export default router;

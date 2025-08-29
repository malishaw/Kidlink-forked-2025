import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
import badges from "./badges/badges.index";
import children from "./children/children.index";
import classes from "./classes/classes.index";
import feedbacks from "./feedbacks/feedbacks.index";
import hotels from "./hotels/hotel.index";
import index from "./index.route";
import lessonPlans from "./lessonPlans/lessonPlans.index";
import media from "./media/media.index";
import notifications from "./notifications/notifications.index";
import payments from "./payments/payments.index";
import propertyClasses from "./property-classes/property-classes.index";
import system from "./system/system.index";
import tasks from "./tasks/tasks.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/system", system)
    .route("/media", media)
    .route("/property-classes", propertyClasses)
    .route("/hotels", hotels)
    .route("/children", children)
    .route("/feedbacks", feedbacks)
    .route("/lesson-plans", lessonPlans)
    .route("/classes", classes)
    .route("/notifications", notifications)
    .route("/payments", payments)
    .route("/badges", badges);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;

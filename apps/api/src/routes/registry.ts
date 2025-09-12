import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
import badges from "./badges/badges.index";
import children from "./children/children.index";
import feedbacks from "./feedbacks/feedback.index";
import hotels from "./hotels/hotel.index";
import index from "./index.route";
import lessonPlans from "./lessonPlans/lessonPlans.index";
import media from "./media/media.index";
import notification from "./notification/notification.index";
import nurseryClass from "./nursery-class/nursery-class.index";
import nursery from "./nursery/nursery.index";
import organization from "./organization/organization.index";
import parent from "./parents/parent.index";
import payment from "./payments/payments.index";
import propertyClasses from "./property-classes/property-classes.index";
import system from "./system/system.index";
import tasks from "./tasks/tasks.index";
import teacher from "./teachers/teacher.index";
import user from "./user/user.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/system", system)
    .route("/media", media)
    .route("/property-classes", propertyClasses)
    .route("/notification", notification)
    .route("/user", user)
    .route("/parent", parent)
    .route("/teacher", teacher)
    .route("/payment", payment)

    .route("/hotels", hotels)
    .route("/children", children)
    .route("/nurseries", nursery)
    .route("/feedbacks", feedbacks)
    .route("/badges", badges)
    .route("/organization", organization)
    .route("/lesson-plans", lessonPlans)
    .route("/classes", nurseryClass);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;

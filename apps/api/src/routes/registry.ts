import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
import hotels from "./hotels/hotel.index";
import index from "./index.route";
import media from "./media/media.index";
import profile from "./profile/profile.index";
import propertyClasses from "./property-classes/property-classes.index";
import system from "./system/system.index";
import tasks from "./tasks/tasks.index";
import chats from "./chats/chats.index";
import chatMembers from "./chatMembers/chatMembers.index";
import messages from "./messages/messages.index";
import receipts from "./receipts/receipts.index";
import calls from "./calls/calls.index";


export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/tasks", tasks)
    .route("/system", system)
    .route("/media", media)
    .route("/property-classes", propertyClasses)
    .route("/profile", profile)
    .route("/chats", chats)
    .route("/chatMembers", chatMembers)
    .route("/messages", messages)
    .route("/receipts", receipts)
    .route("/calls", calls);
}


// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;

import { createApp } from "@/server/helpers/create-app";
import { configureOpenAPI } from "@/server/helpers/configure-open-api";

// Routes
import { authController } from "@/modules/authentication/routes";

const app = createApp();

// Configure Open API Documentation
configureOpenAPI(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", authController);
// .route("/", rootRoute)
// .route("/tasks", tasksRoute);

export type AppType = typeof routes;

export default app;

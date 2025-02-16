import { Router } from "express";
import authRoutes from "./authRoutes";
import protectedRoutes from "./protectedRoutes";
import tasksRoutes from "./tasksRoutes";
import userRoutes from "./userRoutes";
import notifRouter from "./notifRoutes";

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/tasks", tasksRoutes);
appRouter.use("/testAuth", protectedRoutes);
appRouter.use("/users", userRoutes);
appRouter.use("/notifications", notifRouter)


export default appRouter;
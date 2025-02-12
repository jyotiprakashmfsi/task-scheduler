import { Router } from "express";
import authRoutes from "./authRoutes";
import protectedRoutes from "./protectedRoutes";
import tasksRoutes from "./tasksRoutes";

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/tasks", tasksRoutes);
appRouter.use("/testAuth", protectedRoutes);

export default appRouter;
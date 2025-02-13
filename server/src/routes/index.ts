import { Router } from "express";
import authRoutes from "./authRoutes";
import protectedRoutes from "./protectedRoutes";
import tasksRoutes from "./tasksRoutes";
import userRoutes from "./userRoutes";

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/tasks", tasksRoutes);
appRouter.use("/testAuth", protectedRoutes);
appRouter.use("/users", userRoutes);


export default appRouter;
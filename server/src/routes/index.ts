import { Router } from "express";
import authRoutes from "./authRoutes";
import protectedRoutes from "./protectedRoutes";

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/testAuth", protectedRoutes);


export default appRouter;
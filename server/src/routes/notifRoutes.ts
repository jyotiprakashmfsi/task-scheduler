import { Router } from "express";
import { checkApproachingTasks, checkOverdueTasks } from "../controller/notification-manager";


const notifRouter = Router();

notifRouter.get('/approaching', checkApproachingTasks);
notifRouter.get('/overdue', checkOverdueTasks);

export default notifRouter;
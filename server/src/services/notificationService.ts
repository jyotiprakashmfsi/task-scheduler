import { sequelize } from "../model/server";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    end_time: Date;
    user_id: number;
}

export class NotificationService {
    async getApproachingTasks(userId: string): Promise<Task[]> {
        const now = new Date();
        const fiveMinsFromNow = new Date(now.getTime() + 5 * 60 * 1000);

        const tasks = await sequelize.query(
            'SELECT * FROM Tasks WHERE status = "pending" AND end_time BETWEEN ? AND ? AND user_id = ?',
            {
                replacements: [now, fiveMinsFromNow, userId],
                type: sequelize.QueryTypes.SELECT
            }
        ) as Task[];

        return tasks;
    }

    async getOverdueTasks(userId: string): Promise<Task[]> {
        const now = new Date();

        const tasks = await sequelize.query(
            'SELECT * FROM Tasks WHERE status = "pending" AND end_time < ? AND user_id = ?',
            {
                replacements: [now, userId],
                type: sequelize.QueryTypes.SELECT
            }
        ) as Task[];

        return tasks;
    }
}

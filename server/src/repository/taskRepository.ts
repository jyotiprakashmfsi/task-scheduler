import { sequelize } from "../model/server";
import { Task, TaskCreateData } from "../types/task";
import { getLocalTimeString } from "../helper/date";

export class TaskRepository {
    async createTask(taskData: TaskCreateData) {
        const mysqlStartTime = getLocalTimeString(new Date(taskData.start_time));
        const mysqlEndTime = getLocalTimeString(new Date(taskData.end_time));
        const currentTime = getLocalTimeString(new Date());

        const [task] = await sequelize.query(
            'INSERT INTO Tasks (task_name, description, status, start_time, end_time, tags, repeat_freq, remind_time, colour, user_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            {
                replacements: [
                    taskData.task_name,
                    taskData.description,
                    taskData.status,
                    mysqlStartTime,
                    mysqlEndTime,
                    taskData.tags,
                    taskData.repeat_freq,
                    taskData.remind_time,
                    taskData.colour,
                    taskData.user_id,
                    currentTime,
                    currentTime
                ],
                type: sequelize.QueryTypes.INSERT
            }
        );
        return task;
    }

    async getTasksByUserId(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const tasks = await sequelize.query(
            'SELECT * FROM Tasks WHERE user_id = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?',
            {
                replacements: [userId, limit, offset],
                type: sequelize.QueryTypes.SELECT
            }
        );
        return tasks;
    }

    async getTaskById(taskId: string) {
        const [task] = await sequelize.query(
            'SELECT * FROM Tasks WHERE id = ?',
            {
                replacements: [taskId],
                type: sequelize.QueryTypes.SELECT
            }
        );
        return task;
    }

    async updateTask(taskId: string, taskData: Partial<TaskCreateData>) {
        const currentTime = getLocalTimeString(new Date());
        const mysqlStartTime = taskData.start_time ? getLocalTimeString(new Date(taskData.start_time)) : undefined;
        const mysqlEndTime = taskData.end_time ? getLocalTimeString(new Date(taskData.end_time)) : undefined;

        const [result] = await sequelize.query(
            'UPDATE Tasks SET task_name = ?, description = ?, status = ?, start_time = ?, end_time = ?, tags = ?, repeat_freq = ?, remind_time = ?, colour = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: [
                    taskData.task_name,
                    taskData.description,
                    taskData.status,
                    mysqlStartTime,
                    mysqlEndTime,
                    taskData.tags,
                    taskData.repeat_freq,
                    taskData.remind_time,
                    taskData.colour,
                    currentTime,
                    taskId
                ],
                type: sequelize.QueryTypes.UPDATE
            }
        );
        return result;
    }

    async deleteTask(taskId: string) {
        await sequelize.query(
            'DELETE FROM Tasks WHERE id = ?',
            {
                replacements: [taskId],
                type: sequelize.QueryTypes.DELETE
            }
        );
    }

    async markTaskDone(taskId: string) {
        const currentTime = getLocalTimeString(new Date());
        await sequelize.query(
            'UPDATE Tasks SET status = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: ['done', currentTime, taskId],
                type: sequelize.QueryTypes.UPDATE
            }
        );
    }

    async unmarkTaskDone(taskId: string) {
        const currentTime = getLocalTimeString(new Date());
        await sequelize.query(
            'UPDATE Tasks SET status = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: ['pending', currentTime, taskId],
                type: sequelize.QueryTypes.UPDATE
            }
        );
    }
}

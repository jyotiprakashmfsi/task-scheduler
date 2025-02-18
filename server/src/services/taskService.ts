import { sequelize } from "../model/server";
import { getLocalTimeString } from "../helper/date";

interface TaskCreateData {
    task_name: string;
    description: string;
    status: string;
    start_time: string;
    end_time: string;
    tags: string;
    repeat_freq: string;
    remind_time: string;
    colour: string;
    user_id: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PaginationParams {
    page: number;
    limit: number;
}

export class TaskService {
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

    async getTasks(userId: string, pagination: PaginationParams) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        const tasks = await sequelize.query(
            `SELECT * FROM Tasks 
             WHERE user_id = ? 
             ORDER BY 
               CASE 
                 WHEN status = 'pending' AND end_time < NOW() THEN 1
                 WHEN status = 'pending' AND end_time >= NOW() THEN 2
                 ELSE 3 
               END,
               end_time ASC
             LIMIT ? OFFSET ?`,
            {
                replacements: [userId, limit, offset],
                type: sequelize.QueryTypes.SELECT
            }
        );

        const [{ total_count }] = await sequelize.query(
            `SELECT COUNT(*) as total_count FROM Tasks WHERE user_id = ?`,
            {
                replacements: [userId],
                type: sequelize.QueryTypes.SELECT
            }
        );

        return {
            tasks,
            pagination: {
                total: total_count,
                page,
                limit,
                total_pages: Math.ceil(total_count / limit)
            }
        };
    }

    async getTaskById(taskId: string, userId: string) {
        const [task] = await sequelize.query(
            'SELECT * FROM Tasks WHERE id = ? AND user_id = ?',
            {
                replacements: [taskId, userId],
                type: sequelize.QueryTypes.SELECT
            }
        );
        return task;
    }

    async updateTask(taskId: string, updateData: Partial<TaskCreateData>) {
        console.log("updateData", updateData)
        const currentTime = getLocalTimeString(new Date());
        
        if (updateData.start_time) {
            updateData.start_time = getLocalTimeString(new Date(updateData.start_time));
            console.log("updateData.start_time", updateData.start_time)
        }
        if (updateData.end_time) {
            updateData.end_time = getLocalTimeString(new Date(updateData.end_time));
            console.log("updateData.end_time", updateData.end_time)
        }

        if(updateData.createdAt) {
            updateData.createdAt = getLocalTimeString(new Date(updateData.createdAt));
        }
        if(updateData.updatedAt) {
            updateData.updatedAt = getLocalTimeString(new Date(updateData.updatedAt));
        }

        const setClause = Object.keys(updateData)
            .map(key => `${key} = ?`)
            .join(', ');

        const [result] = await sequelize.query(
            `UPDATE Tasks SET ${setClause}, updatedAt = ? WHERE id = ?`,
            {
                replacements: [...Object.values(updateData), currentTime, taskId],
                type: sequelize.QueryTypes.UPDATE
            }
        );
        return result;
    }

    async deleteTask(taskId: string) {
        const result = await sequelize.query(
            'DELETE FROM Tasks WHERE id = ?',
            {
                replacements: [taskId],
                type: sequelize.QueryTypes.DELETE
            }
        );
        return result;
    }

    async markTaskStatus(taskId: string, status: 'done' | 'pending') {
        console.log("markTaskStatus called", taskId, status);
        const currentTime = getLocalTimeString(new Date());
        const [result] = await sequelize.query(
            'UPDATE Tasks SET status = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: [status, currentTime, taskId],
                type: sequelize.QueryTypes.UPDATE
            }
        );
        return result;
    }
}
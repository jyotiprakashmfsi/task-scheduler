import { Response } from "express";
import { Request } from "express";
import { sequelize } from "../model/server";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  end_time: Date;
  user_id: number;
}

export const checkApproachingTasks = async (req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const fiveMinsFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  const {id} = req.params;
  try {
    const tasks = await sequelize.query(
      'SELECT * FROM Tasks WHERE status = "pending" AND end_time BETWEEN ? AND ? AND user_id = ?',
      {
        replacements: [now, fiveMinsFromNow, id],
        type: sequelize.QueryTypes.SELECT
      }
    ) as [Task[], any];
  
    res.status(201).json({data: tasks})

  } catch (error) {
    console.error('Error checking approaching tasks:', error);
  }
};

export const checkOverdueTasks = async (req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const {id} = req.params;
  try {
    const tasks = await sequelize.query(
      'SELECT * FROM Tasks WHERE status = "pending" AND end_time < ? AND user_id = ?',
      {
        replacements: [now, id],
        type: sequelize.QueryTypes.SELECT
      }
    ) as [Task[], any];

    res.status(201).json({data: tasks})
    
  } catch (error) {
    console.error('Error checking overdue tasks:', error);
  }
};

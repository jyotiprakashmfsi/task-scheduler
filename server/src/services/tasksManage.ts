import { Request, Response } from "express";
import { sequelize } from "../model/server";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { task_name, description, status, start_time, end_time, tags, repeat_freq, remind_time, colour } = req.body;
    const user_id = req.body.userId;

    const [task] = await sequelize.query(
      'INSERT INTO Tasks (task_name, description, status, start_time, end_time, tags, repeat_freq, remind_time, colour, user_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      {
        replacements: [
          task_name,
          description,
          status,
          start_time,
          end_time,
          tags,
          repeat_freq,
          remind_time,
          colour,
          user_id,
          new Date(),
          new Date()
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.userId;
    const tasks = await sequelize.query(
      'SELECT * FROM Tasks WHERE user_id = ? ORDER BY createdAt DESC',
      {
        replacements: [user_id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<any> => {
  try {
    const [task] = await sequelize.query(
      'SELECT * FROM Tasks WHERE id = ? AND user_id = ?',
      {
        replacements: [req.params.id, req.body.userId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any>  => {
  try {
    const { task_name, description, status, start_time, end_time, tags, repeat_freq, remind_time, colour } = req.body;
    
    const result = await sequelize.query(
      'UPDATE Tasks SET task_name = ?, description = ?, status = ?, start_time = ?, end_time = ?, tags = ?, repeat_freq = ?, remind_time = ?, colour = ?, updatedAt = ? WHERE id = ? AND user_id = ?',
      {
        replacements: [
          task_name,
          description,
          status,
          start_time,
          end_time,
          tags,
          repeat_freq,
          remind_time,
          colour,
          new Date(),
          req.params.id,
          req.body.userId
        ],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    if (result[1] === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<any>  => {
  try {
    const result = await sequelize.query(
      'DELETE FROM Tasks WHERE id = ? AND user_id = ?',
      {
        replacements: [req.params.id, req.body.userId],
        type: sequelize.QueryTypes.DELETE
      }
    );
    
    if (result[1] === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const markDone = async (req: Request, res: Response): Promise<any>  => {
  try {
    const result = await sequelize.query(
      'UPDATE Tasks SET status = ?, updatedAt = ? WHERE id = ? AND user_id = ?',
      {
        replacements: ['done', new Date(), req.params.id, req.body.userId],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    if (result[1] === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task marked as done" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
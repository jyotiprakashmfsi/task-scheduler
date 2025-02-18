import { Request, Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await taskService.getTasks(user_id, { page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<any> => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.body.userId);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const markDone = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await taskService.markTaskStatus(req.params.id, 'done');
    res.status(200).json({ message: "Task marked as done" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const unmarkDone = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await taskService.markTaskStatus(req.params.id, 'pending');
    res.status(200).json({ message: "Task marked as pending" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
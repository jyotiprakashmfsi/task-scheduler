import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createTask, deleteTask, getTaskById, getTasks, markDone, unmarkDone, updateTask } from "../controller/taskController";

const taskRoutes = Router();

/**
* @swagger
* components:
*   schemas:
*     Task:
*       type: object
*       required:
*         - task_name
*         - status
*         - user_id
*       properties:
*         task_name:
*           type: string
*           description: Name of the task
*         description:
*           type: string
*           description: Detailed description of the task
*         status:
*           type: string
*           description: Current status of the task
*         start_time:
*           type: string
*           format: date-time
*           description: Task start time
*         end_time:
*           type: string
*           format: date-time
*           description: Task end time
*         tags:
*           type: string
*           description: Task tags
*         repeat_freq:
*           type: integer
*           description: Task repeat frequency
*         remind_time:
*           type: integer
*           description: Reminder time before task
*         colour:
*           type: string
*           description: Task color code
*         user_id:
*           type: integer
*           description: UserId of user creating task   
* /v1/api/tasks:
*   post:
*     tags:
*     - Task Controller
*     summary: Create a new task
*     security:
*       - Authorization: []
*     parameters:
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Task'
*     responses:
*       201:
*         description: Task created successfully
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*       500:
*         description: Server Error
* /v1/api/tasks/all/{user_id}?page={page}&limit={limit}:
*   get:
*     tags:
*     - Task Controller
*     summary: Get all tasks for authenticated user
*     security:
*       - Authorization: []
*     parameters:
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*       - name: user_id
*         in: path
*         description: User ID
*         required: true
*       - in: query
*         name: page
*         required: false
*         schema:
*           type: integer
*         description: Page number
*       - in: query
*         name: limit
*         required: false
*         schema:
*           type: integer
*         description: Number of items per page
*     responses:
*       200:
*         description: List of tasks
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Task'
*       401:
*         description: Unauthorized
*       500:
*         description: Server Error
* /v1/api/tasks/{id}:
*   get:
*     tags:
*     - Task Controller
*     summary: Get task by ID
*     security:
*       - Authorization: []
*     parameters:
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*       - name: id
*         in: path
*         description: Task ID
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Task details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Task'
*       401:
*         description: Unauthorized
*       404:
*         description: Task not found
*       500:
*         description: Server Error
*   put:
*     tags:
*     - Task Controller
*     summary: Update task by ID
*     security:
*       - Authorization: []
*     parameters:
*       - name: id
*         in: path
*         description: Task ID
*         required: true
*         schema:
*           type: integer
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Task'
*     responses:
*       200:
*         description: Task updated successfully
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*       404:
*         description: Task not found
*       500:
*         description: Server Error
*   delete:
*     tags:
*     - Task Controller
*     summary: Delete task by ID
*     security:
*       - Authorization: []
*     parameters:
*       - name: id
*         in: path
*         description: Task ID
*         required: true
*         schema:
*           type: integer
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     responses:
*       200:
*         description: Task deleted successfully
*       401:
*         description: Unauthorized
*       404:
*         description: Task not found
*       500:
*         description: Server Error
* /v1/api/tasks/{id}/mark-done:
*   put:
*     tags:
*     - Task Controller
*     summary: Mark task as done by ID
*     security:
*       - Authorization: []
*     parameters:
*       - name: id
*         in: path
*         description: Task ID
*         required: true
*         schema:
*           type: integer
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     responses:
*       200:
*         description: Task marked as done
*       401:
*         description: Unauthorized
*       404:
*         description: Task not found
*       500:
*         description: Server Error
* /v1/api/tasks/{id}/unmark-done:
*   put:
*     tags:
*     - Task Controller
*     summary: Mark task as todo by ID
*     security:
*       - Authorization: []
*     parameters:
*       - name: id
*         in: path
*         description: Task ID
*         required: true
*         schema:
*           type: integer
*       - in: header
*         name: Authorisation
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     responses:
*       200:
*         description: Task marked as todo
*       401:
*         description: Unauthorized
*       404:
*         description: Task not found
*       500:
*         description: Server Error
*/

// Routes with authentication middleware
taskRoutes.post("/", authMiddleware, createTask);
taskRoutes.get("/all/:user_id", authMiddleware, getTasks);
taskRoutes.get("/:id", authMiddleware, getTaskById);
taskRoutes.put("/:id", authMiddleware, updateTask);
taskRoutes.delete("/:id", authMiddleware, deleteTask);
taskRoutes.put("/:id/mark-done", authMiddleware, markDone);
taskRoutes.put("/:id/unmark-done", authMiddleware, unmarkDone);

export default taskRoutes;

import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { deleteUser, login, signup, update } from "../services/usersManage";
// import * as fn from "../services/usersManage";

const authRoutes= Router();

/**
* @swagger
* components:
*   securitySchemes:
*     Authorization:
*       type: string
*       scheme: bearer
*       bearerFormat: JWT
* /api/auth/signup:
*   post:
*     tags:
*     - Auth Controller
*     summary: Create a user
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - fname
*              - email
*              - password
*            properties:
*              fname:
*                type: string
*                default: johndoe 
*              email:
*                type: string
*                default: johndoe@gmail.com
*              password:
*                type: string
*                default: johnDoe20!@      
*     responses:
*      201:
*        description: Created
*      409:
*        description: Conflict
*      404:
*        description: Not Found
*      500:
*        description: Server Error
* /api/auth/login:
*   post:
*     tags:
*     - Auth Controller
*     summary: Login as a user
*     requestBody:
*      required: true
*      content:
*        application/json:
*           schema:
*            type: object
*            required:
*              - email
*              - password
*            properties:
*              email:
*                type: string
*                default: johndoe@gmail.com
*              password:
*                type: string
*                default: johnDoe20!@ 
*     responses:
*      201:
*        description: Logged in
*      409:
*        description: Conflict
*      404:
*        description: Not Found
*      500:
*        description: Server Error
* /api/auth/{id}:
*  delete:
*     tags:
*     - Auth Controller
*     summary: Delete user by Id
*     parameters:
*      - name: id
*        in: path
*        description: The unique Id of the user
*        required: true
*     responses:
*      200:
*        description: Removed
*      400:
*        description: Bad request
*      404:
*        description: Not Found
*      500:
*        description: Server Error
*/
authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.delete("/:id", deleteUser)
authRoutes.put("/:id", update)


export default authRoutes;
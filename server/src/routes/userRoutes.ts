import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { deleteUser, update } from "../controller/usersManage";

const userRoutes= Router();

/**
* @swagger
* components:
*   securitySchemes:
*     Authorization:
*       type: string
*       scheme: bearer
*       bearerFormat: JWT
* /api/users/{id}:
*  delete:
*     tags:
*     - User Controller
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

userRoutes.delete("/:id", authMiddleware, deleteUser)


/**
* @swagger
* components:
*   securitySchemes:
*     Authorization:
*       type: string
*       scheme: bearer
*       bearerFormat: JWT 
* /api/users/{id}:
*  put:
*     tags:
*     - User Controller
*     summary: Update user by Id
*     parameters:
*      - name: id
*        in: path
*        description: The unique Id of the user
*        required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*                 description: User's email address
*               fname:
*                 type: string
*                 description: User's full name
*               contact:
*                 type: string
*                 description: User's contact number
*               dob:
*                 type: string
*                 format: date
*                 description: User's date of birth
*     responses:
*      200:
*        description: Updated
*      400:
*        description: Bad request
*      404:
*        description: Not Found
*      500:
*        description: Server Error
*/
userRoutes.put("/:id", authMiddleware, update)


export default userRoutes;
import { sequelize } from "../model/server";
import { getLocalTimeString } from "../helper/date";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

interface UserUpdateData {
    email?: string;
    fname?: string;
    contact?: string;
    dob?: string;
}

export class UserService {

    async getAllUsers() {
        const users = await sequelize.query(
            'SELECT * FROM Users',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        return users;
    }

    async getUserById(userId: string) {
        const [user] = await sequelize.query(
            'SELECT * FROM Users WHERE id = ?',
            {
                replacements: [userId],
                type: sequelize.QueryTypes.SELECT
            }
        );
        return user;
    }

    async updateUser(userId: string, updateData: UserUpdateData) {
        const currentTime = getLocalTimeString(new Date());
        
        if (updateData.dob) {
            updateData.dob = getLocalTimeString(new Date(updateData.dob));
        }

        const [result] = await sequelize.query(
            'UPDATE Users SET fname = ?, email = ?, contact = ?, dob = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: [
                    updateData.fname,
                    updateData.email,
                    updateData.contact || '',
                    updateData.dob || '',
                    currentTime,
                    userId
                ],
                type: sequelize.QueryTypes.UPDATE
            }
        );
        return result;
    }

    async deleteUser(userId: string) {
        const result = await sequelize.query(
            'DELETE FROM Users WHERE id = ?',
            {
                replacements: [userId],
                type: sequelize.QueryTypes.DELETE
            }
        );
        return result;
    }
}

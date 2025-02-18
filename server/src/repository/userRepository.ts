import { sequelize } from "../model/server";
import { UserUpdateData } from "../types/user";
import { getLocalTimeString } from "../helper/date";

export class UserRepository {
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
}

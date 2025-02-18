import { sequelize } from "../model/server";
import { hashPassword } from '../utils/passwordHash';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const bcrypt = require("bcrypt");


dotenv.config();
const secretKey = process.env.JWT_SECRET_TOKEN || '';

interface UserData {
    fname: string;
    email: string;
    password: string;
}

interface SafeUser {
    id: number;
    email: string;
    fname: string;
}

export class AuthService {
    async createUser(userData: UserData): Promise<void> {
        const { fname, email, password } = userData;
        const hashedPassword = await hashPassword(password);
        
        await sequelize.query(
            'INSERT INTO Users (fname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
            {
                replacements: [fname, email, hashedPassword, new Date(), new Date()],
                type: sequelize.QueryTypes.INSERT
            }
        );
    }

    async authenticateUser(email: string, password: string): Promise<{ token: string, user: SafeUser }> {
        const [user] = await sequelize.query('SELECT * FROM Users WHERE email = ?', {
            replacements: [email],
            type: sequelize.QueryTypes.SELECT
        }) as any[];

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            secretKey,
            { expiresIn: "3h" }
        );

        const safeUser: SafeUser = {
            id: user.id,
            email: user.email,
            fname: user.fname,
        };

        return { token, user: safeUser };
    }
}

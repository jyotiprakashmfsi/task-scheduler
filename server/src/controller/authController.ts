// import { db } from '/model.js';
import { Response } from "express";
import { Request } from "express";
import { sequelize } from "../model/server";
import { hashPassword } from '../utils/passwordHash';

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "34kj34lhtjh34jlkth3kj4th32jhrjwlrnljnrkrje3rnj3krk";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fname, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user= sequelize.query('INSERT INTO Users (fname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', {
      replacements: [fname, email, hashedPassword, new Date(), new Date()],
      type: sequelize.QueryTypes.INSERT
    })
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email, password } = req.body;
    const [user] = await sequelize.query('SELECT * FROM Users WHERE email = ?', {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT
    })
    console.log("user found", user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("User is :", user);
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "3h",
    });
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
// import { db } from '/model.js';
import { Response } from "express";
import { Request } from "express";
import { sequelize } from "../model/server";
import { hashPassword } from '../utils/passwordHash';

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_TOKEN || "34kj34lhtjh34jlkth3kj4th32jhrjwlrnljnrkrje3rnj3krk";

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
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const update = async(req: Request, res: Response) => {
    try {
      const {email, fname, contact, dob } = req.body;
      // const hashedPassword = await hashPassword(password);
      const [user]= sequelize.query('UPDATE Users SET fname = ?, email = ?, contact = ?, dob = ?, updatedAt = ? WHERE id = ?', {
        replacements: [fname, email, req.params.id, contact, dob, new Date()],
        type: sequelize.QueryTypes.UPDATE
      })
      res.status(201).json({ message: "User updated successfully", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
}

export const deleteUser = async(req: Request, res: Response) => {
  try {
    const [user] = sequelize.query('DELETE FROM Users WHERE id = ?', {
      replacements: [req.params.id],
      type: sequelize.QueryTypes.DELETE
    })
    res.status(201).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}
// import { db } from '/model.js';
import { Response } from "express";
import { Request } from "express";
import { sequelize } from "../model/server";
import { hashPassword } from '../utils/passwordHash';
import dotenv from "dotenv"

dotenv.config()

require("dotenv").config();


const secretKey = process.env.JWT_SECRET_TOKEN || '';

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
    console.log("received cred: ", email, password);
    const [user] = await sequelize.query('SELECT * FROM Users WHERE email = ?', {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT
    })
    console.log("user found", user);
    if(!user){
        return res.status(404).json({message: "Use a valid email or password"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("User is :", user);
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, {
      expiresIn: "3h",
    });
    
    const safeUser = {
      id: user.id,
      email: user.email,
      fname: user.fname,
    };
    
    res.status(200).json({ 
      token: token,
      user: safeUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
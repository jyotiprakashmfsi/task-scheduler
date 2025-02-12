import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_TOKEN || '43jrb43kjtkjw5eg';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
  try {
    const authHeader = req.header('Authorisation') || req.header('authorisation');
    console.log("All Headers:", req.headers);
    console.log("Authorization header:", authHeader);
  
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No token provided',
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({ 
          message: 'Invalid token',
          error: err.message 
        });
      }
      
      (req as any).user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
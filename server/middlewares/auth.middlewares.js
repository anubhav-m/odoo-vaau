import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.models.js";
import { errorThrower } from '../utils/error.js';

export const authorize = async (req, res, next) => {
    try{
        let token = req.cookies.access_token;

        if (!token){
            errorThrower(401, 'No token - Unauthorized');
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded || !decoded.id){
            errorThrower(401, 'Invalid token - Unauthorized');
        }

        const user = await User.findById(decoded.id);

        if (!user){
            errorThrower(401, 'User not found - Unauthorized');
        }

        req.user = user;

        next();
    }

    catch(err){
        next(err);
    }
}
import bcrypt from "bcryptjs";
import { errorThrower, errorSetter } from "../utils/error.js"
import User from "../models/user.models.js";
import { Post } from '../models/post.models.js';

export const updateUser = async (req, res, next) => {

    try {

        //Backend validation
        if (req.params.id !== req.user.id) {
            errorThrower(403, 'You are not allowed to update this user');
        }

        if (!req.body.username && !req.body.password && !req.body.profilePic) {
            errorThrower(400, 'Nothing to update');
        }

        if (req.body.password) {
            if (req.body.password.length < 5 || req.body.password.length > 14) {
                errorThrower(400, 'Password must be atleast 5 and atmost 14 characters');
            }

            if (req.body.password.includes(' ')) {
                errorThrower(400, 'Password cannot contain spaces');
            }

            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }



        if (req.body.username) {
            if (req.body.username.length < 5 || req.body.username.length > 30) {
                errorThrower(400, 'Username must be atleast 5 and atmost 30 characters');
            }

            if (req.body.username.includes(' ')) {
                errorThrower(400, 'Username cannot contain spaces');
            }

            if (req.body.username !== req.body.username.toLowerCase()) {
                errorThrower(400, 'Username must be in lowercase')
            }

            if (!req.body.username.match(/^[a-z0-9]+$/)) {
                errorThrower(400, 'Username can only contain letters and numbers')
            }
        }
        //..............................................................

        const updateFields = {
            ...(req.body.profilePic && { profilePic: req.body.profilePic }),
            ...(req.body.username && { username: req.body.username }),
            ...(req.body.password && { password: req.body.password }),
        };


        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: rest
        })
    }
    catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];

            if (duplicateField === 'username') {
                const usernameError = errorSetter(400, `Username not available`);
                return next(usernameError);
            }

        }
        next(err);

    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const isOwner = req.params.id === req.user.id;
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to delete this user');
        }

        await Post.deleteMany({userId: req.user.id})
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User and associated posts deleted successfully"
        });
    } 
    catch (err) {
        next(err);
    }
}


export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({
            success: true,
            message: "User signed out successfully"
        })
    }

    catch (err) {
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        errorThrower(403, 'You are not allowed to see all users');
    }

    try {
        const startIndex = parseInt(req.query.startIndex || 0);
        const limit = parseInt(req.query.limit || 9);
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection})
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user)=>{
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            success: true,
            message: 'Fetched all users successfully',
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    }

    catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId){
            errorThrower(400, 'No user id provided');
        }

        const user = await User.findById(userId);
        
        if(!user){
            errorThrower(404, 'User not found');
        }
        
        const { password, ...rest } = user._doc;
        res.status(200).json({
            success: true,
            message: 'Fetched user successfully',
            user: rest
        });
    } 
    
    catch (err) {
        
    }
}
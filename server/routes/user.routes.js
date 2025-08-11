import express from 'express'
import { updateUser, deleteUser, signOut, getUsers, getUser } from '../controllers/user.controllers.js';
import { authorize } from '../middlewares/auth.middlewares.js'

export const userRouter = express.Router();

userRouter.put('/update/:id', authorize, updateUser);
userRouter.delete('/delete/:id', authorize, deleteUser);
userRouter.post('/signout', signOut);
userRouter.get('/getusers', authorize, getUsers);
userRouter.get('/:userId', getUser);

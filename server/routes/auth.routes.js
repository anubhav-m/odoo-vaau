import express from 'express'
import { SignUp, SignIn, Google } from '../controllers/auth.controllers.js'

export const authRouter = express.Router();

authRouter.post('/signup', SignUp);

authRouter.post('/signin', SignIn);

authRouter.post('/google', Google);
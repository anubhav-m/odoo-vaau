import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { authorize } from "../middlewares/auth.middlewares.js";

export const adminRouter = express.Router();

adminRouter.get("/stats", authorize, getAdminStats);

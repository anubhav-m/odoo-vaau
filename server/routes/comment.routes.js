import express from "express";
import {
  createComment,
  getPostCommentByPostId,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controllers.js";
import { authorize } from "../middlewares/auth.middlewares.js";

export const commentRouter = express.Router();

commentRouter.post("/create", authorize, createComment);
commentRouter.get("/getPostComments/:postId", getPostCommentByPostId);
commentRouter.put("/likeComment/:commentId", authorize, likeComment);
commentRouter.put("/editComment/:commentId", authorize, editComment);
commentRouter.delete("/deleteComment/:commentId", authorize, deleteComment);
commentRouter.get("/getcomments", authorize, getComments);

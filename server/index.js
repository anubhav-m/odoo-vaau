import express from "express";
import cors from "cors";
import { connectToDB } from "./database/mongodb.js";
import { PORT, NODE_ENV } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { facilityRouter } from "./routes/facility.routes.js";
import { commentRouter } from "./routes/comment.routes.js";
import { adminRouter } from "./routes/admin.route.js";

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/facility", facilityRouter);
app.use("/api/admin", adminRouter);
app.use("/api/comment", commentRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to NodeNotion api");
});

(async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
  }
})();

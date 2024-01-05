import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";
//creating server
export const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    // for bringing cookies on the frontend
    credentials: true,
  })
);

//using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

config({
  path: "./data/config.env",
});

app.get("/", (req, res) => {
  res.send("Nice working");
});

//using error middleware
app.use(errorMiddleware);

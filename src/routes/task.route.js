import { Router } from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import { createTask, getUserTasks } from "../controllers/task.controller.js";

const TaskRouter = Router()

TaskRouter.post('/create', authenticate, createTask)
TaskRouter.get('/', authenticate, getUserTasks)

export default TaskRouter
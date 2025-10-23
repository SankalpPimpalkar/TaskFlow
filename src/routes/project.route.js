import { Router } from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import {
    createProject,
    addMembersInProject,
    deleteProject,
    getProject,
    listProjects
} from "../controllers/project.controller.js";
import { getProjectTasks } from "../controllers/task.controller.js";

const ProjectRouter = Router()

ProjectRouter.post('/create', authenticate, createProject)
ProjectRouter.get('/', authenticate, listProjects)
ProjectRouter.get('/:projectId', authenticate, getProject)
ProjectRouter.get('/:projectId/tasks', authenticate, getProjectTasks)
ProjectRouter.patch('/:projectId/addmembers', authenticate, addMembersInProject)
ProjectRouter.delete('/:projectId', authenticate, deleteProject)

export default ProjectRouter
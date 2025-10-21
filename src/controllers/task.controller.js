import Task from "../models/task.model.js";
import AsyncHandler from "../utils/asynchandler.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";

export const createTask = AsyncHandler(async (req, res) => {
    const { title, description, projectId, dueDate, assignedTo, status } = req.body;

    if (
        !title.trim() ||
        !description.trim()
    ) {
        return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required (Title, Description)"
            })
    }

    if (!projectId.trim()) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'ProjectId is required to create task in project'
            })
    }

    if (!dueDate.trim()) {
        return res
            .status(400)
            .json({
                success: false,
                message: "Due Date is required to create task"
            })
    }

    const project = await Project.findById(projectId)

    if (!project) {
        return res
            .status(404)
            .json({
                success: false,
                message: "Project not found"
            })
    }

    const newTask = new Task()

    newTask.title = title
    newTask.description = description
    newTask.assignee = req.user._id.toString()
    newTask.dueDate = new Date(dueDate)

    if (status.trim()) {
        newTask.status = status
    }

    if (assignedTo.trim()) {
        const assignedToUser = await User.findById(assignedTo)

        if (!assignedToUser) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Please assign a valid user for this task"
                })
        }

        newTask.assignedTo = assignedToUser._id
    }

    (await newTask.save()).populate("project assignee assignedTo")

    return res
        .status(201)
        .json({
            success: true,
            message: "New Task has been created!!",
            data: newTask
        })
})

export const getUserTasks = AsyncHandler(async (req, res) => {

    const tasks = await Task.find({
        $or: [
            { assignedTo: req.user._id.toString() },
            { assignee: req.user._id.toString() },
        ]
    }).populate("project assignedTo assignee")

    return res
        .status(200)
        .json({
            success: true,
            message: "Fetched all user tasks",
            data: tasks
        })
})

export const getProjectTasks = AsyncHandler(async (req, res) => {

    const { projectId } = req.body;

    if (!projectId.trim()) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'ProjectId is required to get project tasks'
            })
    }

    const project = await Project.findById(projectId)

    if (!project) {
        return res
            .status(404)
            .json({
                success: false,
                message: "Project does not exists"
            })
    }

    const tasks = await Task.find({
        project: project._id
    }).populate("project assignedTo assignee")

    return res
        .status(200)
        .json({
            success: true,
            message: "Fetched all user tasks",
            data: tasks
        })
})
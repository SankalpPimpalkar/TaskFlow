import Project from "../models/project.model.js";
import AsyncHandler from "../utils/asynchandler.js";

export const createProject = AsyncHandler(async (req, res) => {
    const { title, description } = req.body;

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

    const newProject = await Project.create({
        title,
        description,
        admin: req.user._id,
        members: [req.user._id]
    })

    return res
        .status(201)
        .json({
            success: true,
            message: "New project created!!",
            data: newProject
        })
})

export const addMembersInProject = AsyncHandler(async (req, res) => {
    const { members } = req.body;
    const { projectId } = req.params

    if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one member is required"
        });
    }

    if (!projectId || !projectId.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project ID is required"
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to add members to this project"
        });
    }

    const existingUsers = await User.find({ _id: { $in: members } }).select('_id');

    if (existingUsers.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid member IDs found"
        });
    }

    const validMemberIds = existingUsers.map(user => user._id.toString());

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { members: { $each: validMemberIds } } },
        { new: true }
    ).populate("admin members");

    return res.status(200).json({
        success: true,
        message: "Valid members have been added to the project",
        data: updatedProject
    });
})

export const getProject = AsyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId || !projectId.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project ID is required"
        });
    }

    const project = await Project.findById(projectId).populate("admin members")

    if (!project) {
        return res
            .status(404)
            .json({
                success: false,
                message: "Project not found"
            })
    }

    return res
        .status(200)
        .json({
            success: true,
            message: "Project fetched",
            data: project
        })
})

export const deleteProject = AsyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId || !projectId.trim()) {
        return res.status(400).json({
            success: false,
            message: "Project ID is required"
        });
    }

    await Project.findByIdAndDelete(projectId)

    return res
        .status(200)
        .json({
            success: true,
            message: "Project Deleted"
        })
})

export const listProjects = AsyncHandler(async (req, res) => {

    const projects = await Project.find({
        members: userId
    }).populate("admin members", "name email username");

    return res
        .status(200)
        .json({
            success: true,
            message: "All Projects fetched",
            data: projects
        })
})

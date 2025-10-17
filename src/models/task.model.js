import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['unassigned', 'pending', 'in_progress', 'completed'],
        default: 'unassigned'
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)
export default Task;
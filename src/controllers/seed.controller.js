import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../models/user.model.js';
import Project from '../models/project.model.js';
import Task from '../models/task.model.js';

const TASK_STATUSES = ['unassigned', 'pending', 'in_progress', 'completed'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const seedDatabase = async (req, res) => {
    try {
        console.log('🚀 Starting database seeding...');

        // 🧹 Clear old data
        await Promise.all([
            User.deleteMany(),
            Project.deleteMany(),
            Task.deleteMany()
        ]);
        console.log('🧹 Old data cleared.');

        const users = [];
        for (let i = 1; i <= 50; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const username = faker.internet.username({ firstName, lastName }).toLowerCase();
            const email = faker.internet.email({ firstName, lastName }).toLowerCase();

            users.push({
                name: `${firstName} ${lastName}`,
                username,
                email,
                password: faker.internet.password({ length: 10 }) // fake password
            });
        }
        const createdUsers = await User.insertMany(users);
        console.log(`👤 ${createdUsers.length} users created.`);

        const projects = [];
        for (let i = 1; i <= 50; i++) {
            const admin = getRandomItem(createdUsers);
            const members = Array.from(
                { length: faker.number.int({ min: 3, max: 8 }) },
                () => getRandomItem(createdUsers)._id
            );

            projects.push({
                title: `${faker.commerce.department()} Project`,
                description: faker.commerce.productDescription(),
                admin: admin._id,
                members
            });
        }
        const createdProjects = await Project.insertMany(projects);
        console.log(`📁 ${createdProjects.length} projects created.`);

        const tasks = [];
        for (let i = 1; i <= 50; i++) {
            const project = getRandomItem(createdProjects);
            const assignee = Math.random() > 0.2 ? getRandomItem(createdUsers) : null;

            tasks.push({
                title: faker.hacker.phrase(),
                description: faker.lorem.sentence(),
                project: project._id,
                assignee: assignee?._id || null,
                assignedTo: assignee?._id || null,
                status: assignee ? getRandomItem(TASK_STATUSES) : 'unassigned',
                dueDate: faker.date.soon({ days: 10 })
            });
        }

        const createdTasks = await Task.insertMany(tasks);
        console.log(`✅ ${createdTasks.length} tasks created.`);

        return res.status(201).json({
            success: true,
            message: 'Database seeded successfully with realistic data!',
            counts: {
                users: createdUsers.length,
                projects: createdProjects.length,
                tasks: createdTasks.length
            }
        });
    } catch (err) {
        console.error('❌ Seeding error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

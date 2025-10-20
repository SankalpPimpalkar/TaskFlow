import { JWT_SECRET } from "../constants/index.js";
import User from "../models/user.model.js";
import AsyncHandler from "../utils/asynchandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
    maxAge: 60 * 60 * 60 * 60 * 60,
    httpOnly: true,
    sameSite: 'Lax',
    secure: true
}

export const registerUser = AsyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body

    if (
        !name.trim() ||
        !email.trim() ||
        !username.trim() ||
        !password.trim()
    ) {
        return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required (name, email, username, password)"
            })
    }

    const existingUser = await User.findOne({ email, username })

    if (existingUser) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'User already exists with this email or username'
            })
    }

    await User.create({
        name,
        email,
        username,
        password
    })

    return res
        .status(201)
        .json({
            success: true,
            message: 'User registered!!'
        })
})

export const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        !email.trim() ||
        !password.trim()
    ) {
        return res
            .status(400)
            .json({
                success: false,
                message: "All fields are required (email, password)"
            })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res
            .status(404)
            .json({
                success: false,
                message: "User does not exists with this email"
            })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Incorrect Password"
            })
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET)

    res.cookie("token", token, COOKIE_OPTIONS)

    return res
        .status(200)
        .json({
            success: true,
            message: "User logged in",
        })
})

export const logoutUser = AsyncHandler(async (req, res) => {

    res.clearCookie("token", COOKIE_OPTIONS)

    return res
        .status(200)
        .json({
            success: true,
            message: "User logged out"
        })
})

export const getUserDetails = AsyncHandler(async (req, res) => {

    console.log(req.user)

    return res
        .status(200)
        .json({
            success: true,
            message: "User details fetched",
            data: req.user
        })
})
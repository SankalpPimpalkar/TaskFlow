import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import AsyncHandler from "../utils/asynchandler.js"
import { JWT_SECRET } from "../constants/index.js"

const authenticate = AsyncHandler(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res
            .status(404)
            .json({
                success: false,
                message: "Token not found"
            })
    }

    const decodedToken = jwt.verify(token, JWT_SECRET)

    if (!decodedToken) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Invalid token"
            })
    }

    const user = await User.findById(decodedToken._id).select("-password")

    if (!user) {
        return res
            .status(401)
            .json({
                success: false,
                message: "User not found"
            })
    }

    req.user = user
    next()
})


export default authenticate;
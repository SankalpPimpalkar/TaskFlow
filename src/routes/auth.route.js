import { Router } from "express";
import { getUserDetails, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const AuthRouter = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', loginUser)
AuthRouter.get('/get-user', authenticate, getUserDetails)
AuthRouter.delete('/logout', logoutUser)

export default AuthRouter
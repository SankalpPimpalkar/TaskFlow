import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    }
    return next()
})

const User = mongoose.model('User', userSchema)
export default User
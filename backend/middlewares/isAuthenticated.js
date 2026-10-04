import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(400).json({
                message: "Token not found"
            })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Invalid Token"
        })
    }
}
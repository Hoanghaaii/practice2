import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const registerUser = async (req, res)=>{
    try {
        const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({message: "Username or Password are not provided!"})
    }
    const isExistedUser = await User.findOne({username})
    if(isExistedUser){
        return res.status(400).json({message: "Username is existed! "})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        username,
        password: hashedPassword
    })
    await user.save()
    res.status(200).json({message: "Create user successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const login = async (req, res)=>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: "All fields are required!"})
        }
        const user =await  User.findOne({username})
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({message: "Password invalid!"})
        }
        generateTokenAndSetCookie(res, user.username);
        res.status(200).json({message: "Login Successfully!"})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Server error: ", error: error.message})
    }

}
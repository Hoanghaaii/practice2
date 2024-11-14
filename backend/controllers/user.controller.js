import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { postFile } from "../../aws/aws.js";

export const registerUser = async (req, res)=>{
    try {
        const {fullName, email,phone,avatar, bio, expertise, experience, role, status , password} = req.body //lấy username, password từ body của req
        if(!fullName || !password || !email || !expertise || !experience || !role || !status){ //kiểm tra xem username và password có trống không
            return res.status(400).json({message: "All fields are required!"})
        }
        const isExistedUser = await User.findOne({email}) //kiểm tra xem đã tồn tại user hay chưa, nếu rồi thì return lỗi
        if(isExistedUser){
            return res.status(400).json({message: "Username is existed! "})
        }
        const hashedPassword = await bcrypt.hash(password, 10) //mã hoá password bằng bcrypt
        const user = new User({
            fullName,
            password: hashedPassword, //lưu mật khẩu được mã hoá
            email,
            phone,
            avatar,
            bio,
            expertise,
            experience,
            role,
            status
        })
        await user.save()
        res.status(200).json({message: "Create user successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const login = async (req, res)=>{
    try {
        const {username, password} = req.body; //lấy username, password từ body của req
        if(!username || !password){ //kiểm tra xem username và password có trống không
            return res.status(400).json({message: "All fields are required!"})
        }
        const user =await  User.findOne({username}) //tìm xem có username trong database chưa, nếu không có return lỗi
        if(!user){ 
            return res.status(400).json({message: "User not found!"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password) //kiểm tra xem password có đúng không bằng bcrypt.compare, nếu đúng trả về true
        if(!isPasswordValid){
            return res.status(400).json({message: "Password invalid!"})
        }
        const token = generateTokenAndSetCookie(res, user.username); //tạo token chứa thông tin người dùng, gán vào cookie
        res.status(200).json({message: "Login Successfully!", token})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Server error: ", error: error.message})
    }
}

export const getAllUserProfile = async (req, res)=>{
    try {
        const users = await User.find().select("avatar bio expertise experience");;
        res.status(200).json({message: "Get all user profiles successfully!", users})
    } catch (error) {
        res.status(500).json({message: "Server error ", error: error.message})
    }
}

export const getUserProfileById = async (req, res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        res.status(200).json({message: "Get user by id successfully!", user})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const updateBasicProfile = async (req, res)=>{
    try {
        const {fullName, phone, avatar, bio,status} = req.body
        if(!fullName && !phone &&!avatar && !bio && !status) {
            return res.status(400).json({message: "At least 1 field must be provided!"})
        }
        if(!['active', 'inactive'].includes(status)){
            return res.status(400).json({message: "Invalid type of status"})
            
        }
        const userId = req.params.id
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }
        const updateData = {}
        if(fullName) updateData.fullName = fullName
        if(phone) updateData.phone = phone
        if(avatar) updateData.avatar = avatar
        if(bio) updateData.bio = bio
        if(status) updateData.status = status
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new: true})
        res.status(200).json({message: "Profile updated successfully!", user: updatedUser})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const uploadAvatar = async (req, res)=>{
    try {
        const userId = req.params.id
    if(!userId){
        return res.status(400).json("Userid is not provided!")
    }
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({message: "User not found!"})
    }
    if(!req.file){
        return res.status(400).json({message: "Avatar image not found!"})
    }
    if(req.file){
        const uploadResult = await postFile(req, 'avatar');
        console.log(uploadResult)
        if(!uploadResult.success){
            return res.status(500).json({message: "Failed to upload avatar!"})
        }
        user.avatar  = uploadResult.fileUrl
    }
    await user.save()
    return res.status(200).json({message: "Upload image successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const updateProfessionalProfile = async (req, res)=>{
    const {expertise, experience, role} = req.body
    const userId = req.params.id
    if(!expertise && !experience && !role){
        return res.status(400).json({message: "At least 1 field must be provided!"})
    }
    if(!['admin', 'creator', 'member'].includes(role)){
        return res.status(400).json({message: "Invalid value of role!"})

    }
    if(!userId){
        return res.status(400).json({message: "UserID must be provided!"})
    }
    const user = User.findById(userId)
    if(!user){
        return res.status.json({message: "User not found!"})
    }
    const updateData = {}
    if(expertise) updateData.expertise = expertise
    if(role) updateData.role = role
    if(experience) updateData.experience = experience
    const updateUser = await User.findByIdAndUpdate(userId, updateData, {new: true})
    res.status(200).json({message: "Update professional profile successfully!", updateUser})
}

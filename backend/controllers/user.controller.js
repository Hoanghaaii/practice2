import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const registerUser = async (req, res)=>{
    try {
        const {username, password} = req.body //lấy username, password từ body của req
        if(!username || !password){ //kiểm tra xem username và password có trống không
            return res.status(400).json({message: "Username or Password are not provided!"})
        }
        const isExistedUser = await User.findOne({username}) //kiểm tra xem đã tồn tại user hay chưa, nếu rồi thì return lỗi
        if(isExistedUser){
            return res.status(400).json({message: "Username is existed! "})
        }
        const hashedPassword = await bcrypt.hash(password, 10) //mã hoá password bằng bcrypt
        const user = new User({
            username,
            password: hashedPassword //lưu mật khẩu được mã hoá 
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
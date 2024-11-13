import jwt from 'jsonwebtoken';
//Hàm tạo ra token và gán token vào cookie, token khi giair mã sẽ mang thông tin username của người dùng
export const generateTokenAndSetCookie = (res, username) =>{
    const token = jwt.sign({username}, process.env.JWT_SECRET,{
        expiresIn: '7d' //token có thời hạn là 7 ngày,hết 7 ngày sẽ phải đăng nhập lại
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, //token có thời hạn là 7 ngày,hết 7 ngày sẽ phải đăng nhập lại
    })
    return token;
}


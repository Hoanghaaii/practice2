import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, username) =>{
    const token = jwt.sign({username}, process.env.JWT_SECRET,{
        expiresIn: '7d'
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return token;
}


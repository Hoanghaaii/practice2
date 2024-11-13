import jwt from 'jsonwebtoken';
//middleware verify token được gửi từ header, sau đó trả về thông tin người dùng username qua req cho hàm tiếp theo xử lý
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token; //token có dạng "bearer token" nếu gửi bằng bearer nên dùng split lấy phần sau chính là token
    console.log("Received token:", token);
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token
        
        if (!decoded) {
            return res.status(403).json({ success: false, message: "Token not valid" });
        }

        req.username = decoded.username; //gán username vào req.username
        next(); //gọi hàm tiếp thoe xử lý
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

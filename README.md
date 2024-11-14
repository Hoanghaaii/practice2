Để chạy dự án: 
1. Clone repo: git clone https://github.com/Hoanghaaii/practice2.git
2. Thêm file .env với nội dung:
  PORT = 3000
  MONGO_URI = mongodb+srv://haivu04112003:Hoanghai123@cluster0.hzva6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  JWT_SECRET = practice1
  NODE_ENV = development
  AWS_REGION=ap-southeast-2
  AWS_ACCESS_KEY_ID= ...
  AWS_SECRET_ACCESS_KEY= ...
  AWS_BUCKET_NAME = 2handstoreimg
3. Cài các thư viện: npm i mongoose express jsonwebtoken bcryptjs dotenv nodemon aws-sdk/client-s3 cookie-parser crypto multer
4. Chạy dự án: npm run dev
5. Link test API bằng postman: https://www.postman.com/hoanghaaii/practice1/collection/ups2i5f/user?action=share&creator=34266281

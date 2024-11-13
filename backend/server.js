import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/connectDB.js'
import userRouter from './routers/user.router.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use('/api/users/', userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
    connectDB()
})
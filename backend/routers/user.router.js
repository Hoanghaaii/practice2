import express from 'express'
import { getAllUserProfile, getUserProfileById, login, registerUser, updateBasicProfile, updateProfessionalProfile, uploadAvatar } from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { uploadAvatarMiddleWare } from '../../aws/aws.js'

const router = express.Router()

router.get('/', getAllUserProfile )
router.get('/:id', getUserProfileById)
router.put('/update-basic/:id', updateBasicProfile)
router.put('/update-pro/:id', updateProfessionalProfile)
router.post('/register', registerUser)
router.post('/login', login)
router.post('/upload-avatar/:id', uploadAvatarMiddleWare, uploadAvatar)

export default router
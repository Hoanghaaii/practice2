import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    fullName: {type: String, require: true},
    password: {type: String, require: true},
    phone: {type: String},
    avatar: {type: String},
    bio: {type: String},
    expertise: [{type: String, required: true}],
    experience: {type: Number, required: true},
    role: {type: String, enum: ['admin', 'creator', 'member']},
    status: {type: String, enum: ['active', 'inactive']}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)
export default User;

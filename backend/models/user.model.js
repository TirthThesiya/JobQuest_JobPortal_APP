import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNO:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        enum:['student','recruiter'],
        require:true
    },
    Profile:{
        bio:{type:String},
        Skills:[{type:String}],
        resume:{type:String}, //URL to Resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'}, 
        ProfilePhoto:{
            type:String,
            default:''
        }
    },
},{timestamps:true})

export const User = mongoose.model('User',userSchema);
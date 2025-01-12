const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50,
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    avatarImage:{
        type:String,
        default:"",
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false,
    }
})

module.exports = mongoose.model("Users",userSchema)
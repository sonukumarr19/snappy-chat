const messageModel = require("../models/messageModel")

module.exports.addMessages = async(req,res,next)=>{
    try {
        const {from,to,message}=req.body
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
        })
        if(data) return res.json({
            msg:"Message added successfully",
            status:true
        })
        return res.json({
            msg:"Unable to send message",
            status:false,
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getAllMessages=async(req,res,next)=>{
        try {
            const {from,to}=req.body;
            const messages = await messageModel.find({
                users:{
                    $all:[from,to],
                },
            }).sort({updatedAt:1})
        } catch (error) {
            next(error)
        }
}
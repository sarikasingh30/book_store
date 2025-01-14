const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    email:{type:String , required:true, unique: true},
    password:{type:String , required:true},
    googleId:{type:String},
    googleAccessToken:{type:String},
    username: {type:String}
    
})
module.exports=mongoose.model("user", userSchema)
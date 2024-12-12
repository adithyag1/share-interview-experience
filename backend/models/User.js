const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const Schema=mongoose.Schema

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    articles: [{type:Schema.Types.ObjectId, ref:'Article',default:[]}]
});

UserSchema.pre('save',async ()=>{
    this.password=await bcrypt.hash(this.password,12);
});

UserSchema.methods.generateAuthToken=function(){
     return jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.JWT_SECRET,
        {expiresIn:1*24*60*60}
    );
}

module.exports = mongoose.model('User', UserSchema);

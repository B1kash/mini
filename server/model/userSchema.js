const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required: true
    },
    work:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
           required:true
        }
    }]

})




//hashing the password


// userSchema.pre('save', async function (next) {
//     console.log("hi from inside");
//     if(this.isModified('password')){
        
//         this.password = bcrypt.hash(this.password, 12);
//         this.cpassword = bcrypt.hash(this.cpassword, 12);
//     }
//     next();
// });

userSchema.pre('save', async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(this.password, salt)
        const hashcpassword = await bcrypt.hash(this.cpassword, salt)
        this.password = hashpassword
        this.cpassword = hashcpassword
        next()
    } catch(error){
        next(error)
    }
})

//generating token

userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(error){
        console.log(error)
    }
}


const User = mongoose.model('USERDATA', userSchema);

module.exports = User;
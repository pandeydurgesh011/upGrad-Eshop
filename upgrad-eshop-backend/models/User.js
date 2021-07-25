const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema

const UserSchema = new mongoose.Schema({

    createdAt:{
        type: Date, 
        //required: true, 
        default: Date.now
    },
    
    email: {
        type: String,
        //required: true,
        unique: true
    },
    
    first_name: {
        type: String,
        //required:true,
    },

    last_name: {
        type: String,
        //required:true,
    },

    password: {
        type: String,
        //required: true,
    },

    contact_number:{
        type: Number,
        //required: true,
    },

    role:{
        type: String,
        default: 'user',
        //required:true,
    },

    updatedAt:{
        type: Date, 
        //required: true, 
        default: Date.now
    },

    user_name:{
        type:String,
        //required:true
    }


});

// Before Saving anything on db (hashing the password before saving)
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Verify Password (Verfying Password for Login func)
UserSchema.methods.isPasswordMatch = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
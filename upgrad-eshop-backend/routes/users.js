const express = require('express');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const usersRoute = express.Router();

//Register
usersRoute.post('/users', asyncHandler(async (req, res) => {
    const {first_name, last_name, email, contact_number, password} = req.body;

    const email_pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    
    const mobile_pattern = /^[0-9]{10}$/;

    const userExists = await User.findOne({email: email});

    const mobile_format = await mobile_pattern.test(contact_number);

    const email_format = await email_pattern.test(email);
    if(!email_format){
        res.status(501);
        throw new Error('Invalid email-id format!');

    }
    
    else if (userExists){
        res.status(409);
        throw new Error('Try any other email, this email is already registered!');
        
    }
    
    else if (!mobile_format){
        res.status(501);
        throw new Error('Invalid contact number!');

    }
    


    const userCreated = await User.create({first_name, last_name, email, contact_number, password});

    res.json({
        _id : userCreated._id,
        first_name : userCreated.first_name,
        last_name : userCreated.last_name,
        email : userCreated.email,
        contact_number : userCreated.contact_number,
        password : userCreated.password,
        role : 'user',
        //token : generateToken(userCreated._id)
    });
}));


//Login

usersRoute.post('/login', asyncHandler(async(req, res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user){
        res.status(401);
        throw new Error('This email has not been registered!');

    }

    else if (user && (await user.isPasswordMatch(password))){
        res.status(200);
        
        
        res.json({
            _id : user._id,
            name : user.first_name + " " + user.last_name,
            email : user.email,
            password : user.password,
            isAuthenticated : true,
            token : generateToken(user._id)
        });
        
        
    }else {
        res.status(401);
        throw new Error('Invalid Credentials');
    }
})
);

const generateToken = (userId) =>{
    return jwt.sign({id: userId}, 'nodejs', {
        expiresIn: '30d',
    });
};

module.exports = usersRoute;
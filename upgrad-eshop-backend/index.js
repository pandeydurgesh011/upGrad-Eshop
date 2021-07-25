const express = require('express');
const mongoose = require('mongoose');
const usersRoute = require('./routes/users');
const User = require('./models/User');
require('dotenv').config();
const app = express();

//db connect
const user = process.env.USER;
const password = process.env.PASSWORD;

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.jdexn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => console.log(' DB Connection Sucessful')).catch(err => console.log(err)); 

app.use(express.json());

//Routes
//Users routes
app.use('/users', usersRoute);

const port = process.env.PORT;

//const port = 2000;
app.listen(port, () =>{
    console.log(`Server running at port ${port}`);
});
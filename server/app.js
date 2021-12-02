const mongoose = require('mongoose');
const dotenv = require("dotenv");
const express = require('express');
const app = express();

dotenv.config({path:'./config.env'});

require('./DB/conn');

const User = require('./model/userSchema');

app.use(express.json());

app.use(require('./router/auth'));

const PORT = process.env.PORT;

// Middleware

const middleware =(req,res,next)=>{
console.log(`hello my middleware`);
next();
}

// app.get('/',(req, res) =>{
//   res.send('Hello World from the server app.js')
// });

// app.get('/about',middleware,(req, res) =>{
//     res.send('about')
//   });
  app.get('/contact',(req, res) =>{
    res.send('contact')
  });
  app.get('/Signin',(req, res) =>{
    res.send('Sign In')
  });
  app.get('/Signup',(req, res) =>{
    res.send('Sign Up')
  });
 
app.listen(PORT, ()=>{
  console.log(`server is running at port no ${PORT}`)
})
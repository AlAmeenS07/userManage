const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const Router = require('express-router');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const path = require('path');
const connectDb = require('./db/connectDb');
const session = require('express-session');
const nocache = require('nocache');
const auth = require('./middleware/auth')
require('dotenv').config()

const PORT = process.env.port;

const app = express();
const route = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use(express.static('public'))
app.use(expressLayout);
app.set('views' , path.join(__dirname , 'views'))
app.set('view engine' , 'ejs')

app.use(nocache())
app.use(session({
    name : "user.sid",
    secret : "myscret",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use('/user' , userRoute);
app.use('/admin' , adminRoute);

app.get("/" , auth.homeCheck, (req,res)=>{
    res.redirect("user/login")
})

app.use((req,res)=>{
    res.render("error")
})

app.use((err, req, res, next) => {
    console.log(err.message); 
    res.status(500).send("Something went wrong!" );
});

connectDb();

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`);
});

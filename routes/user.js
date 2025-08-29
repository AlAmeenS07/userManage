const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const userSchema = require('../model/userModel')
const auth = require("../middleware/auth")


router.route('/login')
    .get(auth.loginCheck , userController.getLogin)
    .post(validateLogin , userController.loginUser)

router.route('/signup')
    .get(auth.loginCheck ,userController.getSignup)
    .post(validateSignup , userController.registerUser);

router.get('/home' , auth.checkSession, userController.getHome)

router.post('/logout' ,auth.checkSession , userController.logout)


function validateLogin(req,res,next){
    let { email , password } = req.body;
    if(!email || !password){
        return res.render('user/login' , {msg : "Input Invalid"})
    }
    if(!email || !email.includes("@")){
        return res.render("user/login" , {msg : "Invalid Email"})
    }
    if(!password || password.trim() == ""){
        return res.render("user/login" , {msg : "Invalid Password"})
    }
    next();
}

function validateSignup(req,res,next){
    let { name , email , password , confirmpassword } = req.body
    if(name == "" || name.trim() == "" || /\d/.test(name)){
        return res.render("user/signup" , {msg : "User name must be valid letter" , success : "" , name : ""})
    }
    if(name.length < 4){
        return res.render("user/signup" , {msg : "User name must be 4 letters" , success : "" , name : ""})
    }
    if(!email || !email.includes("@")){
        return res.render("user/signup" , {msg : "Invlaid Email" , success : "" , name : ""})
    }
    if(!password || password.trim() == ""){
        return res.render("user/signup" , {msg : "Invalid Password" , success : "" , name : ""})
    }
    if(password.length < 6){
        return res.render("user/signup" , {msg : "Password length must be 6" , success : "" , name : ""})
    }
    if(password !== confirmpassword){
        return res.render("user/signup" , {msg : "Password not match" , success : "" , name : ""})
    }
    next()
}


module.exports = router;
const express = require('express');
const router = express.Router();
const adminControl = require('../controllers/adminController');
require('dotenv').config();
const adminAuth = require('../middleware/adminAuth')
const Users = require('../model/userModel')

const ADMINPASS = process.env.adminpass;
const ADMINNAME = process.env.adminname;

router.route('/login')
    .get(adminAuth.loginCheck , adminControl.getLogin)
    .post(validateLogin , adminControl.getDash);

router.get('/dashboard' ,adminAuth.checkSession, adminControl.loadDash)

router.route('/add-user')
    .get(adminAuth.checkSession, adminControl.getAddUser)
    .post(validateAdd , adminControl.addUser)

router.route('/edit-user/:id')
    .get(adminAuth.checkSession , adminControl.getEditUser)
    .post(validateEdit , adminControl.editUser)

router.get('/delete/:id' , adminAuth.checkSession , adminControl.deleteUser)

router.post('/logout' , adminAuth.checkSession, adminControl.logout);


function validateLogin(req,res,next){
    let {username , password} = req.body;
    if(username.trim() == "" || password.trim() == ""){
        return res.render('admin/login' , {msg : "Invalid Input"})
    }
    if(/\d/.test(username)){
        return res.render('admin/login' , {msg : "username must be letter"})
    }
    if(username != ADMINNAME || password != ADMINPASS ){
        return res.render('admin/login' , {msg : "Invalid Authorisation"})
    }
    next();
}

function validateAdd(req,res,next){
    let {name , email , password , confirmPassword} = req.body;

    if(name.trim() == "" || name == "" || email == "" || !email.includes("@") || password == "" || password.trim() == "" || confirmPassword == "" || confirmPassword.trim() == ""){
        return res.render('admin/addUser' , {msg : "Invalid Input" , success : ""})
    }
    if(/\d/.test(name)){
        return res.render('admin/addUser' , {msg : "Name must be letter" , success : ""})
    }
    if(name.length < 4){
        return res.render("admin/addUser" , {msg : "Name must be 4 letters" , success : ''})
    }
    if(password.length < 6){
        return res.render('admin/addUser' , {msg : "Password length must be atlest 6 " , success : ""})
    }
    if(password !== confirmPassword){
        return res.render('admin/addUser' , {msg : "Password not match" , success : ""})
    }
    next()
}

function validateEdit(req,res,next){
    let {name} = req.body;
    let id = req.params.id;

    if(name.trim() == "" || name == ""){
        Users.findById(id).then(user => {
            return res.render("admin/editUser", {
                msg : "Invalid Input",
                user : { _id: id, name, email: user.email }
            })
        })
        return;
    }

    if(/\d/.test(name)){
        Users.findById(id).then(user => {
            return res.render("admin/editUser", {
                msg : "User name must be letter",
                user : { _id: id, name, email: user.email }
            })
        })
        return;
    }

    next();
}


module.exports = router
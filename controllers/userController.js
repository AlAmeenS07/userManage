const userSchema = require('../model/userModel')
const bcrypt = require('bcrypt');
const swal = require('sweetalert');

const getSignup = async (req,res)=>{
    res.render("user/signup" , {msg : null , success : "" , name : ""})
}

const registerUser = async (req, res) => {
    try {
        let { name, email, password , role , isDelete } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password , salt)
        const user = await userSchema.findOne({ email });
        if(name.trim() == ""){
            return res.render("user/signup" , {msg : "Name field must be non-empty" , success : "" , name : ""})
        }
        if(/\d/.test(name)){
            return res.render("user/signup" , {msg : "Name must be letter" , success : "" , name : ""})
        }
        if (user) {
            return res.render("user/signup", { msg: "User already exist" , success : "" , name : ""})
        }
        const newUser = new userSchema({
            name,
            email,
            password : hashPass,
            role ,
            isDelete
        })
        await newUser.save();
        req.session.user = name;
        res.render("user/signup" , {msg : "" , success : "Registered Successfully" , name : ""});

    } catch (err) {
        console.log(err.message)
    }
}

const getLogin = async (req,res)=>{
    res.render("user/login" , {msg : null})
}

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await userSchema.findOne({email})
        if (!user) {
            return res.render("user/login", { msg: "Invalid user" })
        }
        if(user.isDelete){
            return res.render("user/login" , {msg : "You have been deleted by admin"});
        }
        const compPass = await bcrypt.compare(password , user.password)
        if(!compPass){
            return res.render("user/login" , {msg : "Incorrect password"})
        }
        req.session.user = user.name
        res.redirect('home')
        
    } catch (error) {
        console.log(error.message)
    }
}

const getHome = async (req,res)=>{
    let name = req.session.user
    
    res.render("user/home" , {msg : name})
}

const logout = async (req,res)=>{
    req.session.user = null;
    req.session.destroy()
    res.clearCookie('user.sid');
    res.redirect("login")
}

module.exports = {
    getSignup,
    registerUser,
    getLogin,
    loginUser,
    getHome,
    logout
};

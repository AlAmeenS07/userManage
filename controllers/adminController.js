const Users = require('../model/userModel')
const bcrypt = require('bcrypt');
const swal = require('sweetalert');

let unauth;

const getLogin = async (req, res) => {
    console.log(unauth)
    if (unauth) {
        unauth = false;
        return res.render('admin/login', { msg: "Unauthorized" })
    }
    res.render("admin/login", { msg: null })
}

const getDash = async (req, res) => {
    try {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.log(err.message)
    }
}

const loadDash = async (req, res) => {
    try {
        const admin = req.session.admin
        if (!admin) {
            unauth = true;
            return res.redirect('/admin/login')
        }

        let page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        let search = req.query.search || "";

        let query = {};

        if(search){
            query = {name : {$regex : `^${search}` , $options : "i"} }
        }

        const users = await Users.find(query).collation({locale : "en"}).sort({ name: 1 }).skip(skip).limit(limit);

        const totalUsers = await Users.find({}).countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        let success = req.query.success;

        res.render("admin/dashboard", { users, currentPage: page, totalPages , success , search})
    } catch (error) {
        console.log(error.message)
    }
}

const getAddUser = async (req, res) => {
    res.render('admin/addUser', { msg: null , success : ""})
}

const addUser = async (req, res) => {
    try {
        let { name, email, password, role, isDelete } = req.body;
        let user = await Users.findOne({ email });
        if (user) {
            return res.render('admin/addUser', { msg: "User already exist" , success : "" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt)
        let newUser = new Users({
            name,
            email,
            password: hashPass,
            role,
            isDelete
        })
        await newUser.save()
        res.render("admin/addUser", { success: "User Registered Successfully" , msg : "" });

    } catch (error) {
        console.log(error.message);
        res.render("admin/addUser", { msg: "Something went wrong!" });
    }

}

const getEditUser = async(req,res)=>{
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId);
        if(!user){
            return res.render('admin/dashboard')
        }
        res.render('admin/editUser' , {user , success : "" , msg : ""});
    } catch (error) {
        console.log(error.message)
    }
}

const editUser = async(req,res)=>{
    try {
        let userId = req.params.id;
        let name = req.body.name;
        
        await Users.findByIdAndUpdate(userId , {name : name});

        res.redirect('/admin/dashboard?success=Updated Successfully');


    } catch (error) {
        console.log(error.message)
    }
}

const deleteUser = async(req,res)=>{
    try {
        let userId = req.params.id;

        await Users.findByIdAndUpdate(userId , {isDelete : true});

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(err.message)
    }
}

const logout = async (req, res) => {
    req.session.admin = null;
    req.session.destroy()
    res.clearCookie('user.sid')
    res.redirect('login')
}

module.exports = {
    getLogin,
    getDash,
    loadDash,
    logout,
    getAddUser,
    addUser,
    getEditUser,
    editUser,
    deleteUser
}
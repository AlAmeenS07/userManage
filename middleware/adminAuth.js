const checkSession = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect("login")
    }
}

const loginCheck = (req,res,next)=>{
    if(req.session.admin){
        res.redirect("dashboard")
    }else{
        next()
    }
}


module.exports = {
    checkSession,
    loginCheck,
}
const checkSession = (req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect("login")
    }
}

const loginCheck = (req,res,next)=>{
    if(req.session.user){
        res.redirect("home")
    }else{
        next()
    }
}

const homeCheck = (req,res,next)=>{
    if(req.session.user){
        res.redirect('user/home')
    }else{
        next()
    }
}

module.exports = {
    checkSession,
    loginCheck,
    homeCheck
}
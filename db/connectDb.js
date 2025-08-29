const mongoose = require('mongoose');

async function connectDb(){
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/userManage' , {});
        console.log("MongoDb connected" , conn.connection.host)
    }catch(err){
        console.log(err.message)
    }
}

module.exports = connectDb;
const mongoose = require('mongoose');
const db=async()=>{
    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected')
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
module.exports={db}
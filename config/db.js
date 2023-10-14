const mongoose = require('mongoose');
//const MONGO_URI='mongodb://localhost:27017/books'

const conectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('mongo connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectDB;
const mongoose = require('../dataBase/mongoDB');

const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
}, {collection:'usuarios'});


/* CRIANDO MODEL */
const User = mongoose.model('User', userSchema);

module.exports = {User};
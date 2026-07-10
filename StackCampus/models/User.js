const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['student', 'admin','teacher'],
        default: 'student'
    },
    phone:{
        type: Number,
    },
    image : {
        type: String,
        default: 'default.png',
        set: (v) => v === '' ? 'default.png' : v
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
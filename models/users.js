const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
    {

    uuid: { 
        type: String,
        unique: true,
        required: true, 
        min: 36,
        max: 36,
    },
    reftoken: {
        type: String,
        required: false,
    }
}) 

const USER = mongoose.model('User', userSchema, 'users');

module.exports = USER;
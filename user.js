const mongoose = require('mongoose');

let uSchema = new mongoose.Schema({

    fn:{
        type: String,
        required: true
    },

    ln:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    gender:{
        type: String,
        required: true
    },

    stateOfOrigin:{
        type: String,
        required: true
    },

    img:{
        data: Buffer,
        contentType: String,
        // required: true
    },

   date_joined:{
        type: Date,
        default: Date.now()
    }
})

module.exports = new mongoose.model('User', uSchema);
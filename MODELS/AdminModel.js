const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    _name:{
        type: 'string',
        required: true
    },
    _email:{
        type: 'string',
        required: true
    },
    _phone:{
        type: 'string',
        required: true
    },
    _password:{
        type: 'string',
        required: true
    }
})
module.exports = mongoose.model('AdminData',AdminSchema);
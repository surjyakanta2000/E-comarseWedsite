const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminProductSchema = new Schema({
    _title:{
        type: 'string',
        required: true
    },
    _description:{
        type: 'string',
        required: true
    },
    _price:{
        type: 'number',
        required: true
    },
    _image:{
        type: 'string',
        required: true
    }
})
module.exports = mongoose.model('AdminProductData',AdminProductSchema);
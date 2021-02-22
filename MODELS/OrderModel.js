const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOrderSchema = new Schema({
    products:[{
        type:Schema.Types.Object,
        required: true
    }],
    shippingData:{
        type:Schema.Types.Object,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required: true
    }
    
})
module.exports = mongoose.model('UserOrderData',UserOrderSchema);
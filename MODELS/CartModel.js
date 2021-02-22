const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    Cart:{
            type:Schema.Types.Object,
            required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required: true
    },
    productId:{
        type:Schema.Types.ObjectId,
        required: true
    }

})
module.exports = mongoose.model('Usercart',CartSchema);
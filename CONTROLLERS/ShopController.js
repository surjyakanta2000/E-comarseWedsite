const AdminProductModule = require('../MODELS/AdminProductModel');
const UserModel = require('../MODELS/UserModel');
const CartModel = require('../MODELS/CartModel');
exports.shopView=(req,res)=>{
    AdminProductModule.find().then(viewProducts=>{
        res.render('SHOP/shopPage',
        {
            data: viewProducts,
            path:'/shop/product_details'
        });
    })
}
exports.productDataView=(req,res)=>{
    const product_id = req.params.product_id;
    AdminProductModule.findById(product_id).then(viewProductsDetails=>{
        // console.log(viewProductsDetails);
        res.render('SHOP/pDetailsPage',{
            path:'/shop/product_details',
            data: viewProductsDetails
        });
    }).catch(err=>{
        console.log(err);
    })
}
// document.addEventListener('DOMContentLoaded', () => {
exports.checkoutView=(req,res)=>{
    // const product_quantity = document.getElementsByClassName('.quantity');
    // console.log(product_quantity);
    const user_id = req.params.userId;
    // console.log(user_id);
    UserModel.findById(user_id).then(userinfo=>{
        console.log(userinfo);
            CartModel.find({userId:user_id}).then(cartProduct=>{
            console.log(cartProduct);
            // let arr=[];
            // arr.push(cartProduct);
            // console.log(arr);
            res.render('USER/CheckoutPage',{
            userData:userinfo,cartData:cartProduct,
            path:'/shop/checkout'
        }) 
    }).catch(error=>{
        console.log(error);
    })
})

}
// })
exports.errorView=(req,res) =>{
    res.render('404');
}

const UserModel = require('../MODELS/UserModel');
const CartModel = require('../MODELS/CartModel');
const AdminProductModule = require('../MODELS/AdminProductModel');
const OrderModel = require('../MODELS/OrderModel');
const bcrypt = require('bcryptjs');
const e = require('express');

exports.userInterface=(req,res)=>{
    res.render('USER/UserPanel',
    {path:'/user',
    isAuthenticated:false
    });
}
exports.userRegisterPost=(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const age = req.body.age;
    const password = req.body.password;
    UserModel.findOne({_email:email}).then(userData=>{
        if(userData)
        {
            console.log('Email Already Exists');
            console.log(userData);
            return res.redirect('/user/register');
        }
        return bcrypt.hash(password,12)
        .then(hashPassword=>{
            const UserData = new UserModel({_name:name,_email:email,_phone:phone,_age:age,_password:hashPassword});
            return UserData.save()
            }).then(result=>{
                console.log("User Created!");
                res.redirect('/user/login');
            }).catch(error=>{
                console.log(error);
            })
        }).catch(error=>{
            console.log(error);
    })
}
exports.userInterfaceLogin=(req,res)=>{
    res.render('USER/UserPanel',
    {path:'/user'
    });
}
exports.userLoginPost=(req,res)=>{
    const UserEmail = req.body.email;
    const UserPassword = req.body.password;
    const UserCheck = req.body.check;

    UserModel.findOne({_email:UserEmail}).then(Userlogin=>{
        if(!Userlogin)
        {
            console.log('Email not found!!');
            res.redirect('/user/login');
        }
        bcrypt.compare(UserPassword,Userlogin._password).then(result=>{
            if(result)
            {
                console.log('Login Successful');
                req.session.isLoggedIn = true;
                req.session.user = Userlogin;
                return req.session.save(err=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(UserCheck)
                        {
                            const cookieData = {email:Userlogin._email,password:UserPassword}
                            res.cookie("cookieData",cookieData,{
                                expires: new Date(Date.now() + 60000),
                                httpOnly: true
                            })
                        }
                    }
                    console.log('User-session Login');
                    res.redirect('/shop',
                    );
                })
            }
        }).catch(err=>{
            console.log(err);
        })
    })
}
exports.userLogoutView=(req,res)=>{
    res.render('USER/UserLogout',
    {path:'/user/logout'
    })
}
exports.userLogout=(req,res)=>{
    req.session.destroy();
    res.redirect('/user/login');
}
exports.userCartViewPage=(req,res)=>{
    const user_id = req.session.user._id;
    CartModel.find({userId: user_id}).then(viewProductsCart=>{
        console.log(viewProductsCart);
        res.render('USER/CartPage',{
            path:'/user/cart',
            data: viewProductsCart
        });
    }).catch(err=>{
        console.log(err);
    })
}
exports.userCartView=(req,res)=>{
    const product_id=req.params.product_id;   
    const Cart = [];
    console.log(product_id);
    const user_id = req.session.user._id;
    console.log(user_id);
    CartModel.find({userId: user_id,productId: product_id}).then(userCrt=>{
        console.log(userCrt);
        if(userCrt==''){
            AdminProductModule.findById(product_id).then(product_cart=>{
                // console.log(product_cart);
                Cart.push(product_cart);
                const cartProduct =new CartModel({Cart:Cart,userId:user_id,productId:product_id});
                cartProduct.save().then(result=>{
                    console.log('product add into cart');
                    res.redirect('/user/cart');
                }).catch(err=>{
                    console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
        }
        // console.log(userCrt[0].productId);
        else if(userCrt[0].productId==product_id){
            console.log("Product already In cart");
            res.redirect('/user/cart');
        }
        else
        {
        AdminProductModule.findById(product_id).then(product_cart=>{
            // console.log(product_cart);
            Cart.push(product_cart);
            const cartProduct =new CartModel({Cart:Cart,userId:user_id,productId:product_id});
            cartProduct.save().then(result=>{
                console.log('product add into cart');
                res.redirect('/user/cart');
            }).catch(err=>{
                console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
    }
});
}
exports.userCartDelete=(req,res)=>{
    const cart_id=req.params.cart_id;
    CartModel.deleteOne({_id:cart_id}).then(result=>{
        console.log(result);
        res.redirect('/user/cart');
        console.log("product deleted from cart");
    }).catch(err=>{
        console.log(err);
    }) 
}
exports.userGamePlay=(req,res)=>{
    res.render('USER/GamePage',
    {path:'/user/game-center'}
    )
}
exports.userOrder=(req,res)=>{
    const product_id = req.body.product_id;
    const user_id = req.body.userId;
    const amt_check = req.body.check;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const shippingAdd = 'Name:'+name+'\n'+'Payment:' +amt_check+'\n' +'Address:' + address+'\n'+'Phone:'+phone+'\n'+'Email:'+ email;
    // console.log(shippingAdd);
    // console.log(product_id);

    if(amt_check)
    {
    const arrProduct=[];
    AdminProductModule.findById(product_id).then(product=>{
        arrProduct.push(product);
        const OrderProduct = new OrderModel({products:arrProduct,shippingData:shippingAdd,userId:user_id});
        OrderProduct.save().then((result)=>{
            console.log(result);
            res.redirect('/user/orderDone')
        }).catch((error)=>{
            console.log(error);
        }).catch(error=>{
            console.log(error);
        })
    })
    }
    else {
        res.redirect('/shop/error');
    }
}
exports.userOrderDone = (req, res) => {
    res.render('USER/orderDone');
}

const path = require('path');
const AdminModule = require('../MODELS/AdminModel');
const AdminProductModule = require('../MODELS/AdminProductModel');
const bcrypt = require('bcryptjs');

exports.AdminLogin=(req,res)=>{
    res.render('ADMIN/adminView',
    {path:'/admin/login'}
    );
}
exports.HomeView=(req,res)=>{
    res.render('landingPage',
    {
        path:'/home' 
    });
}
exports.AdminRegisterView=(req,res)=>{
    res.render('ADMIN/adminView',{
        path:'/admin/register'
    });
}
exports.AdminRegister=(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;

    AdminModule.findOne({_email:email}).then(adminData=>{
        if(adminData)
        {
            console.log('Email Already Exists');
            console.log(adminData);
            return res.redirect('/admin/register');
        }
        return bcrypt.hash(password,12)
        .then(hashPassword=>{
            const AdminData = new AdminModule({_name:name,_email:email,_phone:phone,_password:hashPassword});
            return AdminData.save()
            }).then(result=>{
                console.log("Admin Created!");
                res.redirect('/admin/login');
            }).catch(error=>{
                console.log(error);
            })
        }).catch(error=>{
            console.log(error);
    })
}
exports.AdminLoginPost=(req,res)=>{
    const AdminEmail = req.body.email;
    const AdminPassword = req.body.password;
    const AdminCheck = req.body.check;

    AdminModule.findOne({_email:AdminEmail}).then(Adminlogin=>{
        if(!Adminlogin)
        {
            console.log('Email not found!!');
            res.redirect('/admim/login');
        }
        bcrypt.compare(AdminPassword,Adminlogin._password).then(result=>{
            if(result)
            {
                console.log('Login Successful');
                req.session.isLoggedIn = true;
                req.session.admin = Adminlogin;
                return req.session.save(err=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(AdminCheck)
                        {
                            const cookieData = {email:Adminlogin._email,password:AdminPassword}
                            res.cookie("cookieData",cookieData,{
                                expires: new Date(Date.now() + 60000),
                                httpOnly: true
                            })
                        }
                    }
                    console.log('Admin-session Login');
                    res.redirect('/admin/admin-panel/add-product');
                })
            }
        }).catch(err=>{
            console.log(err);
        })
    })
}
exports.AdminAddProduct=(req,res)=>{
    res.render('ADMIN/adminPanel',{
        path:'/admin/admin-panel/add-product'
    });
}
exports.AdminAddProductPost=(req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const product_image = req.file;
    const image = product_image.path;
    console.log(product_image);
    // const image = req.body.image;
    const Product =new AdminProductModule({_title:title,_description:description,_price:price,_image:image});
    Product.save().then(result=>{
        console.log('created product');
        res.redirect('/admin/admin-panel/product-view');
    }).catch(err=>{
        console.log(err);
    });
}
exports.adminDataView=(req,res)=>{

    AdminProductModule.find().sort({"_price":1}).then(Product=>{
        // console.log(Product);
        res.render('ADMIN/adminProductPage',{
        data:Product,
        path:'/admin/admin-panel/product-view'
        });
    }).catch(err=>{
        console.log(err);
    })
}
exports.adminDetailChange=(req,res)=>{
    const product_id=req.params.product_id;
    AdminProductModule.findById(product_id).then(Product=>{
    // console.log(Product);
  res.render('ADMIN/editProductDetails',
  {data:Product,
    path:'/admin/productEdit'
});
}).catch(err=>{
    console.log(err);
})
}
exports.AdmindataEdit=(req,res)=>{
    const product_id = req.body.product_id; 
    const update_title = req.body.title;
    const update_description = req.body.description;
    const update_price = req.body.price;
    const update_image = req.body.image;
    AdminProductModule.findById(product_id).then(product=>{
        product._title = update_title;
        product._description = update_description;
        product._price = update_price;
        product._image = update_image;
        return product.save().then(result=>{
        res.redirect('/admin/admin-panel/product-view');
        console.log("Save changes");
    })
    }).catch(err=>{
        console.log(err);
    })
}
exports.adminDetailDelete=(req,res)=>{
    const product_id=req.params.product_id;
    // AdminModule.findById(product_id).then(Product=>{
    // console.log(Product);
    // }
    AdminProductModule.deleteOne({_id:product_id}).then(result=>{
        console.log(result);
        res.redirect('/admin/admin-panel/product-view');
        console.log("delete product");
    }).catch(err=>{
        console.log(err);
    }) 
}
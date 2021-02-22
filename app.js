require('dotenv').config();
const express = require('express');
const app =  express();
const dotenv = require('dotenv');
const path = require('path');
const body_parser = require('body-parser');
const mongoose =  require('mongoose');
// const cSurf = require('csurf');
const multer = require('multer');
const flash = require('connect-flash');
const cookie_parser = require('cookie-parser');
const mongo_session = require('express-session');
const Mongodb_session = require('connect-mongodb-session')(mongo_session);
// const mongoDriver=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.drsuq.mongodb.net/${process.env.DB_NAME}`;
const AdminView = require('./ROUTERS/adminRoutes');
const UserView = require('./ROUTERS/userRoutes');
const AuthModule=require('./MODELS/AdminModel');
const userAuthModule = require('./MODELS/UserModel');
const ShopView = require('./ROUTERS/shopRoutes');
const port = process.env.PORT || 8000;

app.use(body_parser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/PUBLIC')));

app.use('/ADMIN-IMAGES',express.static(path.join(__dirname,'ADMIN-IMAGES')));

app.set('view engine', 'ejs');
app.set('views','VIEWS');

// const csurfProtection=cSurf();

const fileStorage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'ADMIN-IMAGES')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.includes("png") || file.mimetype.includes("jpg") || file.mimetype.includes("jpeg"))
    {
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

////////////////////////////////////////////////////////////////
//Admin Session
const storeValue=new Mongodb_session({
    uri:'mongodb+srv://surjya-database:sun12@cluster0.drsuq.mongodb.net/E-comerse',
    collection:'admin-session'
});
app.use(mongo_session({secret:'my-secret',resave:false,saveUninitialized:false,store:storeValue}));
app.use((req,res,next)=>{

    if(req,res,next)
    {
        return next();
    }
    AuthModule.findById(req.session.admin._id)  
    .then(adminValue=>{
        req.user=adminValue;
        console.log('app'+req.user)
        next();
    })
    .catch(err=>console.log(err));
});

////////////////////////////////////////////////////////////////
//User Session
const storeUserValue=new Mongodb_session({
    uri:'mongodb+srv://surjya-database:sun12@cluster0.drsuq.mongodb.net/E-comerse',
    collection:'user-session'
});
app.use(mongo_session({secret:'my-secret',resave:false,saveUninitialized:false,store:storeUserValue}));
app.use((req,res,next)=>{

    if(req,res,next)
    {
        return next();
    }
    userAuthModule.findById(req.session.user._id)  
    .then(userValue=>{
        req.user=userValue;
        console.log('app'+req.user)
        next();
    })
    .catch(err=>console.log(err));
});

app.use(multer({
    storage:fileStorage,fileFilter:fileFilter,limits:{
        fieldSize:1024*1024*5
    }
}).single('product_image'));

app.use(flash());
app.use(cookie_parser());

// app.use(csurfProtection);

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    // res.locals.csrfToken=req.csrfToken();
    next();
})

app.use(AdminView);
app.use(UserView);
app.use(ShopView);

app.use('/demo',(req,res)=>{
    res.render('User/CheckoutPage');
})

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    console.log(result);
    app.listen(port,()=>{
        console.log(`listening on port no:${port}`);
    });
}).catch(err=>{
    console.error(err);
});
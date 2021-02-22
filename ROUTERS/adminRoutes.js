const express = require('express');
const adminRouter = express.Router();
const ia_Authorized = require('../AUTHORIZATION/AdminAuth');
const admin_controller = require('../CONTROLLERS/AdminController');

adminRouter.get('/home', admin_controller.HomeView);
adminRouter.get('/admin/login',admin_controller.AdminLogin);
adminRouter.post('/admin/register',admin_controller.AdminRegister);
adminRouter.get('/admin/register',ia_Authorized,admin_controller.AdminRegisterView);
adminRouter.post('/admin/login',admin_controller.AdminLoginPost);
adminRouter.get('/admin/admin-panel/add-product',ia_Authorized,admin_controller.AdminAddProduct);
adminRouter.post('/admin/admin-panel/add-product',admin_controller.AdminAddProductPost);
adminRouter.get('/admin/admin-panel/product-view',ia_Authorized,admin_controller.adminDataView);
adminRouter.get('/admin/productEdit/:product_id',ia_Authorized,admin_controller.adminDetailChange);
adminRouter.post('/admin/productEdit',admin_controller.AdmindataEdit);
adminRouter.get('/admin/productDelet/:product_id',ia_Authorized,admin_controller.adminDetailDelete);


module.exports = adminRouter;
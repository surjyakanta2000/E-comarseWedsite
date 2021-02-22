const express = require('express');
const user_routes = express.Router();
const is_Authorized = require('../AUTHORIZATION/IsAuth');
const user_controller = require('../CONTROLLERS/UserController');

user_routes.get('/user',user_controller.userInterface);
user_routes.get('/user/login',user_controller.userInterfaceLogin);
user_routes.post('/user/login',user_controller.userLoginPost);
user_routes.post('/user/register',user_controller.userRegisterPost);
user_routes.get('/user/logout',is_Authorized,user_controller.userLogoutView);
user_routes.get('/logout',is_Authorized,user_controller.userLogout);
user_routes.get('/user/cart',is_Authorized,user_controller.userCartViewPage);
user_routes.get('/user/cart/:product_id',user_controller.userCartView);
user_routes.get('/user/cartDelete/:cart_id',user_controller.userCartDelete);
user_routes.get('/user/game-center',is_Authorized,user_controller.userGamePlay);
user_routes.post('/user/order',user_controller.userOrder);
user_routes.get('/user/orderDone',user_controller.userOrderDone);

module.exports =user_routes;
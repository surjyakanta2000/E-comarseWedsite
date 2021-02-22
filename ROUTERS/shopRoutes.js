const express = require('express');
const shop_routes = express.Router();
const is_Authorized = require('../AUTHORIZATION/IsAuth');
const shop_controller = require('../CONTROLLERS/ShopController');

shop_routes.get('/shop',shop_controller.shopView);
shop_routes.get('/shop/product_details/:product_id',is_Authorized,shop_controller.productDataView);
shop_routes.get('/shop/checkout/:userId',shop_controller.checkoutView);
shop_routes.get('/shop/error',shop_controller.errorView);

module.exports = shop_routes;
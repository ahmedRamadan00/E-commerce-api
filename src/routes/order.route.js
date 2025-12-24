const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.route('/orders/:id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrderById)
    .delete(orderController.deleteOrderById);

router.route('/orders')
    .post(orderController.makeNewOrder);

    
module.exports = router;
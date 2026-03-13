const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.route('/orders')
    .post(orderController.makeNewOrder);

router.route('/orders/:id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrderById)
    .delete(orderController.deleteOrderById);

module.exports = router;

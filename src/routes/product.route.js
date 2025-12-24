const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.route('/products')
    .get(productController.getAllProducts)
    .post(productController.createNewProduct)

router.route('/products/:id')
    .get(productController.getProductById)
    .put(productController.updateProductById)
    .delete(productController.deleteProductById)

module.exports = router;
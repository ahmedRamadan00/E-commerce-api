const productSchema = require('../models/product.models');

const getAllProducts = (req , res , next) =>{
    productSchema.find({})
    .then(products => res.status(200).json(products))
    .catch(err => next(err));
}

const getProductById = (req , res , next) =>{
    let productId = req.params.id;
    productSchema.findById(productId)
    .then(product => res.json(product))
    .catch(err => next(err));
}

const createNewProduct = (req , res , next) =>{
    let newProduct = new productSchema(req.body);
    newProduct.save()
    .then(product => res.status(201).json(product))
    .catch(err => next(err));
}

const updateProductById = (req , res , next) =>{
    let productId = req.params.id;
    let updateData = req.body;
    productSchema.findByIdAndUpdate(productId , updateData , {new: true})
    .then(product => res.json(product))
    .catch(err => next(err));
}

const deleteProductById = (req , res , next) =>{
    let productId = req.params.id;
    productSchema.findByIdAndDelete(productId)
    .then(() => res.status(204).end())
    .catch(err => next(err));
}

exports = module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProductById,
    deleteProductById
}
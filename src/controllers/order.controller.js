const orderSchema = require('../models/order.models');

const getOrderById = (req , res , next) =>{
    let orderId = req.params.id;
    orderSchema.findById(orderId)
    .then(order => res.json(order))
    .catch(err => next(err));
}

const makeNewOrder = (req , res , next) =>{
    let newOrder = new orderSchema(req.body);
    newOrder.save()
    .then(order => res.status(201).json(order))
    .catch(err => next(err));
}

const updateOrderById = (req , res , next) =>{
    let orderId = req.params.id;
    let updateData = req.body;
    orderSchema.findByIdAndUpdate(orderId , updateData , {new: true})
    .then(order => res.json(order))
    .catch(err => next(err));
}

const deleteOrderById = (req , res , next) =>{
    let orderId = req.params.id;
    orderSchema.findByIdAndDelete(orderId)
    .then(() => res.status(204).end())
    .catch(err => next(err));
}

exports = module.exports = {
    getOrderById,
    makeNewOrder,
    updateOrderById,
    deleteOrderById
}
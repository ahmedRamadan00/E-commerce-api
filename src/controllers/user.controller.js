const userSchema = require("../models/user.model");

const getAllUsers = (req , res , next) =>{
    userSchema.find({})
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
}

const getUserById = (req , res , next) =>{
    let userId = req.params.id;
    userSchema.findById(userId)
    .then(user => res.json(user))
    .catch(err => next(err));
}

const createNewUser = (req , res , next) =>{
    let newUser = new userSchema(req.body);
    newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
}

const updateUserById = (req , res , next) =>{
    let userId = req.params.id;
    let updateData = req.body;
    userSchema.findByIdAndUpdate(userId , updateData , {new: true})
    .then(user => res.json(user))
    .catch(err => next(err));
}

const deleteUserById = (req , res , next) =>{
    let userId = req.params.id;
    userSchema.findByIdAndDelete(userId)
    .then(() => res.status(204).end())
    .catch(err => next(err));
}

exports = module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    updateUserById,
    deleteUserById
}
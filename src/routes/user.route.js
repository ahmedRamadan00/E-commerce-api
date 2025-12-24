const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.route('/users')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)

router.route('/users/:id')
.get(userController.getUserById)
.put(userController.updateUserById)
.delete(userController.deleteUserById)

module.exports = router;
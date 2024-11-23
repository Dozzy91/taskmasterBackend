const express = require('express');

const { registerUser } = require('../controllers/userRegister');
const { loginUser } = require('../controllers/userLogin');
const { logoutUser } = require('../controllers/userLogout');

const Router = express.Router();

Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/logout', logoutUser);

module.exports = Router;